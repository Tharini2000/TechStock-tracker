import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { fetchDashboard } from "../../services/reportService";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  Package,
  AlertTriangle,
  ShoppingBag,
  Boxes,
  Activity,
  ClipboardList,
  ShieldCheck,
  TrendingUp,
  MessageSquareText,
} from "lucide-react";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await fetchDashboard();
        setDashboard(data);
      } catch (error) {
        setDashboard(null);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;

  const cards = [
    {
      label: "Total Products",
      value: dashboard?.cards?.totalProducts || 0,
      icon: <Package size={22} />,
      iconBg: "bg-brand-500/20 text-brand-400",
      border: "hover:border-brand-500/30",
    },
    {
      label: "Low Stock Products",
      value: dashboard?.cards?.lowStockProducts || 0,
      icon: <AlertTriangle size={22} />,
      iconBg: "bg-amber-500/20 text-amber-400",
      border: "hover:border-amber-500/30",
    },
    {
      label: "Recent Orders",
      value: dashboard?.cards?.recentOrders || 0,
      icon: <ShoppingBag size={22} />,
      iconBg: "bg-cyan-500/20 text-cyan-400",
      border: "hover:border-cyan-500/30",
    },
    {
      label: "Inventory Summary",
      value: dashboard?.cards?.inventorySummary || 0,
      icon: <Boxes size={22} />,
      iconBg: "bg-emerald-500/20 text-emerald-400",
      border: "hover:border-emerald-500/30",
    },
  ];

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
          {/* Top Heading */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-400">
                  Admin Panel
                </p>
                <h1 className="mt-2 text-3xl font-bold text-white">
                  Dashboard Overview
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  Monitor inventory, product stock, and recent orders from one
                  centralized admin dashboard.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Access Level</p>
                  <p className="text-sm font-semibold text-white">Administrator</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <article
                key={card.label}
                className={`rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl transition ${card.border} hover:bg-white/10`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">{card.label}</p>
                    <p className="mt-3 text-3xl font-bold text-white">
                      {card.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg}`}
                  >
                    {card.icon}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <TrendingUp size={14} />
                  Live dashboard summary
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Sections */}
          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            {/* Recent Orders */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                  <ClipboardList size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Recent Orders
                  </h2>
                  <p className="text-sm text-slate-400">
                    Latest order activities in the system
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {(dashboard?.recentOrders || []).length > 0 ? (
                  dashboard.recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 transition hover:border-brand-500/20 hover:bg-slate-900 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-white">
                          {order.userId?.name || "Unknown User"}
                        </p>
                        <p className="mt-1 truncate text-sm text-slate-400">
                          Order ID: {order._id}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-semibold text-white">
                          ${order.totalPrice.toFixed(2)}
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-8 text-center">
                    <p className="text-sm text-slate-400">
                      No recent orders available.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Admin Insights */}
            <section className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                    <Activity size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      System Insights
                    </h2>
                    <p className="text-sm text-slate-400">
                      Quick operational summary
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                    <p className="text-xs text-slate-400">Stock Health</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {dashboard?.cards?.lowStockProducts || 0} products need
                      attention
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                    <p className="text-xs text-slate-400">Order Flow</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {dashboard?.cards?.recentOrders || 0} recent order records
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                    <p className="text-xs text-slate-400">Inventory Control</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {dashboard?.cards?.inventorySummary || 0} total summary
                      points available
                    </p>
                  </div>

                  <Link
                    to="/admin/feedbacks"
                    className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 transition hover:border-brand-500/30 hover:bg-brand-500/10"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquareText size={16} className="text-brand-400" />
                      <div>
                        <p className="text-xs text-slate-400">Customer Feedback</p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          Review customer feedbacks
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-brand-500/10 via-cyan-500/10 to-indigo-500/10 p-6 shadow-2xl backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-white">
                  Admin Reminder
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Review low-stock products regularly, track recent orders, and
                  keep inventory updated to ensure smooth order fulfillment.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;