"use server";
import { prisma } from "@/lib/prisma";

export type LedgerEntryType = "SALE" | "STOCK_IN";

export interface LedgerEntry {
  id: string;
  date: string; // ISO string for serialization
  type: LedgerEntryType;
  description: string;
  amount: number; // positive for sales revenue, negative for stock purchases
  details: SaleDetails | StockInDetails;
}

export interface SaleDetails {
  kind: "sale";
  customerName: string;
  customerPhone: string | null;
  isGstBill: boolean;
  subtotalAmount: number;
  gstAmount: number;
  totalAmount: number;
  itemCount: number;
  items: {
    productName: string;
    make?: string | null;
    size?: string | null;
    sku: string;
    quantity: number;
    unitSellPrice: number;
    subtotal: number;
    gstAmount: number;
  }[];
}

export interface StockInDetails {
  kind: "stock_in";
  productName: string;
  make?: string | null;
  size?: string | null;
  productSku: string;
  supplier: string | null;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  totalCost: number;
}

export interface LedgerFilters {
  startDate?: string;
  endDate?: string;
  type?: "all" | "sale" | "stock-in";
}

export interface LedgerResult {
  entries: LedgerEntry[];
  totalRevenue: number;
  totalPurchases: number;
  netBalance: number;
}

export async function getLedgerEntries(
  filters?: LedgerFilters,
): Promise<LedgerResult> {
  const { startDate, endDate, type = "all" } = filters || {};

  // Build date filter
  const dateFilter: { gte?: Date; lte?: Date } = {};
  if (startDate) {
    dateFilter.gte = new Date(startDate);
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    dateFilter.lte = end;
  }
  const hasDateFilter = Object.keys(dateFilter).length > 0;

  const entries: LedgerEntry[] = [];

  // Fetch Sales
  if (type === "all" || type === "sale") {
    const sales = await prisma.sale.findMany({
      where: hasDateFilter ? { date: dateFilter } : undefined,
      include: {
        items: {
          include: {
            product: { select: { name: true, sku: true, make: true, size: true } },
          },
        },
        customer: true,
      },
      orderBy: { date: "desc" },
    });
    for (const sale of sales) {
      const itemCount = sale.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      entries.push({
        id: `sale-${sale.id}`,
        date: sale.date.toISOString(),
        type: "SALE",
        description: sale.customer?.name
          ? `Sale to ${sale.customer.name} — ${itemCount} item${itemCount !== 1 ? "s" : ""}`
          : `Sale — ${itemCount} item${itemCount !== 1 ? "s" : ""}`,
        amount: sale.totalAmount,
        details: {
          kind: "sale",
          customerName: sale.customer?.name || "Unknown",
          customerPhone: sale.customer?.phone || null,
          isGstBill: sale.isGstBill,
          subtotalAmount: sale.subtotalAmount,
          gstAmount: sale.gstAmount,
          totalAmount: sale.totalAmount,
          itemCount,
          items: sale.items.map((item) => ({
            productName: item.product.name,
            make: item.product.make,
            size: item.product.size,
            sku: item.product.sku,
            quantity: item.quantity,
            unitSellPrice: item.unitSellPrice,
            subtotal: item.subtotal,
            gstAmount: item.gstAmount,
          })),
        },
      });
    }
  }

  // Fetch Stock Batches
  if (type === "all" || type === "stock-in") {
    const batches = await prisma.stockBatch.findMany({
      where: hasDateFilter ? { dateAdded: dateFilter } : undefined,
      include: {
        product: { select: { name: true, sku: true, make: true, size: true } },
      },
      orderBy: { dateAdded: "desc" },
    });
    for (const batch of batches) {
      const totalCost = batch.quantity * batch.costPrice;
      entries.push({
        id: `stock-${batch.id}`,
        date: batch.dateAdded.toISOString(),
        type: "STOCK_IN",
        description: batch.supplier
          ? `Stock from ${batch.supplier} — ${batch.product.name} (${batch.quantity} units)`
          : `Stock inward — ${batch.product.name} (${batch.quantity} units)`,
        amount: -totalCost,
        details: {
          kind: "stock_in",
          productName: batch.product.name,
          make: batch.product.make,
          size: batch.product.size,
          productSku: batch.product.sku,
          supplier: batch.supplier,
          quantity: batch.quantity,
          costPrice: batch.costPrice,
          sellingPrice: batch.sellingPrice,
          totalCost,
        },
      });
    }
  }

  // Sort by date descending
  entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Calculate totals
  const totalRevenue = entries
    .filter((e) => e.type === "SALE")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalPurchases = entries
    .filter((e) => e.type === "STOCK_IN")
    .reduce((sum, e) => sum + Math.abs(e.amount), 0);
  const netBalance = totalRevenue - totalPurchases;

  return {
    entries,
    totalRevenue,
    totalPurchases,
    netBalance,
  };
}
