import React from 'react';
import { getMostSoldProducts, getAgingStock, getProfitabilityMetrics, getTopSellingMakes, getFamilyWiseSales } from './actions';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage() {
  const [mostSold, agingStock, profitability, topMakes, familyWiseSales] = await Promise.all([
    getMostSoldProducts(),
    getAgingStock(),
    getProfitabilityMetrics(),
    getTopSellingMakes(),
    getFamilyWiseSales()
  ]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <AnalyticsClient 
        mostSold={mostSold} 
        agingStock={agingStock} 
        profitability={profitability} 
        topMakes={topMakes}
        familyWiseSales={familyWiseSales}
      />
    </div>
  );
}
