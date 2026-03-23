import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../services/productService";
import { addToCart } from "../services/cartService";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";
import {
  Search,
  PackageSearch,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts({ search: query });
      setProducts(data.items || []);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to fetch products",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 });
      showToast("Added to cart", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Could not add product",
        "error"
      );
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-8rem)] overflow-hidden bg-slate-950 px-4 py-10">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute left-[-100px] top-[-80px] h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg">
              <ShoppingBag size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Products & Orders
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Browse products and add items to your cart
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
            <p className="text-lg font-bold text-white">{products.length}</p>
            <p className="text-xs text-slate-400">Available Products</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400">
              <Search size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Search Products</h2>
              <p className="text-sm text-slate-400">
                Find the products you need quickly
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative w-full md:w-2/3">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
                placeholder="Search by product name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") loadProducts();
                }}
              />
            </div>

            <button
              onClick={loadProducts}
              className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-3 font-semibold text-white shadow-lg transition hover:opacity-95"
            >
              Search
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && <LoadingSpinner label="Loading products..." />}

        {/* Product Grid / Empty State */}
        {!loading && products.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-slate-300">
              <PackageSearch size={36} />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">
              No products found
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
              We couldn’t find any products matching your search. Try a
              different product name or browse all available items.
            </p>

            <button
              onClick={() => {
                setQuery("");
                setTimeout(() => loadProducts(), 0);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
            >
              <Sparkles size={17} />
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="rounded-3xl border border-white/10 bg-white/5 p-1 shadow-xl backdrop-blur-xl transition hover:border-brand-500/30 hover:bg-white/10"
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;