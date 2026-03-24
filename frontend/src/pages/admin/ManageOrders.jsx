import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { fetchOrders, updateOrderStatus } from "../../services/orderService";
import { useToast } from "../../context/ToastContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  ClipboardList,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Clock3,
  ShieldCheck,
  PackageCheck,
  TrendingUp,
} from "lucide-react";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const { showToast } = useToast();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data || []);
    } catch {
      showToast("Failed to load purchase requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const decide = async (id, status) => {
    try {
      setProcessingId(id);
      await updateOrderStatus(id, status);
      showToast(`Order ${status}`, "success");
      loadOrders();
    } catch (error) {
      showToast(error.response?.data?.message || "Decision failed", "error");
    } finally {
      setProcessingId("");
    }
  };

  const getStatusClasses = (status) => {
    const value = status?.toLowerCase();

    if (value === "pending") {
      return "bg-amber-500/15 text-amber-300 border border-amber-500/20";
    }

    if (value === "approved" || value === "completed" || value === "delivered") {
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20";
    }

    if (value === "rejected" || value === "cancelled") {
      return "bg-rose-500/15 text-rose-300 border border-rose-500/20";
    }

    return "bg-slate-500/15 text-slate-300 border border-slate-500/20";
  };

  if (loading) return <LoadingSpinner label="Loading purchase requests..." />;

  const pendingCount = orders.filter(
    (order) => order.status?.toLowerCase() === "pending"
  ).length;

  const approvedCount = orders.filter((order) =>
    ["approved", "completed", "delivered"].includes(order.status?.toLowerCase())
  ).length;

  const rejectedCount = orders.filter((order) =>
    ["rejected", "cancelled"].includes(order.status?.toLowerCase())
  ).length;

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
                  <ClipboardList size={26} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-400">
                    Order Control
                  </p>
                  <h1 className="mt-1 text-3xl font-bold text-white">
                    Manage Purchase Requests
                  </h1>
                  <p className="mt-2 text-sm text-slate-400">
                    Review customer purchase requests and approve or reject them
                    from the admin panel.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Admin Access</p>
                  <p className="text-sm font-semibold text-white">
                    Order Management
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Requests</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {orders.length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400">
                  <ShoppingBag size={22} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <TrendingUp size={14} />
                Total order records
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Pending</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {pendingCount}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                  <Clock3 size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Approved</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {approvedCount}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Rejected</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {rejectedCount}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
                  <XCircle size={22} />
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                <PackageCheck size={22} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Purchase Request List
                </h2>
                <p className="text-sm text-slate-400">
                  Review all submitted order requests
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
                  <ClipboardList size={28} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  No purchase requests found
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  New orders will appear here when customers place requests.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden overflow-x-auto lg:block">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-slate-400">
                        <th className="px-3 py-3 font-medium">User</th>
                        <th className="px-3 py-3 font-medium">Total</th>
                        <th className="px-3 py-3 font-medium">Date</th>
                        <th className="px-3 py-3 font-medium">Status</th>
                        <th className="px-3 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-b border-white/5 text-slate-300 transition hover:bg-white/5"
                        >
                          <td className="px-3 py-4 font-semibold text-white">
                            {order.userId?.name || "Unknown"}
                          </td>
                          <td className="px-3 py-4 text-white">
                            ${order.totalPrice.toFixed(2)}
                          </td>
                          <td className="px-3 py-4 text-slate-300">
                            {new Date(order.orderDate).toLocaleString()}
                          </td>
                          <td className="px-3 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-3 py-4">
                            {order.status === "pending" ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => decide(order._id, "approved")}
                                  disabled={processingId === order._id}
                                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/15 px-3 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  <CheckCircle2 size={14} />
                                  {processingId === order._id
                                    ? "Processing..."
                                    : "Approve"}
                                </button>

                                <button
                                  onClick={() => decide(order._id, "rejected")}
                                  disabled={processingId === order._id}
                                  className="inline-flex items-center gap-1 rounded-xl bg-rose-500/15 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  <XCircle size={14} />
                                  {processingId === order._id
                                    ? "Processing..."
                                    : "Reject"}
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-500">
                                Processed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="grid gap-4 lg:hidden">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-semibold text-white">
                            {order.userId?.name || "Unknown"}
                          </h3>
                          <p className="mt-1 text-sm text-slate-400">
                            ${order.totalPrice.toFixed(2)}
                          </p>
                        </div>

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-slate-400">
                        {new Date(order.orderDate).toLocaleString()}
                      </p>

                      <div className="mt-4">
                        {order.status === "pending" ? (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => decide(order._id, "approved")}
                              disabled={processingId === order._id}
                              className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/15 px-3 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <CheckCircle2 size={14} />
                              {processingId === order._id
                                ? "Processing..."
                                : "Approve"}
                            </button>

                            <button
                              onClick={() => decide(order._id, "rejected")}
                              disabled={processingId === order._id}
                              className="inline-flex items-center gap-1 rounded-xl bg-rose-500/15 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <XCircle size={14} />
                              {processingId === order._id
                                ? "Processing..."
                                : "Reject"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">
                            Processed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageOrders;