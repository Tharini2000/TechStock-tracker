import { useEffect, useState } from "react";
import { fetchPurchaseRequests } from "../../services/purchaseService";

const badgeClass = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700"
};

const UserRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchPurchaseRequests();
        setRequests(data);
      } catch (error) {
        setRequests([]);
      }
    };

    loadRequests();
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <h1 className="text-2xl font-bold text-slate-900">My Purchase Requests</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-600">
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Quantity</th>
              <th className="px-3 py-2">Reason</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border-b border-slate-100">
                <td className="px-3 py-2">{request.product?.productName}</td>
                <td className="px-3 py-2">{request.quantity}</td>
                <td className="px-3 py-2">{request.reason}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeClass[request.status]}`}>
                    {request.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserRequests;
