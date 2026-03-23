import { useEffect, useMemo, useState } from "react";
import { fetchCart, removeCartItem } from "../services/cartService";
import { placeOrder } from "../services/orderService";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";
import {
  ShoppingCart,
  Trash2,
  CreditCard,
  PackageCheck,
  ArrowRight,
  Boxes,
} from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const { showToast } = useToast();

  const total = useMemo(() => {
    if (!cart?.items) return 0;
    return cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [cart]);

  const totalItems = useMemo(() => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await fetchCart();
      setCart(data);
    } catch (error) {
      showToast("Failed to load cart", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (id) => {
    try {
      const updated = await removeCartItem(id);
      setCart(updated);
      showToast("Item removed from cart", "success");
    } catch {
      showToast("Failed to remove cart item", "error");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setPlacing(true);
      await placeOrder();
      showToast("Order placed successfully", "success");
      loadCart();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Order placement failed",
        "error"
      );
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading cart..." />;

  const isEmpty = !cart?.items?.length;

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
              <ShoppingCart size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Your Cart</h1>
              <p className="mt-1 text-sm text-slate-400">
                Review selected products and place your order
              </p>
            </div>
          </div>

          {!isEmpty && (
            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
                <p className="text-lg font-bold text-white">{totalItems}</p>
                <p className="text-xs text-slate-400">Items</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
                <p className="text-lg font-bold text-white">
                  ${total.toFixed(2)}
                </p>
                <p className="text-xs text-slate-400">Total</p>
              </div>
            </div>
          )}
        </div>

        {isEmpty ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-slate-300">
              <Boxes size={36} />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">
              Your cart is empty
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
              Looks like you haven’t added any products yet. Start browsing and
              add items to your cart to place an order.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
            >
              Browse Products
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
            {/* Cart Items */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400">
                  <PackageCheck size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Cart Items</h2>
                  <p className="text-sm text-slate-400">
                    Manage your selected products
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-brand-500/30 hover:bg-slate-900 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-300">
                        <PackageCheck size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold text-white">
                          {item.product.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                          Unit Price: ${item.product.price.toFixed(2)}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 md:items-end">
                      <div className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>

                      <button
                        onClick={() => handleRemove(item._id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/25 hover:text-white"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                  <CreditCard size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Order Summary
                  </h2>
                  <p className="text-sm text-slate-400">
                    Final review before checkout
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                  <span className="text-sm text-slate-400">Total Items</span>
                  <span className="text-sm font-semibold text-white">
                    {totalItems}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                  <span className="text-sm text-slate-400">Subtotal</span>
                  <span className="text-sm font-semibold text-white">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-brand-500/20 bg-brand-500/10 px-4 py-4">
                  <span className="text-base font-semibold text-white">
                    Grand Total
                  </span>
                  <span className="text-lg font-bold text-white">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing || !cart?.items?.length}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-3 font-semibold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {placing ? "Placing Order..." : "Place Order"}
                {!placing && <ArrowRight size={18} />}
              </button>

              <Link
                to="/products"
                className="mt-3 flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;