"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  ShoppingCart,
  ArrowDownToLine,
  PackageSearch,
  Package,
  QrCode,
  Users,
  FileText,
  LineChart,
  LogOut
} from "lucide-react";

export function MobileNav({ role = "ADMIN" }: { role?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const allLinks = [
    { href: "/", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, roles: ["SUPERADMIN", "ADMIN"] },
    { href: "/sales", label: "Point of Sale", icon: <ShoppingCart className="w-5 h-5" />, roles: ["SUPERADMIN", "ADMIN"] },
    { href: "/stock-inward", label: "Stock Inward", icon: <ArrowDownToLine className="w-5 h-5" />, roles: ["SUPERADMIN", "ADMIN"] },
    { href: "/stock-check", label: "Stock Check", icon: <PackageSearch className="w-5 h-5" />, roles: ["SUPERADMIN", "ADMIN"] },
    { href: "/products", label: "Products", icon: <Package className="w-5 h-5" />, roles: ["SUPERADMIN"] },
    { href: "/product-qr-print", label: "QR Labels", icon: <QrCode className="w-5 h-5" />, roles: ["SUPERADMIN", "ADMIN"] },
    { href: "/clients", label: "Clients", icon: <Users className="w-5 h-5" />, roles: ["SUPERADMIN", "ADMIN"] },
    { href: "/reports", label: "Reports", icon: <FileText className="w-5 h-5" />, roles: ["SUPERADMIN"] },
    { href: "/analytics", label: "Analytics", icon: <LineChart className="w-5 h-5" />, roles: ["SUPERADMIN"] },
    { href: "/ledger", label: "Ledger", icon: <FileText className="w-5 h-5" />, roles: ["SUPERADMIN"] },
    { href: "/users", label: "User Management", icon: <Users className="w-5 h-5" />, roles: ["SUPERADMIN"] },
    { href: "/export", label: "Data Export", icon: <ArrowDownToLine className="w-5 h-5" />, roles: ["SUPERADMIN"] },
  ];

  const links = allLinks.filter(link => link.roles.includes(role));

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <div className="md:hidden flex items-center justify-between bg-slate-950 p-4 border-b border-slate-900 sticky top-0 z-40 shadow-md w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <span className="text-white font-black text-sm">A</span>
          </div>
          <h2 className="font-bold text-white text-lg tracking-tight">Acme</h2>
        </div>
        <button onClick={toggleMenu} className="text-slate-300 hover:text-white transition-colors p-1">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={closeMenu}></div>
          
          {/* Sliding Menu */}
          <div className="relative flex flex-col w-[85%] max-w-sm h-full bg-slate-950 border-r border-slate-800 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                   <span className="text-white font-black text-lg">A</span>
                 </div>
                 <div>
                   <h2 className="font-bold text-white text-lg tracking-tight leading-tight">Acme</h2>
                   <p className="text-[10px] text-indigo-300/80 font-medium tracking-wide uppercase mt-0.5">Inventory</p>
                 </div>
               </div>
               <button onClick={closeMenu} className="text-slate-400 hover:text-white p-1">
                 <X className="w-6 h-6" />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <div className={isActive ? 'text-white' : 'text-slate-500'}>
                      {link.icon}
                    </div>
                    <span className="font-semibold text-sm tracking-wide">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="p-6 border-t border-slate-800/50">
               <Link
                 href="/api/auth/signout"
                 onClick={closeMenu}
                 className="flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 transition-all rounded-xl w-full"
               >
                 <LogOut className="w-5 h-5" />
                 <span className="font-semibold text-sm">Sign Out</span>
               </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
