"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, History, IndianRupee, ShoppingCart, User, ChevronDown, ChevronUp } from "lucide-react";

interface ClientDetailsClientProps {
  client: any;
}

export default function ClientDetailsClient({ client }: ClientDetailsClientProps) {
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  const totalOrders = client.sales.length;
  const ltv = client.sales.reduce((sum: number, s: any) => sum + s.totalAmount, 0);
  const aov = totalOrders > 0 ? ltv / totalOrders : 0;

  const toggleInvoice = (id: string) => {
    if (expandedInvoiceId === id) setExpandedInvoiceId(null);
    else setExpandedInvoiceId(id);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/clients"
          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {client.name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-medium text-slate-500 flex items-center">
              <Phone className="w-4 h-4 mr-1 text-indigo-500" />
              {client.phone || "No phone number provided"}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-md border border-slate-200 ml-2">
              Customer since: {new Date(client.createdAt).getFullYear()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-center gap-4 hover:shadow-xl transition-shadow">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Lifetime Value</p>
            <p className="text-2xl font-bold text-slate-900">₹{ltv.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-center gap-4 hover:shadow-xl transition-shadow">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-bold text-slate-900">{totalOrders}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-center gap-4 hover:shadow-xl transition-shadow">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <User size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Avg Order Value</p>
            <p className="text-2xl font-bold text-slate-900">₹{Math.round(aov).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center bg-slate-50">
          <History className="w-6 h-6 mr-3 text-indigo-600" />
          <h2 className="text-2xl font-bold text-slate-800">Purchase History</h2>
        </div>

        {client.sales.length > 0 ? (
          <div className="overflow-x-auto max-h-[800px] custom-scrollbar">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">Invoice #</th>
                  <th className="px-6 py-4 text-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-right text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Value</th>
                  <th className="px-6 py-4 text-center text-xs font-extrabold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 relative">
                {client.sales.map((sale: any) => {
                  const isExpanded = expandedInvoiceId === sale.id;
                  const totalItems = sale.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
                  
                  return (
                    <React.Fragment key={sale.id}>
                      {/* Main Invoice Row */}
                      <tr 
                        className={`hover:bg-indigo-50/50 transition-colors cursor-pointer group ${isExpanded ? 'bg-indigo-50/30' : ''}`}
                        onClick={() => toggleInvoice(sale.id)}
                      >
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-900">
                          {new Date(sale.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-600">
                          {sale.invoiceNumber || `REF-${sale.id.slice(0, 8).toUpperCase()}`}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-center text-slate-500">
                          <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 text-xs font-bold text-slate-700">
                            {totalItems}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-right text-emerald-600 text-lg">
                          ₹{sale.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-center text-sm">
                          <button className="flex items-center justify-center w-full text-indigo-600 font-bold group-hover:text-indigo-800 transition-colors">
                            {isExpanded ? (
                              <span className="flex items-center bg-indigo-100 px-3 py-1.5 rounded-lg text-xs">Collapse <ChevronUp className="w-4 h-4 ml-1" /></span>
                            ) : (
                              <span className="flex items-center bg-slate-50 group-hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-xs border border-slate-200 group-hover:border-indigo-200">Expand <ChevronDown className="w-4 h-4 ml-1" /></span>
                            )}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expanded Itemized Table */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="bg-slate-50/80 p-0 border-b-2 border-indigo-200">
                            <div className="p-6 md:p-8 animate-in fade-in slide-in-from-top-2 duration-300">
                              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                                Itemized Bill Details
                              </h4>
                              
                              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                <table className="min-w-full divide-y divide-slate-200">
                                  <thead className="bg-slate-100/50">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-16">S.No</th>
                                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Item Description</th>
                                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</th>
                                      <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Price</th>
                                      <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {sale.items.map((item: any, index: number) => {
                                      const lineTotal = item.quantity * item.unitSellPrice;
                                      return (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-400">{index + 1}</td>
                                          <td className="px-6 py-4">
                                            <div className="font-extrabold text-slate-800 text-sm mb-1">
                                              <Link href={`/products/${item.product.id}`} className="hover:text-indigo-600 hover:underline">
                                                {item.product.name}
                                              </Link>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                              {item.product.make && <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 font-bold uppercase">Make: {item.product.make}</span>}
                                              {item.product.size && <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold uppercase">Size: {item.product.size}</span>}
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-slate-700">{item.quantity}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-slate-500">₹{item.unitSellPrice.toLocaleString('en-IN')}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-black text-slate-800">₹{lineTotal.toLocaleString('en-IN')}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                                
                                {/* Invoice Summary Footer */}
                                <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col items-end gap-3 text-sm">
                                   <div className="flex justify-between w-full max-w-[300px] text-slate-600">
                                     <span className="font-bold text-slate-500 uppercase tracking-wider text-xs">Subtotal</span>
                                     <span className="font-bold text-slate-800">₹{sale.subtotalAmount ? sale.subtotalAmount.toLocaleString('en-IN') : sale.totalAmount.toLocaleString('en-IN')}</span>
                                   </div>
                                   
                                   {sale.isGstBill ? (
                                     <div className="flex justify-between w-full max-w-[300px] text-slate-500">
                                       <span className="font-bold text-slate-500 uppercase tracking-wider text-xs">Tax/GST Addition</span>
                                       <span className="text-slate-800 font-semibold">+₹{sale.gstAmount ? sale.gstAmount.toLocaleString('en-IN') : '0'}</span>
                                     </div>
                                   ) : (
                                     <div className="flex justify-between w-full max-w-[300px] text-slate-500">
                                       <span className="font-bold text-slate-500 uppercase tracking-wider text-xs">Tax/GST Addition</span>
                                       <span className="text-xs font-semibold bg-slate-200 px-2 py-0.5 rounded text-slate-600">NON-GST BILL</span>
                                     </div>
                                   )}
                                   
                                   <div className="w-full max-w-[300px] h-px bg-slate-300 my-1"></div>
                                   <div className="flex justify-between w-full max-w-[300px] text-slate-900 text-xl items-center">
                                     <span className="font-black uppercase tracking-widest text-sm">Total Bill Value</span>
                                     <span className="font-black text-emerald-600">₹{sale.totalAmount.toLocaleString('en-IN')}</span>
                                   </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50">
            <ShoppingCart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No purchases yet</h3>
            <p className="text-slate-500 mt-1">This client hasn't made any purchases.</p>
          </div>
        )}
      </div>
    </div>
  );
}
