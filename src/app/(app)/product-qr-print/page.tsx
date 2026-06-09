import { getProductsForQR } from "./actions";
import QRPrintClient from "./QRPrintClient";
export const metadata = { title: "QR Labels | Acme Inventory" };
export default async function QRPrintPage() {
  const products = await getProductsForQR();
  return <QRPrintClient initialProducts={products} />;
}
