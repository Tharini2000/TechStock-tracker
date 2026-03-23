import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { fetchPurchaseRequests, updatePurchaseStatus } from "../../services/purchaseService";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700"
};

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    try {
      const data = await fetchPurchaseRequests();
      setRequests(data);
    } catch (error) {
      setRequests([]);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleDecision = async (id, status) => {
    try {
      await updatePurchaseStatus(id, status);
      loadRequests();
    } catch (error) {
      // Silent fail for compact UI
    }
  };

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
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Quantity</th>
                <th className="px-3 py-2">Reason</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-b border-slate-100">
                  <td className="px-3 py-2">{request.user?.name}</td>
                  <td className="px-3 py-2">{request.product?.productName}</td>
                  <td className="px-3 py-2">{request.quantity}</td>
                  <td className="px-3 py-2">{request.reason}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[request.status]}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {request.status === "pending" ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleDecision(request._id, "approved")} className="rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">Approve</button>
                        <button onClick={() => handleDecision(request._id, "rejected")} className="rounded bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700">Reject</button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Processed</span>
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

export default ManageRequests;
