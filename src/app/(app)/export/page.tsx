import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ExportClient } from "./ExportClient";

export default async function ExportPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPERADMIN") {
    redirect("/");
  }
  
  return <ExportClient />;
}
