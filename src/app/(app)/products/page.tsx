import { getProducts } from "./actions";
import ProductClient from "./ProductClient";
export const metadata = { title: "Products | Acme Inventory" };
export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductClient initialProducts={products} />;
}
