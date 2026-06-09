"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateId } from "@/lib/utils";
export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      sku: true,
      category: true,
      defaultCostPrice: true,
      defaultSellingPrice: true,
      defaultGst: true,
      stockQuantity: true,
    },
  });
}
export async function addStock(data: {
  productId: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  supplier?: string;
}) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const batch = await tx.stockBatch.create({
        data: {
          id: generateId(
            "bat",
            `${data.productId.replace("prd-", "")}-${Date.now()}`,
          ),
          productId: data.productId,
          quantity: data.quantity,
          remaining: data.quantity,
          costPrice: data.costPrice,
          sellingPrice: data.sellingPrice,
          supplier: data.supplier || null,
        },
      });
      await tx.product.update({
        where: { id: data.productId },
        data: {
          stockQuantity: { increment: data.quantity },
          defaultCostPrice: data.costPrice,
          defaultSellingPrice: data.sellingPrice,
        },
      });
      return batch;
    });
    revalidatePath("/stock-inward");
    revalidatePath("/");
    revalidatePath("/products");
    return { success: true, batch: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
export async function getRecentBatches() {
  return await prisma.stockBatch.findMany({
    orderBy: { dateAdded: "desc" },
    take: 20,
    include: { product: { select: { name: true, sku: true } } },
  });
}
export async function getProductBatchHistory(productId: string) {
  return await prisma.stockBatch.findMany({
    where: { productId },
    orderBy: { dateAdded: "desc" },
    take: 10,
    select: {
      id: true,
      dateAdded: true,
      supplier: true,
      quantity: true,
      costPrice: true,
      sellingPrice: true,
    },
  });
}
