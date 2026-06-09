"use client";

import { useState, useMemo } from "react";
import { Users, Search, Phone, ArrowUpRight } from "lucide-react";
import Link from "next/link";

type ClientSummary = {
  id: string;
  name: string;
  phone: string | null;
  createdAt: Date;
  totalOrders: number;
  ltv: number;
};

export default function ClientsClient({ initialClients }: { initialClients: ClientSummary[] }) {
  const [search, setSearch] = useState("");

  const filteredClients = useMemo(() => {
    return initialClients.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      (c.phone && c.phone.includes(search))
    );
  }, [initialClients, search]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-800 p-8 rounded-[2rem] shadow-xl w-full text-white flex items-center gap-6">
        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm hidden sm:block">
          <Users size={40} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Clients Management</h1>
          <p className="text-indigo-200 mt-2 text-lg">Manage your customer relationships, view purchase history, and track lifetime value.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-[1rem] leading-5 bg-slate-50 border-slate-200 text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all"
              placeholder="Search clients by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-50 border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Total Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Lifetime Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    No clients found matching "{search}"
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/clients/${client.id}`} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 group">
                        {client.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-500">
                        <Phone className="w-4 h-4 mr-2" />
                        {client.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                        {client.totalOrders} orders
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                      ₹{client.ltv.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/clients/${client.id}`}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
