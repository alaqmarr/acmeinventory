import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role || "ADMIN";

  return (
    <div className="flex h-screen bg-slate-50 border-slate-200 overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        <MobileNav role={userRole} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">{children}</main>
      </div>
    </div>
  );
}
