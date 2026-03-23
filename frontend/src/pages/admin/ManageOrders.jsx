import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { fetchOrders, updateOrderStatus } from "../../services/orderService";
import { useToast } from "../../context/ToastContext";
import LoadingSpinner from "../../components/LoadingSpinner";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
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
      await updateOrderStatus(id, status);
      showToast(`Order ${status}`, "success");
      loadOrders();
    } catch (error) {
      showToast(error.response?.data?.message || "Decision failed", "error");
    }
  };

  if (loading) return <LoadingSpinner label="Loading purchase requests..." />;

  return (
    <section className="flex flex-col gap-4 lg:flex-row">
      <Sidebar />
      <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <h1 className="text-2xl font-bold text-slate-900">Manage Purchase Requests</h1>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-600">
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-slate-100">
                  <td className="px-3 py-2">{order.userId?.name || "Unknown"}</td>
                  <td className="px-3 py-2">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-3 py-2">{new Date(order.orderDate).toLocaleString()}</td>
                  <td className="px-3 py-2">{order.status}</td>
                  <td className="px-3 py-2">
                    {order.status === "pending" ? (
                      <div className="flex gap-2">
                        <button onClick={() => decide(order._id, "approved")} className="rounded bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Approve</button>
                        <button onClick={() => decide(order._id, "rejected")} className="rounded bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">Reject</button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ManageOrders;
