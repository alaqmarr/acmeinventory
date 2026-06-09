"use client";
import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Calendar,
  ChevronDown,
  ChevronRight,
  Package,
  User,
  Phone,
  Receipt,
  Loader2,
  TrendingUp,
  TrendingDown,
  Scale,
} from "lucide-react";
import { useAlert } from "@/providers/AlertProvider";
import { getLedgerEntries } from "./actions";
import type {
  LedgerEntry,
  LedgerResult,
  LedgerFilters,
  SaleDetails,
  StockInDetails,
} from "./actions";
function formatCurrency(amount: number): string {
  return `₹${Math.abs(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
interface LedgerClientProps {
  initialData: LedgerResult;
}
export default function LedgerClient({ initialData }: LedgerClientProps) {
  const { showAlert } = useAlert();
  const [data, setData] = useState<LedgerResult>(initialData);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "sale" | "stock-in">("all");
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const filters: LedgerFilters = { type: typeFilter };
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      const result = await getLedgerEntries(filters);
      setData(result);
    } catch {
      showAlert({
        title: "Error",
        message: "Failed to load ledger entries. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, typeFilter, showAlert]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setTypeFilter("all");
  };
  const hasFilters = startDate || endDate || typeFilter !== "all";
  // Compute running balance (from oldest to newest, but display newest first)
  const entriesWithBalance = (() => {
    const sorted = [...data.entries].reverse(); // oldest first
    let balance = 0;
    const withBalance = sorted.map((entry) => {
      balance += entry.amount;
      return { ...entry, runningBalance: balance };
    });
    return withBalance.reverse(); // back to newest first
  })();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-[1rem] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-slate-900 "> Ledger </h1>
              <p className="text-slate-500 leading-relaxed mt-0.5">
                {" "}
                Complete financial overview of all transactions.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md shadow-slate-200/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-600 "> Total Revenue </h3>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-[1rem] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-emerald-600 ">
            {" "}
            {formatCurrency(data.totalRevenue)}{" "}
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mt-2">
            {" "}
            From {data.entries.filter((e) => e.type === "SALE").length} sale{" "}
            {data.entries.filter((e) => e.type === "SALE").length !== 1
              ? "s"
              : ""}{" "}
          </p>
        </div>
        {/* Total Purchases */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md shadow-slate-200/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-600 "> Total Purchases </h3>
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-[1rem] flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-orange-600 ">
            {" "}
            {formatCurrency(data.totalPurchases)}{" "}
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mt-2">
            {" "}
            From {data.entries.filter((e) => e.type === "STOCK_IN").length} stock
            entr{" "}
            {data.entries.filter((e) => e.type === "STOCK_IN").length !== 1
              ? "ies"
              : "y"}{" "}
          </p>
        </div>
        {/* Net Balance */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md shadow-slate-200/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-600 "> Net Balance </h3>
            <div
              className={`w-10 h-10 rounded-[1rem] flex items-center justify-center ${
                data.netBalance >= 0
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-100 "
                  : "bg-red-50 text-red-600 "
              }`}
            >
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <p
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight ${
              data.netBalance >= 0 ? "text-blue-600 " : "text-red-600 "
            }`}
          >
            {" "}
            {data.netBalance < 0 ? "-" : ""}{" "}
            {formatCurrency(data.netBalance)}{" "}
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mt-2"> Revenue − Purchases </p>
        </div>
      </div>
      {/* Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 transition-all">
        <div className="p-4 border-b border-slate-200 ">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center gap-2 text-slate-600 ">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </div>
            <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Date Range */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-9 pr-3 py-2 text-sm rounded-[1rem] border border-slate-200 bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="Start date"
                  />
                </div>
                <span className="text-gray-400 text-sm">to</span>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-9 pr-3 py-2 text-sm rounded-[1rem] border border-slate-200 bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="End date"
                  />
                </div>
              </div>
              {/* Type Filter */}
              <div className="flex rounded-[1rem] border border-slate-200 overflow-hidden">
                {(
                  [
                    { value: "all", label: "All" },
                    { value: "sale", label: "Sales" },
                    { value: "stock-in", label: "Purchases" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTypeFilter(option.value)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      typeFilter === option.value
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-slate-200/40 border border-blue-700 transition-all "
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {/* Clear Filters */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-slate-500 leading-relaxed hover:text-slate-900 transition-colors"
                >
                  {" "}
                  Clear filters{" "}
                </button>
              )}
            </div>
            {loading && (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            )}
          </div>
        </div>
      </div>
      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-slate-50 border-slate-200 ">
            <tr>
              <th className="w-8 px-4 py-3"></th>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
                {" "}
                Date{" "}
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
                {" "}
                Type{" "}
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
                {" "}
                Description{" "}
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
                {" "}
                Debit (₹){" "}
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
                {" "}
                Credit (₹){" "}
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
                {" "}
                Balance (₹){" "}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 ">
            {entriesWithBalance.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-slate-100 rounded-[1.5rem] flex items-center justify-center">
                      <BookOpen className="w-7 h-7 text-gray-400 " />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 ">
                        {" "}
                        No entries found{" "}
                      </p>
                      <p className="text-sm text-slate-500 leading-relaxed mt-1">
                        {" "}
                        {hasFilters
                          ? "Try adjusting your filters to see more results."
                          : "Transactions will appear here once you make sales or add stock."}{" "}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              entriesWithBalance.map((entry) => {
                const isExpanded = expandedRows.has(entry.id);
                const isSale = entry.type === "SALE";
                return (
                  <LedgerRow
                    key={entry.id}
                    entry={entry}
                    isExpanded={isExpanded}
                    isSale={isSale}
                    onToggle={() => toggleRow(entry.id)}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* Footer */}
      {entriesWithBalance.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 border-slate-200/50 ">
          <p className="text-xs text-slate-500 leading-relaxed ">
            {" "}
            Showing {entriesWithBalance.length} entr{" "}
            {entriesWithBalance.length !== 1 ? "ies" : "y"}{" "}
            {hasFilters ? " (filtered)" : ""}{" "}
          </p>
        </div>
      )}
    </div>
  );
}
/* ---------- Row Component ---------- */ interface LedgerRowProps {
  entry: LedgerEntry & { runningBalance: number };
  isExpanded: boolean;
  isSale: boolean;
  onToggle: () => void;
}
function LedgerRow({ entry, isExpanded, isSale, onToggle }: LedgerRowProps) {
  return (
    <>
      <tr
        className="hover:bg-slate-50 border-slate-200/40 transition-colors cursor-pointer group"
        onClick={onToggle}
      >
        {/* Expand toggle */}
        <td className="pl-4 pr-1 py-3">
          <div className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 group-hover:text-slate-600 transition-colors">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </td>
        {/* Date */}
        <td className="px-5 py-3 whitespace-nowrap">
          <div className="text-sm font-medium text-slate-900 ">
            {formatDate(entry.date)}
          </div>
          <div className="text-xs text-slate-500 leading-relaxed ">{formatTime(entry.date)}</div>
        </td>
        {/* Type Badge */}
        <td className="px-5 py-3 whitespace-nowrap">
          {isSale ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-700 ">
              <ArrowUpRight className="w-3 h-3" /> Sale
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-orange-100 text-orange-700 ">
              <ArrowDownLeft className="w-3 h-3" /> Stock In
            </span>
          )}
        </td>
        {/* Description */}
        <td className="px-5 py-3">
          <p className="text-sm text-slate-900 line-clamp-1">
            {entry.description}
          </p>
        </td>
        {/* Debit (stock purchases) */}
        <td className="px-5 py-3 text-right whitespace-nowrap">
          {!isSale ? (
            <span className="text-sm font-semibold text-red-600 ">
              {formatCurrency(entry.amount)}
            </span>
          ) : (
            <span className="text-sm text-gray-300 ">—</span>
          )}
        </td>
        {/* Credit (sales) */}
        <td className="px-5 py-3 text-right whitespace-nowrap">
          {isSale ? (
            <span className="text-sm font-semibold text-emerald-600 ">
              {formatCurrency(entry.amount)}
            </span>
          ) : (
            <span className="text-sm text-gray-300 ">—</span>
          )}
        </td>
        {/* Running Balance */}
        <td className="px-5 py-3 text-right whitespace-nowrap">
          <span
            className={`text-sm font-semibold ${entry.runningBalance >= 0 ? "text-slate-900 " : "text-red-600 "}`}
          >
            {entry.runningBalance < 0 ? "-" : ""}
            {formatCurrency(entry.runningBalance)}
          </span>
        </td>
      </tr>
      {/* Expanded Details */}
      {isExpanded && (
        <tr>
          <td colSpan={7} className="px-0 py-0">
            <div className="bg-slate-50 border-slate-200/80 border-y border-slate-200 ">
              {entry.details.kind === "sale" ? (
                <SaleExpandedDetails details={entry.details} />
              ) : (
                <StockInExpandedDetails details={entry.details} />
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
/* ---------- Sale Details ---------- */ function SaleExpandedDetails({
  details,
}: {
  details: SaleDetails;
}) {
  return (
    <div className="px-6 py-4 ml-10">
      {/* Customer info */}
      <div className="flex flex-wrap gap-4 mb-4">
        {details.customerName && (
          <div className="flex items-center gap-2 text-sm text-slate-600 ">
            <User className="w-4 h-4" />
            <span>{details.customerName}</span>
          </div>
        )}
        {details.customerPhone && (
          <div className="flex items-center gap-2 text-sm text-slate-600 ">
            <Phone className="w-4 h-4" />
            <span>{details.customerPhone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-slate-600 ">
          <Receipt className="w-4 h-4" />
          <span>{details.isGstBill ? "GST Bill" : "Non-GST Bill"}</span>
        </div>
      </div>
      {/* Items table */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead>
            <tr className="bg-slate-50 border-slate-200 ">
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 leading-relaxed uppercase">
                Product
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 leading-relaxed uppercase">
                SKU
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 leading-relaxed uppercase">
                Qty
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 leading-relaxed uppercase">
                Unit Price
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 leading-relaxed uppercase">
                GST
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 leading-relaxed uppercase">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 ">
            {details.items.map((item, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 text-sm text-slate-900 ">
                  <div className="flex items-center flex-wrap gap-2">
                    {item.productName}
                    {item.make && <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">Make: {item.make}</span>}
                    {item.size && <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Size: {item.size}</span>}
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-slate-500 leading-relaxed font-mono">
                  {item.sku}
                </td>
                <td className="px-4 py-2 text-sm text-right text-slate-900 ">
                  {item.quantity}
                </td>
                <td className="px-4 py-2 text-sm text-right text-slate-900 ">
                  ₹{item.unitSellPrice.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-2 text-sm text-right text-slate-500 leading-relaxed ">
                  ₹{item.gstAmount.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-2 text-sm text-right font-medium text-slate-900 ">
                  ₹{item.subtotal.toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Totals */}
      <div className="mt-3 flex justify-end">
        <div className="text-right space-y-1">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-slate-500 leading-relaxed ">Subtotal</span>
            <span className="text-slate-900 font-medium">
              ₹{details.subtotalAmount.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-slate-500 leading-relaxed ">GST</span>
            <span className="text-slate-900 font-medium">
              ₹{details.gstAmount.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm pt-1 border-t border-slate-200 ">
            <span className="text-slate-900 font-semibold"> Total </span>
            <span className="text-emerald-600 font-semibold font-bold">
              ₹{details.totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
/* ---------- Stock-In Details ---------- */ function StockInExpandedDetails({
  details,
}: {
  details: StockInDetails;
}) {
  return (
    <div className="px-6 py-4 ml-10">
      <div className="bg-white rounded-[1.5rem] border border-slate-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 leading-relaxed mb-1">
              <Package className="w-3.5 h-3.5" /> Product
            </div>
            <p className="text-sm font-medium text-slate-900 flex flex-wrap items-center gap-2">
              {details.productName}
              {details.make && <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">Make: {details.make}</span>}
              {details.size && <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Size: {details.size}</span>}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed font-mono">
              {details.productSku}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 leading-relaxed mb-1"> Supplier </p>
            <p className="text-sm font-medium text-slate-900 ">
              {details.supplier || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 leading-relaxed mb-1">Quantity × Cost Price</p>
            <p className="text-sm font-medium text-slate-900 ">
              {details.quantity} × ₹{details.costPrice.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 leading-relaxed mb-1"> Total Cost </p>
            <p className="text-sm font-bold text-orange-600 ">
              ₹{details.totalCost.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        {/* Selling price info */}
        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2">
          <span className="text-xs text-slate-500 leading-relaxed "> Selling Price: </span>
          <span className="text-sm font-medium text-slate-900 ">
            ₹{details.sellingPrice.toLocaleString("en-IN")}/unit
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-slate-500 leading-relaxed ">
            Margin:
            <span
              className={`font-medium ${details.sellingPrice > details.costPrice ? "text-emerald-600 " : "text-red-600 "}`}
            >
              ₹
              {(details.sellingPrice - details.costPrice).toLocaleString(
                "en-IN",
              )}
              /unit (
              {details.costPrice > 0
                ? (
                    ((details.sellingPrice - details.costPrice) /
                      details.costPrice) *
                    100
                  ).toFixed(1)
                : "∞"}
              %)
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
