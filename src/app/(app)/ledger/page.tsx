import { getLedgerEntries } from "./actions";
import LedgerClient from "./LedgerClient";
export const metadata = {
  title: "Ledger | Acme Inventory",
  description:
    "Complete financial ledger of all sales and stock purchase transactions.",
};
export default async function LedgerPage() {
  const initialData = await getLedgerEntries();
  return <LedgerClient initialData={initialData} />;
}
