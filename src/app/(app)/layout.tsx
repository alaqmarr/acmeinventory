import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 border-slate-200 overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        <MobileNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">{children}</main>
      </div>
    </div>
  );
}
