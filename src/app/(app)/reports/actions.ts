"use server";
import { prisma } from "@/lib/prisma";

export async function getCategories() {
  const products = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  return products.map((p) => p.category).filter(Boolean) as string[];
}

export async function getProductsForFilter() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, sku: true },
    orderBy: { name: "asc" },
  });
  return products;
}

export type ReportFilters = {
  startDate: string;
  endDate: string;
  productId?: string;
  category?: string;
};

export async function getReportData(filters: ReportFilters) {
  const { startDate, endDate, productId, category } = filters;
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T23:59:59.999`);

  const saleItems = await prisma.saleItem.findMany({
    where: {
      sale: {
        date: {
          gte: start,
          lte: end,
        },
      },
      ...(productId ? { productId } : {}),
      ...(category ? { product: { category } } : {}),
    },
    include: {
      sale: true,
      product: true,
    },
  });

  let totalRevenue = 0;
  let totalCost = 0;
  let totalGst = 0;

  const productMap: Record<
    string,
    {
      id: string;
      name: string;
      sku: string;
      qty: number;
      revenue: number;
      cost: number;
      profit: number;
    }
  > = {};
  const categoryMap: Record<
    string,
    { name: string; qty: number; revenue: number; cost: number; profit: number }
  > = {};
  const uniqueSaleIds = new Set<string>();

  for (const item of saleItems) {
    uniqueSaleIds.add(item.saleId);
    const revenue = item.subtotal;
    const cost = item.unitCostPrice * item.quantity;
    const profit = revenue - cost;
    const gst = item.gstAmount;
    totalRevenue += revenue;
    totalCost += cost;
    totalGst += gst;

    // Product breakdown
    if (!productMap[item.productId]) {
      productMap[item.productId] = {
        id: item.productId,
        name: item.product.name,
        sku: item.product.sku,
        qty: 0,
        revenue: 0,
        cost: 0,
        profit: 0,
      };
    }
    productMap[item.productId].qty += item.quantity;
    productMap[item.productId].revenue += revenue;
    productMap[item.productId].cost += cost;
    productMap[item.productId].profit += profit;

    // Category breakdown
    const cat = item.product.category || "Uncategorized";
    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        name: cat,
        qty: 0,
        revenue: 0,
        cost: 0,
        profit: 0,
      };
    }
    categoryMap[cat].qty += item.quantity;
    categoryMap[cat].revenue += revenue;
    categoryMap[cat].cost += cost;
    categoryMap[cat].profit += profit;
  }

  const totalProfit = totalRevenue - totalCost;

  return {
    totalSalesCount: uniqueSaleIds.size,
    totalRevenue,
    totalCost,
    totalGst,
    totalProfit,
    productBreakdown: Object.values(productMap).sort(
      (a, b) => b.revenue - a.revenue,
    ),
    categoryBreakdown: Object.values(categoryMap).sort(
      (a, b) => b.revenue - a.revenue,
    ),
  };
}
