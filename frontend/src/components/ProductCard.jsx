import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  const lowStock = product.quantity < 25;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <img
        src={product.image}
        alt={product.name}
        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-800">{product.name}</h3>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">{product.category?.categoryName || product.category}</span>
        </div>
        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
        <div className="flex items-center justify-between text-sm">
          <p className="font-bold text-brand-700">${product.price.toFixed(2)}</p>
          <p className="font-medium text-slate-600">Stock: {product.quantity}</p>
        </div>

        {lowStock && <p className="rounded-md bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">Low Stock Warning</p>}

        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart?.(product._id)}
            className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Add to Cart
          </button>
          <Link
            to={`/products/${product._id}`}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;