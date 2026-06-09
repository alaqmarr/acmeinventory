import { prisma } from "@/lib/prisma";
import { Package, TrendingUp, AlertTriangle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const productsCount = await prisma.product.count();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaySales = await prisma.sale.aggregate({
    where: { date: { gte: today } },
    _sum: { totalAmount: true },
    _count: { id: true },
  });

  const lowStockProducts = await prisma.product.findMany({
    where: { stockQuantity: { lt: 10 } },
    take: 5,
    orderBy: { stockQuantity: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-slate-900 ">Dashboard</h1>
          <p className="text-slate-500 leading-relaxed mt-1">
            Overview of your inventory and daily sales.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/stock-inward"
            className="px-4 py-2 bg-slate-100 text-slate-900 font-medium rounded-[1rem] hover:bg-slate-200 transition-colors shadow-md shadow-slate-200/40"
          >
            Add Stock
          </Link>
          <Link
            href="/sales"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-slate-200/40 border border-blue-700 font-medium rounded-[1rem] transition-all flex items-center gap-2"
          >
            <ArrowUpRight className="w-4 h-4" /> New Sale
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md shadow-slate-200/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-600 ">Total Products</h3>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-[1rem] flex items-center justify-center shadow-md shadow-slate-200/40">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 ">{productsCount}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md shadow-slate-200/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-600 ">
              Today&apos;s Revenue
            </h3>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-[1rem] flex items-center justify-center shadow-md shadow-slate-200/40">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 ">
            ₹{todaySales._sum.totalAmount?.toLocaleString() || "0"}
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mt-2">
            {todaySales._count.id} sales today
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md shadow-slate-200/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-600 ">Low Stock Alerts</h3>
            <div className="w-10 h-10 bg-rose-50 text-rose-600 border border-rose-100 rounded-[1rem] flex items-center justify-center shadow-md shadow-slate-200/40">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 ">
            {lowStockProducts.length}
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mt-2">Products below 10 units</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md shadow-slate-200/40">
          <h3 className="font-bold text-lg text-slate-900 mb-4">
            Low Stock Items
          </h3>
          {lowStockProducts.length === 0 ? (
            <p className="text-slate-500 leading-relaxed text-sm">
              All products are sufficiently stocked.
            </p>
          ) : (
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-[1.5rem]"
                >
                  <div>
                    <p className="font-medium text-slate-900 flex items-center flex-wrap gap-2">
                      {product.name}
                      {product.make && <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">Make: {product.make}</span>}
                      {product.size && <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Size: {product.size}</span>}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">SKU: {product.sku}</p>
                  </div>
                  <div className="px-3 py-1 bg-rose-100 text-rose-800 border border-rose-200 text-sm font-semibold rounded-lg shadow-md shadow-slate-200/40">
                    {product.stockQuantity} left
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
