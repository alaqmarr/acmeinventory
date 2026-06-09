import StockCheckClient from "./StockCheckClient";
export const metadata = { title: "Stock Check - Acme Industrial Equipments" };
export default function StockCheckPage() {
  return (
    <div className="p-6">
      <StockCheckClient />
    </div>
  );
}
