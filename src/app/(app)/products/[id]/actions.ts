"use server";

import { prisma } from "@/lib/prisma";

export async function getProductAnalytics(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) throw new Error("Product not found");

  // Fix family grouping (case-insensitive)
  const allProducts = await prisma.product.findMany();
  const familyMembers = allProducts.filter(p => p.name.toLowerCase() === product.name.toLowerCase() && p.id !== productId);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Sales data
  const sales = await prisma.saleItem.findMany({
    where: {
      productId: productId,
    },
    include: { sale: { include: { customer: true } } },
    orderBy: { sale: { date: 'asc' } }
  });

  // Stock Batches for Cost Price history
  const stockBatches = await prisma.stockBatch.findMany({
    where: { productId: productId },
    orderBy: { dateAdded: 'asc' }
  });

  // Top Buyers Calculation
  const clientMap = new Map<string, { id: string, name: string, quantity: number, revenue: number }>();
  sales.forEach(item => {
    if (!item.sale.customerId) return;
    const cid = item.sale.customerId;
    if (!clientMap.has(cid)) {
      clientMap.set(cid, { id: cid, name: item.sale.customer?.name || "Unknown", quantity: 0, revenue: 0 });
    }
    const client = clientMap.get(cid)!;
    client.quantity += item.quantity;
    client.revenue += (item.quantity * item.unitSellPrice);
  });
  const topClients = Array.from(clientMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Chart Data (Last 30 days)
  const chartDataMap = new Map<string, { date: string; quantity: number; revenue: number; costPrice: number | null; sellPrice: number | null }>();
  
  // Fill all 30 days
  for (let i = 0; i <= 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    chartDataMap.set(dateStr, { date: dateStr, quantity: 0, revenue: 0, costPrice: null, sellPrice: null });
  }

  // Filter 30 days sales
  const recentSales = sales.filter(s => s.sale.date >= thirtyDaysAgo);
  recentSales.forEach(item => {
    const dateStr = item.sale.date.toISOString().split('T')[0];
    if (chartDataMap.has(dateStr)) {
      const data = chartDataMap.get(dateStr)!;
      data.quantity += item.quantity;
      data.revenue += (item.quantity * item.unitSellPrice);
      data.sellPrice = item.unitSellPrice; // latest sell price for that day
    }
  });

  // Add Cost Price history (latest cost price up to that day)
  for (let i = 0; i <= 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Find the latest stock batch before or on this date
    const priorBatches = stockBatches.filter(b => b.dateAdded <= d);
    if (priorBatches.length > 0) {
      const latestBatch = priorBatches[priorBatches.length - 1];
      if (chartDataMap.has(dateStr)) {
        chartDataMap.get(dateStr)!.costPrice = latestBatch.costPrice;
      }
    }
  }

  // Also fill missing sellPrices with previous day's if available (or default Selling Price)
  let lastSell = product.defaultSellingPrice;
  let lastCost = product.defaultCostPrice || 0;
  
  const chartData = Array.from(chartDataMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  chartData.forEach(d => {
    if (d.sellPrice === null) d.sellPrice = lastSell;
    else lastSell = d.sellPrice;

    if (d.costPrice === null) d.costPrice = lastCost;
    else lastCost = d.costPrice;
  });

  const totalQuantity = recentSales.reduce((acc, item) => acc + item.quantity, 0);
  const totalRevenue = recentSales.reduce((acc, item) => acc + (item.quantity * item.unitSellPrice), 0);
  const totalCost = recentSales.reduce((acc, item) => acc + (item.quantity * item.unitCostPrice), 0);
  const avgMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;

  // Advanced Inventory Metrics
  const currentValuationCost = product.stockQuantity * (product.defaultCostPrice || 0);
  const currentValuationRetail = product.stockQuantity * product.defaultSellingPrice;
  const potentialProfit = currentValuationRetail - currentValuationCost;
  const salesVelocity = totalQuantity / 30; // units per day
  const daysRemaining = salesVelocity > 0 ? Math.floor(product.stockQuantity / salesVelocity) : -1;

  // Recent Inwards
  const recentInwards = stockBatches.slice(-5).reverse();

  return {
    product,
    familyMembers,
    chartData,
    topClients,
    recentInwards,
    metrics: {
      totalQuantity,
      totalRevenue,
      avgMargin,
      currentValuationCost,
      currentValuationRetail,
      potentialProfit,
      salesVelocity,
      daysRemaining
    }
  };
}
