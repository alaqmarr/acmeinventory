"use client";

import { useState } from "react";
import { generateExportFile } from "./actions";
import { Download, FileSpreadsheet } from "lucide-react";

export function ExportClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const base64Data = await generateExportFile();
      const binaryString = window.atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Acme_Inventory_Backup_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Failed to generate export file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Data Export</h1>
        <p className="text-slate-500 mt-1">Download a complete backup of your system data</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
          <FileSpreadsheet className="w-10 h-10" />
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-slate-900">Excel Backup</h2>
          <p className="text-slate-500 max-w-md mt-2 mx-auto">
            This will generate an Excel (.xlsx) file containing all your Products, Clients, Sales, and Stock Batches separated into different sheets.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleExport}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          {loading ? "Generating File..." : "Download Complete Backup"}
        </button>
      </div>
    </div>
  );
}
