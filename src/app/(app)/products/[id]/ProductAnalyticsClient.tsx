"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Package, TrendingUp, DollarSign, Activity, ArrowLeft, Users, Boxes, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

interface ProductAnalyticsClientProps {
  data: {
    product: any;
    familyMembers: any[];
    chartData: any[];
    topClients: any[];
    recentInwards: any[];
    metrics: {
      totalQuantity: number;
      totalRevenue: number;
      avgMargin: number;
      currentValuationCost: number;
      currentValuationRetail: number;
      potentialProfit: number;
      salesVelocity: number;
      daysRemaining: number;
    };
  };
}

export default function ProductAnalyticsClient({ data }: ProductAnalyticsClientProps) {
  const { product, familyMembers, chartData, topClients, recentInwards, metrics } = data;
  const [chartType, setChartType] = useState<"revenue" | "quantity" | "price">("revenue");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/products"
          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-medium text-slate-500">SKU: {product.sku}</span>
            {product.make && (
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-md border border-indigo-200">
                Make: {product.make}
              </span>
            )}
            {product.size && (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md border border-emerald-200">
                Size: {product.size}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-center gap-4 hover:shadow-xl transition-shadow">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">30-Day Volume</p>
            <p className="text-2xl font-bold text-slate-900">{metrics.totalQuantity} units</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-center gap-4 hover:shadow-xl transition-shadow">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">30-Day Revenue</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(metrics.totalRevenue)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-center gap-4 hover:shadow-xl transition-shadow">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Avg Profit Margin</p>
            <p className="text-2xl font-bold text-slate-900">{metrics.avgMargin.toFixed(1)}%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-center gap-4 hover:shadow-xl transition-shadow">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Est. Days Remaining</p>
            <p className="text-2xl font-bold text-slate-900">
              {metrics.daysRemaining === -1 ? "N/A" : metrics.daysRemaining} <span className="text-sm font-normal text-slate-500">days</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col min-h-[400px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-800">Sales Trends (Last 30 Days)</h2>
            <div className="flex gap-2 bg-slate-100 p-1 rounded-full self-start sm:self-auto">
              <button
                onClick={() => setChartType("revenue")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  chartType === "revenue"
                    ? "bg-white text-slate-900 shadow"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setChartType("quantity")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  chartType === "quantity"
                    ? "bg-white text-slate-900 shadow"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Volume
              </button>
              <button
                onClick={() => setChartType("price")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  chartType === "price"
                    ? "bg-white text-slate-900 shadow"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Price History
              </button>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "revenue" ? (
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tickFormatter={(val) => formatDate(val)} tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(val) => `₹${val}`} tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                    formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                    labelFormatter={(val) => formatDate(val)}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2 }} />
                </LineChart>
              ) : chartType === "quantity" ? (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tickFormatter={(val) => formatDate(val)} tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                    formatter={(value: number) => [value, "Quantity Sold"]}
                    labelFormatter={(val) => formatDate(val)}
                  />
                  <Bar dataKey="quantity" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tickFormatter={(val) => formatDate(val)} tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(val) => `₹${val}`} tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                    formatter={(value: number, name: string) => [formatCurrency(value), name === "sellPrice" ? "Selling Price" : "Cost Price"]}
                    labelFormatter={(val) => formatDate(val)}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Line type="stepAfter" name="sellPrice" dataKey="sellPrice" stroke="#10b981" strokeWidth={3} dot={false} />
                  <Line type="stepAfter" name="costPrice" dataKey="costPrice" stroke="#f43f5e" strokeWidth={3} dot={false} strokeDasharray="5 5" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Family Switcher */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col max-h-[400px]">
          <div className="flex items-center gap-2 mb-6">
            <Package className="text-indigo-500" size={20} />
            <h2 className="text-xl font-bold text-slate-800">Product Family</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Other variants of <strong>{product.name}</strong>
          </p>

          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            <div className="p-4 bg-indigo-50 text-indigo-900 rounded-2xl border border-indigo-100 relative overflow-hidden shadow-inner shrink-0">
              <div className="absolute top-0 right-0 w-1.5 h-full bg-indigo-500"></div>
              <p className="font-bold text-sm">Viewing Variant</p>
              <div className="flex gap-2 mt-2">
                {product.make && <span className="px-1.5 py-0.5 bg-white text-indigo-800 text-[10px] rounded border border-indigo-200 font-bold">Make: {product.make}</span>}
                {product.size && <span className="px-1.5 py-0.5 bg-white text-emerald-800 text-[10px] rounded border border-emerald-200 font-bold">Size: {product.size}</span>}
                {!product.make && !product.size && <span className="text-xs text-slate-400">No Make/Size</span>}
              </div>
            </div>

            {familyMembers.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                No other variants found.
              </div>
            ) : (
              familyMembers.map((member) => (
                <Link
                  href={`/products/${member.id}`}
                  key={member.id}
                  className="block p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors shadow-sm hover:shadow group shrink-0"
                >
                  <p className="font-semibold text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                    SKU: {member.sku}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {member.make && <span className="px-1.5 py-0.5 bg-slate-100 text-[10px] text-slate-600 rounded border border-slate-200 font-medium">Make: {member.make}</span>}
                    {member.size && <span className="px-1.5 py-0.5 bg-slate-100 text-[10px] text-slate-600 rounded border border-slate-200 font-medium">Size: {member.size}</span>}
                    {!member.make && !member.size && <span className="text-xs text-slate-400">Standard</span>}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Valuation */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Boxes className="text-blue-500" size={20} />
            <h2 className="text-xl font-bold text-slate-800">Inventory Valuation</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-sm text-slate-500 font-medium mb-1">Current Stock</p>
              <p className="text-xl font-bold text-slate-800">{product.stockQuantity} units</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-sm text-blue-600 font-medium mb-1">Capital Tied Up (Cost)</p>
              <p className="text-xl font-bold text-blue-900">{formatCurrency(metrics.currentValuationCost)}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-sm text-emerald-600 font-medium mb-1">Potential Profit</p>
              <p className="text-xl font-bold text-emerald-900">{formatCurrency(metrics.potentialProfit)}</p>
            </div>
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Users className="text-fuchsia-500" size={20} />
            <h2 className="text-xl font-bold text-slate-800">Top Clients</h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {topClients.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No sales data found for this product.</p>
            ) : (
              topClients.map(client => (
                <div key={client.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{client.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{client.quantity} units bought</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600 text-sm">{formatCurrency(client.revenue)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Inwards */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Package className="text-amber-500" size={20} />
            <h2 className="text-xl font-bold text-slate-800">Recent Inwards</h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {recentInwards.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No inward history found.</p>
            ) : (
              recentInwards.map(inward => (
                <div key={inward.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{formatDate(inward.dateAdded)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">+{inward.quantity} units @ {formatCurrency(inward.costPrice)}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-200">
                      RESTOCK
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
