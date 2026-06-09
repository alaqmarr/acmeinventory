"use server";

import { prisma } from "@/lib/prisma";

export async function getMostSoldProducts(limit = 10) {
  const grouped = await prisma.saleItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  const productIds = grouped.map((g: any) => g.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  return grouped
    .map((g: any) => {
      const product = products.find((p: any) => p.id === g.productId);
      return {
        product,
        totalSold: g._sum.quantity || 0,
      };
    })
    .filter((i: any) => i.product);
}

export async function getAgingStock(daysOld = 90, limit = 10) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const batches = await prisma.stockBatch.findMany({
    where: {
      remaining: { gt: 0 },
      dateAdded: { lt: cutoffDate },
    },
    include: { product: true },
    orderBy: { dateAdded: "asc" },
    take: limit,
  });

  return batches.map((batch: any) => {
    const daysOldCalc = Math.floor(
      (new Date().getTime() - batch.dateAdded.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const capitalTiedUp = batch.remaining * batch.costPrice;

    return {
      batchId: batch.id,
      product: batch.product,
      remaining: batch.remaining,
      costPrice: batch.costPrice,
      dateAdded: batch.dateAdded,
      daysOld: daysOldCalc,
      capitalTiedUp,
    };
  });
}

export async function getProfitabilityMetrics() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentSaleItems = await prisma.saleItem.findMany({
    where: {
      sale: {
        date: { gte: thirtyDaysAgo },
      },
    },
    include: { product: true },
  });

  const profitMap = new Map<
    string,
    {
      product: any;
      totalRevenue: number;
      totalCost: number;
      totalProfit: number;
      quantitySold: number;
    }
  >();

  recentSaleItems.forEach((item: any) => {
    const revenue = item.unitSellPrice * item.quantity;
    const cost = item.unitCostPrice * item.quantity;
    const profit = revenue - cost;

    if (profitMap.has(item.productId)) {
      const existing = profitMap.get(item.productId)!;
      existing.totalRevenue += revenue;
      existing.totalCost += cost;
      existing.totalProfit += profit;
      existing.quantitySold += item.quantity;
    } else {
      profitMap.set(item.productId, {
        product: item.product,
        totalRevenue: revenue,
        totalCost: cost,
        totalProfit: profit,
        quantitySold: item.quantity,
      });
    }
  });

  const profitability = Array.from(profitMap.values()).map((p) => ({
    ...p,
    profitMargin:
      p.totalRevenue > 0 ? (p.totalProfit / p.totalRevenue) * 100 : 0,
  }));

  profitability.sort((a, b) => b.totalProfit - a.totalProfit);

  return profitability.slice(0, 10);
}

export async function getTopSellingMakes(limit = 5) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentSaleItems = await prisma.saleItem.findMany({
    where: {
      sale: {
        date: { gte: thirtyDaysAgo },
      },
    },
    include: { product: true },
  });

  const makeMap = new Map<
    string,
    {
      make: string;
      totalRevenue: number;
      quantitySold: number;
    }
  >();

  recentSaleItems.forEach((item: any) => {
    const make = item.product?.make;
    if (!make) return;

    const revenue = item.unitSellPrice * item.quantity;

    if (makeMap.has(make)) {
      const existing = makeMap.get(make)!;
      existing.totalRevenue += revenue;
      existing.quantitySold += item.quantity;
    } else {
      makeMap.set(make, {
        make,
        totalRevenue: revenue,
        quantitySold: item.quantity,
      });
    }
  });

  const makes = Array.from(makeMap.values());
  makes.sort((a, b) => b.totalRevenue - a.totalRevenue);

  return makes.slice(0, limit);
}

export async function getFamilyWiseSales(limit = 10) {
  const allSaleItems = await prisma.saleItem.findMany({
    include: { product: true }
  });

  const familyMap = new Map<string, {
    name: string;
    totalQuantity: number;
    totalRevenue: number;
    variants: Array<{ make: string | null; size: string | null; sku: string; quantity: number; revenue: number }>;
  }>();

  allSaleItems.forEach((item: any) => {
    if (!item.product) return;
    const key = item.product.name.toLowerCase();
    const originalName = item.product.name;
    const qty = item.quantity;
    const rev = item.quantity * item.unitSellPrice;
    
    if (!familyMap.has(key)) {
      familyMap.set(key, {
        name: originalName,
        totalQuantity: 0,
        totalRevenue: 0,
        variants: []
      });
    }
    
    const family = familyMap.get(key)!;
    family.totalQuantity += qty;
    family.totalRevenue += rev;
    
    const existingVariant = family.variants.find(v => v.sku === item.product.sku);
    if (existingVariant) {
      existingVariant.quantity += qty;
      existingVariant.revenue += rev;
    } else {
      family.variants.push({
        make: item.product.make,
        size: item.product.size,
        sku: item.product.sku,
        quantity: qty,
        revenue: rev
      });
    }
  });

  const families = Array.from(familyMap.values());
  families.forEach(f => f.variants.sort((a, b) => b.quantity - a.quantity));
  families.sort((a, b) => b.totalQuantity - a.totalQuantity);

  return families.slice(0, limit);
}
