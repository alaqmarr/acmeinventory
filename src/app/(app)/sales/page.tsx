import { Metadata } from "next";
import { getRecentSales } from "./actions";
import SalesClient from "./SalesClient";
export const metadata: Metadata = { title: "Point of Sale | Acme Inventory" };
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function SalesPage() {
  const recentSales = await getRecentSales();
  return <SalesClient initialSales={recentSales} />;
}
