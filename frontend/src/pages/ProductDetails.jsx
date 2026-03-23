import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../services/productService";
import { addToCart } from "../services/cartService";
import { useToast } from "../context/ToastContext";
import LoadingSpinner from "../components/LoadingSpinner";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId: product._id, quantity: 1 });
      showToast("Added to cart", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to add to cart", "error");
    }
  };

  if (loading) return <LoadingSpinner label="Loading product..." />;
  if (!product) return <p className="text-sm text-rose-600">Product not found.</p>;

  return (
    <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card md:grid-cols-2">
      <img src={product.image} alt={product.name} className="h-72 w-full rounded-xl object-cover" />
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
        <p className="text-slate-600">{product.description}</p>
        <p className="text-sm text-slate-700">Category: {product.category?.categoryName || product.category}</p>
        <p className="text-sm text-slate-700">Available Quantity: {product.quantity}</p>
        <p className="text-lg font-semibold text-brand-700">Price: ${product.price}</p>
        {product.quantity < 25 && <p className="rounded bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">Low Stock Warning</p>}
        <button onClick={handleAddToCart} className="inline-block rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">
          Add to Cart
        </button>
      </div>
    </section>
  );
};

export default ProductDetails;
