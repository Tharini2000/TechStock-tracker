import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { deleteProduct, fetchProducts } from "../../services/productService";
import { useToast } from "../../context/ToastContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Boxes,
} from "lucide-react";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const productRes = await fetchProducts();
      setProducts(productRes.items || []);
    } catch (error) {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      const response = await deleteProduct(id);
      showToast("Product deleted successfully", "success");
      // Remove deleted product from state immediately
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to delete product";
      showToast(errorMsg, "error");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner label="Loading products..." />;

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-[-100px] top-[-80px] h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <Sidebar />

        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg">
                  <Package size={26} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-400">
                    Inventory Control
                  </p>
                  <h1 className="mt-1 text-3xl font-bold text-white">
                    Manage Inventory
                  </h1>
                  <p className="mt-2 text-sm text-slate-400">
                    Add, edit, and organize products in your inventory system.
                  </p>
                </div>
              </div>

              <Link
                to="/admin/products/add"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
              >
                <Plus size={18} />
                Add New Product
              </Link>
            </div>
          </div>

          {/* Summary Card */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Products</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {products.length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400">
                  <Boxes size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Low Stock Items</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {products.filter((p) => p.quantity < 25).length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                  <AlertTriangle size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl sm:col-span-2 xl:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Healthy Stock</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {products.filter((p) => p.quantity >= 25).length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={22} />
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                <Package size={22} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Product List
                </h2>
                <p className="text-sm text-slate-400">
                  Manage available inventory items
                </p>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
                  <Boxes size={28} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  No products found
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Add your first product to start managing inventory.
                </p>

                <Link
                  to="/admin/products/add"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
                >
                  <Plus size={16} />
                  Add Product
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden overflow-x-auto lg:block">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-slate-400">
                        <th className="px-3 py-3 font-medium">Product ID</th>
                        <th className="px-3 py-3 font-medium">Image</th>
                        <th className="px-3 py-3 font-medium">Name</th>
                        <th className="px-3 py-3 font-medium">Category</th>
                        <th className="px-3 py-3 font-medium">Qty</th>
                        <th className="px-3 py-3 font-medium">Price</th>
                        <th className="px-3 py-3 font-medium">Stock Alert</th>
                        <th className="px-3 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product._id}
                          className="border-b border-white/5 text-slate-300 transition hover:bg-white/5"
                        >
                          <td className="px-3 py-4 text-white">
                            {product.productId || "—"}
                          </td>

                          <td className="px-3 py-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-12 w-12 rounded-xl border border-white/10 object-cover"
                            />
                          </td>

                          <td className="px-3 py-4">
                            <p className="font-semibold text-white">
                              {product.name}
                            </p>
                          </td>

                          <td className="px-3 py-4 text-slate-300">
                            {product.category?.categoryName || "Uncategorized"}
                          </td>

                          <td className="px-3 py-4 text-white">
                            {product.quantity}
                          </td>

                          <td className="px-3 py-4 text-white">
                            ${Number(product.price).toFixed(2)}
                          </td>

                          <td className="px-3 py-4">
                            {product.quantity < 25 ? (
                              <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300">
                                Low Stock Warning
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                                In Stock
                              </span>
                            )}
                          </td>

                          <td className="px-3 py-4">
                            <div className="flex gap-2">
                              <Link
                                to={`/admin/products/${product._id}/edit`}
                                className="inline-flex items-center gap-1 rounded-xl bg-amber-500/15 px-3 py-2 text-xs font-medium text-amber-300 transition hover:bg-amber-500/25 hover:text-white"
                              >
                                <Pencil size={14} />
                                Edit
                              </Link>

                              <button
                                onClick={() => setConfirmDelete(product._id)}
                                disabled={deletingId === product._id}
                                className="inline-flex items-center gap-1 rounded-xl bg-rose-500/15 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <Trash2 size={14} />
                                {deletingId === product._id ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile / Tablet Cards */}
                <div className="grid gap-4 lg:hidden">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-16 w-16 rounded-xl border border-white/10 object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-slate-400">Product ID</p>
                          <h4 className="truncate text-sm font-medium text-white">
                            {product.productId || "—"}
                          </h4>
                          <h3 className="truncate text-lg font-semibold text-white">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-sm text-slate-400">
                            {product.category?.categoryName || "Uncategorized"}
                          </p>

                          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-xl bg-white/5 px-3 py-2">
                              <p className="text-xs text-slate-400">Qty</p>
                              <p className="font-semibold text-white">
                                {product.quantity}
                              </p>
                            </div>

                            <div className="rounded-xl bg-white/5 px-3 py-2">
                              <p className="text-xs text-slate-400">Price</p>
                              <p className="font-semibold text-white">
                                ${Number(product.price).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3">
                            {product.quantity < 25 ? (
                              <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300">
                                Low Stock Warning
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                                In Stock
                              </span>
                            )}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Link
                              to={`/admin/products/${product._id}/edit`}
                              className="inline-flex items-center gap-1 rounded-xl bg-amber-500/15 px-3 py-2 text-xs font-medium text-amber-300 transition hover:bg-amber-500/25 hover:text-white"
                            >
                              <Pencil size={14} />
                              Edit
                            </Link>

                            <button
                              onClick={() => setConfirmDelete(product._id)}
                              disabled={deletingId === product._id}
                              className="inline-flex items-center gap-1 rounded-xl bg-rose-500/15 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Trash2 size={14} />
                              {deletingId === product._id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl max-w-sm w-full">
            <h3 className="text-xl font-bold text-white">Delete Product?</h3>
            <p className="mt-2 text-sm text-slate-400">
              This action cannot be undone. The product will be permanently removed from your inventory.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-50"
                disabled={deletingId === confirmDelete}
              >
                {deletingId === confirmDelete ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageProducts;