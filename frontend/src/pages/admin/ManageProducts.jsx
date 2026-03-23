import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { deleteProduct, fetchProducts } from "../../services/productService";
import { useToast } from "../../context/ToastContext";
import LoadingSpinner from "../../components/LoadingSpinner";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const productRes = await fetchProducts();
      setProducts(productRes.items);
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
      await deleteProduct(id);
      showToast("Product deleted", "success");
      loadData();
    } catch (error) {
      showToast("Failed to delete product", "error");
    }
  };

  if (loading) return <LoadingSpinner label="Loading products..." />;

  return (
    <section className="flex flex-col gap-4 lg:flex-row">
      <Sidebar />
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Manage Inventory</h1>
        <div>
          <Link to="/admin/products/add" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            Add New Product
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-600">
                <th className="px-3 py-2">Image</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Stock Alert</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-slate-500">
                    No products found. Add your first product to start managing inventory.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-b border-slate-100">
                    <td className="px-3 py-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-md border border-slate-200 object-cover"
                      />
                    </td>
                    <td className="px-3 py-2 font-medium text-slate-800">{product.name}</td>
                    <td className="px-3 py-2">{product.category?.categoryName || "Uncategorized"}</td>
                    <td className="px-3 py-2">{product.quantity}</td>
                    <td className="px-3 py-2">${Number(product.price).toFixed(2)}</td>
                    <td className="px-3 py-2">
                      {product.quantity < 25 ? (
                        <span className="rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">Low Stock Warning</span>
                      ) : (
                        <span className="text-xs text-emerald-700">OK</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <Link to={`/admin/products/${product._id}/edit`} className="rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">Edit</Link>
                        <button onClick={() => handleDelete(product._id)} className="rounded bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ManageProducts;
