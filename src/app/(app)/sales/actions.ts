"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateId } from "@/lib/utils";
export async function searchProducts(query: string) {
  if (!query || query.length < 2) return [];
  return prisma.product.findMany({
    where: {
      OR: [{ name: { contains: query } }, { sku: { contains: query } }],
    },
    include: {
      batches: {
        where: { remaining: { gt: 0 } },
        orderBy: { dateAdded: "asc" },
      },
    },
    take: 10,
  });
}
export async function searchCustomers(query: string) {
  if (!query || query.length < 2) return [];
  return prisma.customer.findMany({
    where: {
      OR: [{ name: { contains: query } }, { phone: { contains: query } }],
    },
    take: 10,
  });
}
export async function createCustomer(data: { name: string; phone?: string }) {
  const id = generateId("cus", `${data.name}-${Date.now()}`);
  return prisma.customer.create({
    data: { id, name: data.name, phone: data.phone || null },
  });
}
export async function createSale(data: {
  customerId: string;
  isGstBill: boolean;
  items: { productId: string; quantity: number; unitSellPrice: number }[];
}) {
  if (!data.items || data.items.length === 0) {
    throw new Error("No items in the sale.");
  }
  return await prisma.$transaction(async (tx) => {
    let subtotalAmount = 0;
    let gstAmount = 0;
    const saleItemsData = [];
    for (const item of data.items) {
      if (item.quantity <= 0) continue;
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        include: {
          batches: {
            where: { remaining: { gt: 0 } },
            orderBy: { dateAdded: "asc" },
          },
        },
      });
      if (!product) throw new Error(`Product not found.`);
      if (product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      let remainingToFulfill = item.quantity;
      let itemSubtotal = 0;
      for (const batch of product.batches) {
        if (remainingToFulfill <= 0) break;
        const qtyFromBatch = Math.min(batch.remaining, remainingToFulfill);
        remainingToFulfill -= qtyFromBatch;
        const subtotal = qtyFromBatch * item.unitSellPrice;
        itemSubtotal += subtotal;
        let itemGst = 0;
        if (data.isGstBill) {
          itemGst = (subtotal * product.defaultGst) / 100;
        }
        saleItemsData.push({
          id: generateId(
            "itm",
            `${product.sku}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          ),
          productId: product.id,
          batchId: batch.id,
          quantity: qtyFromBatch,
          unitCostPrice: batch.costPrice,
          unitSellPrice: item.unitSellPrice,
          subtotal: subtotal,
          gstAmount: itemGst,
        });
        await tx.stockBatch.update({
          where: { id: batch.id },
          data: { remaining: { decrement: qtyFromBatch } },
        });
      }
      if (remainingToFulfill > 0) {
        throw new Error(`Not enough valid batch stock for ${product.name}`);
      }
      await tx.product.update({
        where: { id: product.id },
        data: { stockQuantity: { decrement: item.quantity } },
      });
      subtotalAmount += itemSubtotal;
      if (data.isGstBill) {
        gstAmount += (itemSubtotal * product.defaultGst) / 100;
      }
    }
    const totalAmount = subtotalAmount + gstAmount;
    const saleId = generateId("sal", `sale-${Date.now()}`);

    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const todaysCount = await tx.sale.count({ where: { date: { gte: todayStart } } });
    const dateStr = `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${(new Date().getDate()).toString().padStart(2, '0')}`;
    const seqStr = (todaysCount + 1).toString().padStart(3, '0');
    const invoiceNumber = `INV-${dateStr}-${seqStr}`;

    const sale = await tx.sale.create({
      data: {
        id: saleId,
        invoiceNumber,
        customerId: data.customerId,
        isGstBill: data.isGstBill,
        subtotalAmount,
        gstAmount,
        totalAmount,
        items: { create: saleItemsData },
      },
    });
    return sale;
  });
}
export async function getRecentSales() {
  return prisma.sale.findMany({
    orderBy: { date: "desc" },
    take: 20,
    include: { customer: true, items: { include: { product: true } } },
  });
}
