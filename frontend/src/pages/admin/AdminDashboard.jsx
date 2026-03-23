import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { fetchDashboard } from "../../services/reportService";
import LoadingSpinner from "../../components/LoadingSpinner";

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
    { label: "Total Products", value: dashboard?.cards?.totalProducts || 0 },
    { label: "Low Stock Products", value: dashboard?.cards?.lowStockProducts || 0 },
    { label: "Recent Orders", value: dashboard?.cards?.recentOrders || 0 },
    { label: "Inventory Summary", value: dashboard?.cards?.inventorySummary || 0 }
  ];

  return (
    <section className="flex flex-col gap-4 lg:flex-row">
      <Sidebar />
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
              <p className="text-sm text-slate-600">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-brand-700">{card.value}</p>
            </article>
          ))}
        </div>
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            {(dashboard?.recentOrders || []).map((order) => (
              <p key={order._id} className="rounded-md bg-slate-50 px-3 py-2">
                {order.userId?.name || "Unknown"} | ${order.totalPrice.toFixed(2)} | {order.status}
              </p>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default AdminDashboard;
