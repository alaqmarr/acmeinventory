"use client";
import { useState, useEffect } from "react";
import {
  getReportData,
  getCategories,
  getProductsForFilter,
  ReportFilters,
} from "./actions";
import { useAlert } from "@/providers/AlertProvider";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Filter,
  Calendar,
} from "lucide-react";
function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-md shadow-slate-200/40 border border-zinc-200 flex items-center gap-4">
      <div className="p-3 bg-zinc-50 rounded-[1.5rem]"> {icon} </div>
      <div>
        <p className="text-sm font-medium text-zinc-500 ">{title}</p>
        <p className="text-2xl font-extrabold tracking-tight text-zinc-900 ">{value}</p>
      </div>
    </div>
  );
}
export default function ReportsClient() {
  const [period, setPeriod] = useState("daily");
  const todayStr = new Date().toISOString().split("T")[0];
  const thisMonthStr = todayStr.substring(0, 7);
  const thisYearStr = new Date().getFullYear().toString();
  const getWeekStr = (d: Date) => {
    const dCopy = new Date(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),
    );
    const dayNum = dCopy.getUTCDay() || 7;
    dCopy.setUTCDate(dCopy.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(dCopy.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(
      ((dCopy.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
    );
    return `${dCopy.getUTCFullYear()}-W${weekNo.toString().padStart(2, "0")}`;
  };
  const [dailyDate, setDailyDate] = useState(todayStr);
  const [weeklyWeek, setWeeklyWeek] = useState(getWeekStr(new Date()));
  const [monthlyMonth, setMonthlyMonth] = useState(thisMonthStr);
  const [yearlyYear, setYearlyYear] = useState(thisYearStr);
  const [customStart, setCustomStart] = useState(todayStr);
  const [customEnd, setCustomEnd] = useState(todayStr);
  const [productId, setProductId] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState<
    { id: string; name: string; sku: string }[]
  >([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const { showAlert } = useAlert();
  useEffect(() => {
    async function loadFilters() {
      try {
        const [prods, cats] = await Promise.all([
          getProductsForFilter(),
          getCategories(),
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error(err);
        showAlert({ title: "Error", message: "Failed to load filter data.", type: "error" });
      }
    }
    loadFilters();
  }, [showAlert]);
  const formatLocal = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const handleGenerate = async () => {
    let startStr = "";
    let endStr = "";
    try {
      if (period === "daily") {
        if (!dailyDate) return showAlert({ title: "Error", message: "Please select a date.", type: "error" });
        startStr = dailyDate;
        endStr = dailyDate;
      } else if (period === "weekly") {
        if (!weeklyWeek) return showAlert({ title: "Error", message: "Please select a week.", type: "error" });
        const [year, week] = weeklyWeek.split("-W");
        const d = new Date(Number(year), 0, 1 + (Number(week) - 1) * 7);
        const day = d.getDay();
        const start = new Date(d);
        start.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        startStr = formatLocal(start);
        endStr = formatLocal(end);
      } else if (period === "monthly") {
        if (!monthlyMonth) return showAlert({ title: "Error", message: "Please select a month.", type: "error" });
        const [year, month] = monthlyMonth.split("-");
        const start = new Date(Number(year), Number(month) - 1, 1);
        const end = new Date(Number(year), Number(month), 0);
        startStr = formatLocal(start);
        endStr = formatLocal(end);
      } else if (period === "yearly") {
        if (!yearlyYear) return showAlert({ title: "Error", message: "Please select a year.", type: "error" });
        startStr = `${yearlyYear}-01-01`;
        endStr = `${yearlyYear}-12-31`;
      } else if (period === "custom") {
        if (!customStart || !customEnd)
          return showAlert({ title: "Error", message: "Please select start and end dates.", type: "error" });
        startStr = customStart;
        endStr = customEnd;
      }
      setLoading(true);
      const data = await getReportData({
        startDate: startStr,
        endDate: endStr,
        productId: productId || undefined,
        category: category || undefined,
      });
      setReportData(data);
    } catch (err: any) {
      console.error(err);
      showAlert({ title: "Error", message: err.message || "Failed to generate report.", type: "error" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 ">
          Reports
        </h1>
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-md shadow-slate-200/40 border border-zinc-200 space-y-6">
        <div className="flex items-center gap-2 mb-2 text-zinc-800 font-medium">
          <Filter className="w-5 h-5" /> <span>Report Filters</span>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          {/* Period Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 ">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full h-11 px-4 rounded-[1rem] border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>
          {/* Date Inputs based on Period */}
          {period === "daily" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 ">Date</label>
              <input
                type="date"
                value={dailyDate}
                onChange={(e) => setDailyDate(e.target.value)}
                className="h-11 px-4 rounded-[1rem] border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none block"
              />
            </div>
          )}
          {period === "weekly" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 ">Week</label>
              <input
                type="week"
                value={weeklyWeek}
                onChange={(e) => setWeeklyWeek(e.target.value)}
                className="h-11 px-4 rounded-[1rem] border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none block"
              />
            </div>
          )}
          {period === "monthly" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 ">
                Month
              </label>
              <input
                type="month"
                value={monthlyMonth}
                onChange={(e) => setMonthlyMonth(e.target.value)}
                className="h-11 px-4 rounded-[1rem] border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none block"
              />
            </div>
          )}
          {period === "yearly" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 ">Year</label>
              <input
                type="number"
                min="2000"
                max="2100"
                value={yearlyYear}
                onChange={(e) => setYearlyYear(e.target.value)}
                className="h-11 px-4 w-32 rounded-[1rem] border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none block"
              />
            </div>
          )}
          {period === "custom" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 ">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="h-11 px-4 rounded-[1rem] border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none block"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 ">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="h-11 px-4 rounded-[1rem] border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none block"
                />
              </div>
            </>
          )}
          {/* Category Filter */}
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-zinc-700 ">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-4 rounded-[1rem] border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          {/* Product Filter */}
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-zinc-700 ">
              Product
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full h-11 px-4 rounded-[1rem] border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="h-11 px-6 rounded-[1rem] bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>Generate Report</span>
              </>
            )}
          </button>
        </div>
      </div>
      {/* Report Results */}
      {reportData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Sales"
              value={reportData.totalSalesCount.toString()}
              icon={<BarChart3 className="w-6 h-6 text-blue-500" />}
            />
            <StatCard
              title="Total Revenue"
              value={`₹${reportData.totalRevenue.toFixed(2)}`}
              icon={<DollarSign className="w-6 h-6 text-green-500" />}
            />
            <StatCard
              title="Total Profit"
              value={`₹${reportData.totalProfit.toFixed(2)}`}
              icon={<TrendingUp className="w-6 h-6 text-emerald-500" />}
            />
            <StatCard
              title="GST Collected"
              value={`₹${reportData.totalGst.toFixed(2)}`}
              icon={<DollarSign className="w-6 h-6 text-purple-500" />}
            />
          </div>
          {reportData.productBreakdown.length === 0 &&
          reportData.categoryBreakdown.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl shadow-md shadow-slate-200/40 border border-zinc-200 text-center text-zinc-500 ">
              No data found for the selected period.
            </div>
          ) : (
            <>
              {/* Category Breakdown */}
              {!productId && reportData.categoryBreakdown.length > 0 && (
                <div className="bg-white rounded-3xl shadow-md shadow-slate-200/40 border border-zinc-200 overflow-hidden mb-6">
                  <div className="p-6 border-b border-zinc-200 ">
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900 ">
                      Category Breakdown
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-600 ">
                      <thead className="bg-zinc-50 text-zinc-900 font-medium border-b border-zinc-200 ">
                        <tr>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4 text-right">Qty Sold</th>
                          <th className="px-6 py-4 text-right">Revenue</th>
                          <th className="px-6 py-4 text-right">Cost</th>
                          <th className="px-6 py-4 text-right">Profit</th>
                          <th className="px-6 py-4 text-right">Margin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 ">
                        {reportData.categoryBreakdown.map(
                          (item: any, idx: number) => {
                            const margin =
                              item.revenue > 0
                                ? ((item.profit / item.revenue) * 100).toFixed(
                                    2,
                                  )
                                : "0.00";
                            return (
                              <tr
                                key={idx}
                                className="hover:bg-zinc-50/50 transition-colors"
                              >
                                <td className="px-6 py-4 font-medium text-zinc-900 ">
                                  {item.name}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {item.qty}
                                </td>
                                <td className="px-6 py-4 text-right text-zinc-900 ">
                                  ₹{item.revenue.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  ₹{item.cost.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-emerald-600 ">
                                  ₹{item.profit.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {margin}%
                                </td>
                              </tr>
                            );
                          },
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {/* Product Breakdown */}
              {reportData.productBreakdown.length > 0 && (
                <div className="bg-white rounded-3xl shadow-md shadow-slate-200/40 border border-zinc-200 overflow-hidden">
                  <div className="p-6 border-b border-zinc-200 ">
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900 ">
                      Product Breakdown
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-600 ">
                      <thead className="bg-zinc-50 text-zinc-900 font-medium border-b border-zinc-200 ">
                        <tr>
                          <th className="px-6 py-4">Product Name</th>
                          <th className="px-6 py-4">SKU</th>
                          <th className="px-6 py-4 text-right">Qty Sold</th>
                          <th className="px-6 py-4 text-right">Revenue</th>
                          <th className="px-6 py-4 text-right">Cost</th>
                          <th className="px-6 py-4 text-right">Profit</th>
                          <th className="px-6 py-4 text-right">Margin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 ">
                        {reportData.productBreakdown.map(
                          (item: any, idx: number) => {
                            const margin =
                              item.revenue > 0
                                ? ((item.profit / item.revenue) * 100).toFixed(
                                    2,
                                  )
                                : "0.00";
                            return (
                              <tr
                                key={idx}
                                className="hover:bg-zinc-50/50 transition-colors"
                              >
                                <td className="px-6 py-4 font-medium text-zinc-900 ">
                                  {item.name}
                                </td>
                                <td className="px-6 py-4">{item.sku}</td>
                                <td className="px-6 py-4 text-right">
                                  {item.qty}
                                </td>
                                <td className="px-6 py-4 text-right text-zinc-900 ">
                                  ₹{item.revenue.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  ₹{item.cost.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-emerald-600 ">
                                  ₹{item.profit.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {margin}%
                                </td>
                              </tr>
                            );
                          },
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
