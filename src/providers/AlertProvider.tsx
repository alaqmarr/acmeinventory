"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
type AlertType = "success" | "error" | "info";
interface AlertOptions {
  title: string;
  message: string;
  type?: AlertType;
}
interface AlertContextProps {
  showAlert: (options: AlertOptions) => void;
}
const AlertContext = createContext<AlertContextProps | undefined>(undefined);
export function AlertProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertOptions>({
    title: "",
    message: "",
    type: "info",
  });
  const showAlert = (options: AlertOptions) => {
    setAlertConfig({ type: "info", ...options });
    setIsOpen(true);
  };
  const closeAlert = () => setIsOpen(false);
  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {alertConfig.type === "success" && (
                      <div className="p-2 bg-green-100 text-green-600 rounded-full">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    )}
                    {alertConfig.type === "error" && (
                      <div className="p-2 bg-red-100 text-red-600 rounded-full">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                    )}
                    {alertConfig.type === "info" && (
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-slate-900">
                      {alertConfig.title}
                    </h3>
                  </div>
                  <button
                    onClick={closeAlert}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">
                    {alertConfig.message}
                  </p>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeAlert}
                    className="px-4 py-2 bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all border border-blue-700 text-sm font-medium rounded-xl hover:bg-gray-800 :bg-gray-100 transition-colors"
                  >
                    Okay
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  );
}
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
