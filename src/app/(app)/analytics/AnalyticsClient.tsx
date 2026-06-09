"use client";

import React from 'react';
import { TrendingUp, AlertTriangle, DollarSign, PackageOpen, Activity, ArrowUpRight } from 'lucide-react';

interface AnalyticsClientProps {
  mostSold: any[];
  agingStock: any[];
  profitability: any[];
}

export default function AnalyticsClient({ mostSold, agingStock, profitability }: AnalyticsClientProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const maxSold = Math.max(...mostSold.map(m => m.totalSold), 1);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-800 to-slate-900 p-8 rounded-[2rem] shadow-xl w-full text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Activity size={120} />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Analytics Dashboard</h1>
          <p className="text-indigo-200 text-lg max-w-2xl">
            Monitor your inventory performance, track aging stock, and analyze profitability metrics in real-time.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-300">
                <PackageOpen size={24} />
              </div>
              <div>
                <p className="text-sm text-indigo-200 font-medium">Top Sellers</p>
                <p className="text-2xl font-bold">{mostSold.length} Products</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-500/20 rounded-xl text-rose-300">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-sm text-indigo-200 font-medium">Aging Batches</p>
                <p className="text-2xl font-bold">{agingStock.length} Alerts</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-300">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-sm text-indigo-200 font-medium">Top Profit</p>
                <p className="text-2xl font-bold">{profitability.length > 0 ? formatCurrency(profitability[0]?.totalProfit) : '₹0'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Most Sold Products */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Top 10 Most Sold Products</h2>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm font-semibold text-slate-500 border-b border-slate-100">
                  <th className="pb-3 px-2">Product</th>
                  <th className="pb-3 px-2 text-right">Volume</th>
                  <th className="pb-3 px-2 w-1/3"></th>
                </tr>
              </thead>
              <tbody>
                {mostSold.map((item, idx) => (
                  <tr key={item.product.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="font-semibold text-slate-800">{item.product.name}</div>
                      <div className="text-xs text-slate-400">SKU: {item.product.sku}</div>
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-slate-700">
                      {item.totalSold}
                    </td>
                    <td className="py-3 px-2">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${(item.totalSold / maxSold) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {mostSold.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">No sales data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* High Margin Products */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Highest Profit Margin (30 Days)</h2>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm font-semibold text-slate-500 border-b border-slate-100">
                  <th className="pb-3 px-2">Product</th>
                  <th className="pb-3 px-2 text-right">Profit</th>
                  <th className="pb-3 px-2 text-right">Margin</th>
                </tr>
              </thead>
              <tbody>
                {profitability.map((item, idx) => (
                  <tr key={item.product.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="font-semibold text-slate-800">{item.product.name}</div>
                      <div className="text-xs text-slate-400">Qty Sold: {item.quantitySold}</div>
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-emerald-600">
                      {formatCurrency(item.totalProfit)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.profitMargin.toFixed(1)}% <ArrowUpRight size={12} />
                      </span>
                    </td>
                  </tr>
                ))}
                {profitability.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">No recent sales data.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Aging Stock Alert */}
      <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Aging Stock Alert (Capital Tied Up)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm font-semibold text-slate-500 border-b border-slate-100">
                <th className="pb-3 px-2">Product</th>
                <th className="pb-3 px-2">Date Added</th>
                <th className="pb-3 px-2 text-right">Remaining</th>
                <th className="pb-3 px-2 text-right">Cost Price</th>
                <th className="pb-3 px-2 text-right">Capital Tied Up</th>
              </tr>
            </thead>
            <tbody>
              {agingStock.map((item, idx) => (
                <tr key={item.batchId} className="border-b border-rose-50 last:border-0 hover:bg-rose-50/50 transition-colors">
                  <td className="py-4 px-2">
                    <div className="font-semibold text-slate-800">{item.product.name}</div>
                    <div className="text-xs text-rose-500 font-medium mt-0.5">{item.daysOld} days old</div>
                  </td>
                  <td className="py-4 px-2 text-slate-600 text-sm">
                    {new Date(item.dateAdded).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-2 text-right font-medium text-slate-700">
                    {item.remaining}
                  </td>
                  <td className="py-4 px-2 text-right text-slate-600">
                    {formatCurrency(item.costPrice)}
                  </td>
                  <td className="py-4 px-2 text-right font-bold text-rose-600">
                    {formatCurrency(item.capitalTiedUp)}
                  </td>
                </tr>
              ))}
              {agingStock.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">No aging stock found. Great job!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
