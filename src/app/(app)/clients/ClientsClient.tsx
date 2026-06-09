"use client";

import { useState, useMemo } from "react";
import { Users, History, Phone, Search, ArrowLeft, Package, Calendar } from "lucide-react";
import { getClientDetails } from "./actions";

type ClientSummary = {
  id: string;
  name: string;
  phone: string | null;
  createdAt: Date;
  totalOrders: number;
  ltv: number;
};

type ClientDetails = {
  id: string;
  name: string;
  phone: string | null;
  createdAt: Date;
  sales: Array<{
    id: string;
    totalAmount: number;
    date: Date;
    items: Array<{
      id: string;
      quantity: number;
      unitSellPrice: number;
      product: {
        id: string;
        name: string;
      };
    }>;
  }>;
};

export default function ClientsClient({ initialClients }: { initialClients: ClientSummary[] }) {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredClients = useMemo(() => {
    return initialClients.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      (c.phone && c.phone.includes(search))
    );
  }, [initialClients, search]);

  const handleSelectClient = async (id: string) => {
    setIsLoading(true);
    try {
      const details = await getClientDetails(id);
      setSelectedClient(details as unknown as ClientDetails);
    } catch (error) {
      console.error("Failed to fetch client details", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Directory */}
        <div className={`lg:col-span-1 space-y-6 ${selectedClient ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-slate-900 focus:ring-2 focus:ring-indigo-600 transition-shadow placeholder-slate-400"
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => handleSelectClient(client.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${selectedClient?.id === client.id ? 'border-indigo-600 bg-indigo-50' : 'border-transparent bg-slate-50 hover:bg-slate-100 hover:shadow-md'}`}
                >
                  <h3 className="font-semibold text-slate-900 text-lg truncate">{client.name}</h3>
                  <div className="flex items-center text-slate-500 text-sm mt-1 mb-3">
                    <Phone className="w-4 h-4 mr-2" />
                    {client.phone || "No phone"}
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Orders</p>
                      <p className="font-bold text-slate-700">{client.totalOrders}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">LTV</p>
                      <p className="font-bold text-emerald-600">₹{client.ltv.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredClients.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                  <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p>No clients found matching "{search}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className={`lg:col-span-2 ${!selectedClient ? 'hidden lg:block' : 'block'}`}>
          {isLoading ? (
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 h-full min-h-[500px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : selectedClient ? (
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button 
                onClick={() => setSelectedClient(null)}
                className="lg:hidden flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to directory
              </button>

              <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-slate-100 pb-6 mb-6 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{selectedClient.name}</h2>
                  <div className="flex items-center text-slate-500 mt-2 font-medium">
                    <Phone className="w-5 h-5 mr-2 text-indigo-500" />
                    {selectedClient.phone || "No phone number provided"}
                  </div>
                </div>
                <div className="bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl flex flex-col items-center justify-center">
                  <span className="text-sm font-semibold uppercase tracking-wider opacity-80">Lifetime Value</span>
                  <span className="text-2xl font-black">₹{selectedClient.sales.reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-6 text-slate-800">
                  <History className="w-6 h-6 mr-3 text-indigo-600" />
                  <h3 className="text-2xl font-bold">Purchase History</h3>
                </div>

                {selectedClient.sales.length > 0 ? (
                  <div className="space-y-6">
                    {selectedClient.sales.map((sale) => (
                      <div key={sale.id} className="border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow bg-slate-50/50">
                        <div className="bg-slate-100/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 gap-4">
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 mr-3 text-slate-500" />
                            <div>
                              <p className="font-semibold text-slate-800">
                                {new Date(sale.date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">Invoice #{sale.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="text-sm text-slate-500 mr-2 font-medium">Total:</span>
                            <span className="font-bold text-lg text-slate-900">₹{sale.totalAmount.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                            <Package className="w-4 h-4 mr-2" />
                            Items Bought
                          </h4>
                          <div className="space-y-3">
                            {sale.items.map((item) => (
                              <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm mr-3">
                                    {item.quantity}x
                                  </div>
                                  <span className="font-medium text-slate-700">{item.product.name}</span>
                                </div>
                                <span className="font-semibold text-slate-600">
                                  ₹{(item.quantity * item.unitSellPrice).toLocaleString('en-IN')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    <Package className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">No purchases yet</h3>
                    <p className="text-slate-500 mt-1">This client hasn't made any orders.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 h-full min-h-[500px] flex flex-col items-center justify-center text-slate-400">
              <Users className="w-20 h-20 mb-6 text-slate-200" />
              <h3 className="text-2xl font-bold text-slate-700 mb-2">No Client Selected</h3>
              <p className="text-lg text-center max-w-sm">Select a client from the directory to view their details and purchase history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
