"use client";
import { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { useAlert } from "@/providers/AlertProvider";
import { createProduct, updateProduct, deleteProduct } from "./actions";
type Product = {
  id: string;
  name: string;
  sku: string;
  category: string | null;
  defaultCostPrice: number | null;
  defaultSellingPrice: number;
  defaultGst: number;
  stockQuantity: number;
};
export default function ProductClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    defaultCostPrice: "",
    defaultSellingPrice: "",
    defaultGst: "18",
  });
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  );
  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category || "",
        defaultCostPrice: product.defaultCostPrice?.toString() || "",
        defaultSellingPrice: product.defaultSellingPrice.toString(),
        defaultGst: product.defaultGst.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        sku: "",
        category: "",
        defaultCostPrice: "",
        defaultSellingPrice: "",
        defaultGst: "18",
      });
    }
    setIsModalOpen(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category || undefined,
      defaultCostPrice: formData.defaultCostPrice
        ? parseFloat(formData.defaultCostPrice)
        : undefined,
      defaultSellingPrice: parseFloat(formData.defaultSellingPrice) || 0,
      defaultGst: parseFloat(formData.defaultGst) || 18,
    };
    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, payload);
    } else {
      result = await createProduct(payload);
    }
    if (result.success) {
      showAlert({
        title: "Success",
        message: editingProduct
          ? "Product updated successfully."
          : "Product created successfully.",
        type: "success",
      });
      setIsModalOpen(false);
      window.location.reload();
    } else {
      showAlert({
        title: "Error",
        message: result.error || "An error occurred.",
        type: "error",
      });
    }
    setLoading(false);
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    const result = await deleteProduct(id);
    if (result.success) {
      showAlert({
        title: "Success",
        message: "Product deleted successfully.",
        type: "success",
      });
      setProducts(products.filter((p) => p.id !== id));
    } else {
      showAlert({
        title: "Error",
        message: result.error || "Failed to delete product.",
        type: "error",
      });
    }
    setLoading(false);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-slate-900 ">Products</h1>
          <p className="text-slate-500 leading-relaxed mt-1">
            Manage your product catalog and inventory.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-slate-200/40 border border-blue-700 transition-all font-medium rounded-[1rem] hover:bg-gray-800 transition-colors flex items-center gap-2 justify-center"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 transition-all overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-[1rem] leading-5 bg-slate-50 border-slate-200 text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
              placeholder="Search products by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-slate-50 border-slate-200 ">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
                  Product Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
                  Cost / Sell (₹)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
                  GST %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 ">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500 leading-relaxed "
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50 border-slate-200/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 ">
                        {product.name}
                      </div>
                      <div className="text-sm text-slate-500 leading-relaxed">
                        SKU: {product.sku}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 ">
                      {product.category || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 ">
                      <span className="text-slate-500 leading-relaxed">
                        ₹{product.defaultCostPrice?.toLocaleString() ?? "-"}
                      </span>
                      {" / "}
                      <span className="font-medium">
                        ₹{product.defaultSellingPrice.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 ">
                      {product.defaultGst}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stockQuantity > 10 ? "bg-emerald-100 text-emerald-800 border border-emerald-200 " : "bg-rose-100 text-rose-800 border border-rose-200 "}`}
                      >
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded-lg transition-colors mr-4"
                      >
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={loading}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold tracking-tight text-slate-900 ">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-[1rem] border border-slate-200 bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="e.g. Industrial Drill"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-[1rem] border border-slate-200 bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="e.g. DRILL-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-[1rem] border border-slate-200 bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="e.g. Power Tools"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Cost Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.defaultCostPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        defaultCostPrice: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-[1rem] border border-slate-200 bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Sell Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.defaultSellingPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        defaultSellingPrice: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-[1rem] border border-slate-200 bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    GST %
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.defaultGst}
                    onChange={(e) =>
                      setFormData({ ...formData, defaultGst: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-[1rem] border border-slate-200 bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="18"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-700 font-medium bg-white hover:bg-slate-50 border border-slate-300 shadow-md shadow-slate-200/40 rounded-[1rem] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-slate-200/40 border border-blue-700 transition-all font-medium rounded-[1rem] hover:bg-gray-800 transition-colors disabled:opacity-70"
                >
                  {loading ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
