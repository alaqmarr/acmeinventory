"use server";
import { prisma } from "@/lib/prisma";
import * as xlsx from "xlsx";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function generateExportFile() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPERADMIN") throw new Error("Unauthorized");

  const [products, clients, sales, stockBatches] = await Promise.all([
    prisma.product.findMany(),
    prisma.customer.findMany(),
    prisma.sale.findMany({ include: { items: true, customer: true } }),
    prisma.stockBatch.findMany({ include: { product: true } })
  ]);

  const wb = xlsx.utils.book_new();

  // Products Sheet
  const productsSheet = xlsx.utils.json_to_sheet(products.map(p => ({
    ID: p.id,
    SKU: p.sku,
    Name: p.name,
    Make: p.make,
    Size: p.size,
    Category: p.category,
    "Stock Qty": p.stockQuantity,
    "Def. Sell Price": p.defaultSellingPrice,
    "Def. Cost Price": p.defaultCostPrice,
    "GST %": p.defaultGst,
  })));
  xlsx.utils.book_append_sheet(wb, productsSheet, "Products");

  // Clients Sheet
  const clientsSheet = xlsx.utils.json_to_sheet(clients.map(c => ({
    ID: c.id,
    Name: c.name,
    Phone: c.phone,
    "Created At": c.createdAt.toISOString()
  })));
  xlsx.utils.book_append_sheet(wb, clientsSheet, "Clients");

  // Sales Sheet
  const salesSheet = xlsx.utils.json_to_sheet(sales.map(s => ({
    ID: s.id,
    "Invoice #": s.invoiceNumber,
    "Client Name": s.customer?.name,
    "Subtotal": s.subtotalAmount,
    "GST Amount": s.gstAmount,
    "Total": s.totalAmount,
    "Date": s.date.toISOString(),
    "Items Count": s.items.length
  })));
  xlsx.utils.book_append_sheet(wb, salesSheet, "Sales");

  // Stock Batches Sheet
  const batchesSheet = xlsx.utils.json_to_sheet(stockBatches.map(b => ({
    ID: b.id,
    "Product Name": b.product?.name,
    "Supplier": b.supplier,
    "Original Qty": b.quantity,
    "Remaining Qty": b.remaining,
    "Cost Price": b.costPrice,
    "Selling Price": b.sellingPrice,
    "Date Added": b.dateAdded.toISOString()
  })));
  xlsx.utils.book_append_sheet(wb, batchesSheet, "Stock Batches");

  const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
  return buffer.toString('base64');
}
