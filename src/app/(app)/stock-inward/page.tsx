import { getProducts, getRecentBatches } from "./actions";
import StockInwardClient from "./StockInwardClient";
export const metadata = { title: "Stock Inward | Acme Inventory" };
export default async function StockInwardPage() {
  const [products, recentBatches] = await Promise.all([
    getProducts(),
    getRecentBatches(),
  ]);
  return (
    <StockInwardClient
      initialProducts={products}
      initialBatches={recentBatches}
    />
  );
}
