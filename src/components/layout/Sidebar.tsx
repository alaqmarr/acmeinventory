import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  Package,
  LayoutDashboard,
  ShoppingCart,
  ArrowDownToLine,
  FileText,
  QrCode,
  LogOut,
  PackageSearch,
  Users,
  LineChart
} from "lucide-react";

export async function Sidebar() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const allLinks = [
    {
      href: "/",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ["SUPERADMIN", "ADMIN"]
    },
    {
      href: "/sales",
      label: "Point of Sale",
      icon: <ShoppingCart className="w-5 h-5" />,
      roles: ["SUPERADMIN", "ADMIN"]
    },
    {
      href: "/stock-inward",
      label: "Stock Inward",
      icon: <ArrowDownToLine className="w-5 h-5" />,
      roles: ["SUPERADMIN", "ADMIN"]
    },
    {
      href: "/stock-check",
      label: "Stock Check",
      icon: <PackageSearch className="w-5 h-5" />,
      roles: ["SUPERADMIN", "ADMIN"]
    },
    {
      href: "/products",
      label: "Products",
      icon: <Package className="w-5 h-5" />,
      roles: ["SUPERADMIN"]
    },
    {
      href: "/product-qr-print",
      label: "QR Labels",
      icon: <QrCode className="w-5 h-5" />,
      roles: ["SUPERADMIN", "ADMIN"]
    },
    {
      href: "/clients",
      label: "Clients",
      icon: <Users className="w-5 h-5" />,
      roles: ["SUPERADMIN", "ADMIN"]
    },
    {
      href: "/reports",
      label: "Reports",
      icon: <FileText className="w-5 h-5" />,
      roles: ["SUPERADMIN"]
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: <LineChart className="w-5 h-5" />,
      roles: ["SUPERADMIN"]
    },
    {
      href: "/ledger",
      label: "Ledger",
      icon: <FileText className="w-5 h-5" />,
      roles: ["SUPERADMIN"]
    },
    {
      href: "/users",
      label: "User Management",
      icon: <Users className="w-5 h-5" />,
      roles: ["SUPERADMIN"]
    },
    {
      href: "/export",
      label: "Data Export",
      icon: <ArrowDownToLine className="w-5 h-5" />,
      roles: ["SUPERADMIN"]
    },
  ];

  const userRole = (session.user as any)?.role || "ADMIN";
  const links = allLinks.filter(link => link.roles.includes(userRole));

  return (
    <aside className="w-72 bg-slate-950 text-slate-300 shadow-2xl z-10 flex flex-col h-full shrink-0 hidden md:flex border-r border-slate-900">
      <div className="p-8 border-b border-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-indigo-500">
            <span className="text-white font-black text-2xl">A</span>
          </div>
          <div>
            <h2 className="font-bold text-white text-xl tracking-tight leading-tight">Acme</h2>
            <p className="text-xs text-indigo-300/80 font-medium tracking-wide uppercase mt-0.5">Inventory</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2">
        <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-4 py-3.5 rounded-[1.5rem] text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all group"
          >
            <div className="text-slate-500 group-hover:text-indigo-400 transition-colors">
              {link.icon}
            </div>
            <span className="font-semibold text-sm tracking-wide">{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="p-6 border-t border-slate-800/50 bg-slate-950/50">
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Logged in as</span>
            <span className="text-sm font-bold text-white truncate max-w-[120px]">
              {session.user?.name || "Admin"}
            </span>
          </div>
          <Link
            href="/api/auth/signout"
            className="p-2.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all rounded-[1rem]"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
