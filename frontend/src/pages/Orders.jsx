import { useEffect, useState } from "react";
import { deleteOrder, fetchOrders, updateOrder } from "../services/orderService";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";
import {
  ClipboardList,
  PackageCheck,
  Pencil,
  Trash2,
  ShoppingBag,
  Clock3,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { showToast } = useToast();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data || []);
    } catch {
      showToast("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateFirstItemQty = async (order) => {
    try {
      setUpdatingId(order._id);
      const first = order.products?.[0];

      if (!first) {
        showToast("No products found in this order", "error");
        return;
      }

      const payload = {
        products: [{ product: first.product._id, quantity: first.quantity + 1 }],
      };

      await updateOrder(order._id, payload);
      showToast("Order updated", "success");
      loadOrders();
    } catch (error) {
      showToast(error.response?.data?.message || "Order update failed", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      setDeletingId(orderId);
      await deleteOrder(orderId);
      showToast("Order deleted", "success");
      loadOrders();
    } catch (error) {
      showToast(error.response?.data?.message || "Order delete failed", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusClasses = (status) => {
    const value = status?.toLowerCase();

    if (value === "pending") {
      return "bg-amber-500/15 text-amber-300 border border-amber-500/20";
    }

    if (value === "completed" || value === "delivered") {
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20";
    }

    if (value === "cancelled") {
      return "bg-rose-500/15 text-rose-300 border border-rose-500/20";
    }

    return "bg-slate-500/15 text-slate-300 border border-slate-500/20";
  };

  if (loading) return <LoadingSpinner label="Loading orders..." />;

  const isEmpty = orders.length === 0;

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
              <ClipboardList size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Your Orders</h1>
              <p className="mt-1 text-sm text-slate-400">
                Review, update, or delete your orders
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
            <p className="text-lg font-bold text-white">{orders.length}</p>
            <p className="text-xs text-slate-400">Total Orders</p>
          </div>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-200 shadow-lg">
          <Clock3 size={20} className="mt-0.5 shrink-0" />
          <p className="text-sm leading-6">
            Orders can be modified or deleted by users within <span className="font-semibold">6 hours</span>.
          </p>
        </div>

        {isEmpty ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-slate-300">
              <ShoppingBag size={36} />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">
              No orders found
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
              You haven’t placed any orders yet. Start browsing products and place your first order.
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
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order._id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition hover:border-brand-500/30 hover:bg-white/10"
              >
                {/* Top row */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400">
                        <PackageCheck size={22} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Order ID</p>
                        <p className="max-w-[260px] truncate text-sm font-semibold text-white md:max-w-[420px]">
                          {order._id}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                        <p className="text-xs text-slate-400">Total Price</p>
                        <p className="mt-1 text-base font-bold text-white">
                          ${order.totalPrice.toFixed(2)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                        <p className="text-xs text-slate-400">Items</p>
                        <p className="mt-1 text-base font-bold text-white">
                          {order.products?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                        <p className="text-xs text-slate-400">Status</p>
                        <div className="mt-2">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <button
                      onClick={() => updateFirstItemQty(order)}
                      disabled={updatingId === order._id}
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-500/15 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Pencil size={16} />
                      {updatingId === order._id ? "Updating..." : "Update "}
                    </button>

                    <button
                      onClick={() => handleDelete(order._id)}
                      disabled={deletingId === order._id}
                      className="inline-flex items-center gap-2 rounded-xl bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={16} />
                      {deletingId === order._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Products list */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
                    Ordered Products
                  </h3>

                  <div className="space-y-3">
                    {order.products?.map((item) => (
                      <div
                        key={item.product._id}
                        className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-medium text-white">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-slate-400">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <div className="text-sm font-semibold text-slate-300">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Orders;