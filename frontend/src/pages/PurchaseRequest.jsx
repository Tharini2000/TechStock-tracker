import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPurchaseRequest } from "../services/purchaseService";
import StatusMessage from "../components/StatusMessage";

const PurchaseRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ quantity: 1, reason: "" });
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(form.quantity) <= 0) {
      setStatus({ type: "error", text: "Quantity must be positive." });
      return;
    }

    if (!form.reason.trim()) {
      setStatus({ type: "error", text: "Reason is required." });
      return;
    }

    try {
      await createPurchaseRequest({ product: id, quantity: Number(form.quantity), reason: form.reason });
      setStatus({ type: "success", text: "Request submitted successfully." });
      setTimeout(() => navigate("/user/requests"), 1000);
    } catch (error) {
      setStatus({ type: "error", text: error.response?.data?.message || "Failed to submit request." });
    }
  };

  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <h1 className="text-2xl font-bold text-slate-900">Create Purchase Request</h1>
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <input
          type="number"
          min="1"
          className="w-full rounded-lg border border-slate-300 px-4 py-2"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
        <textarea
          className="h-28 w-full rounded-lg border border-slate-300 px-4 py-2"
          placeholder="Reason for request"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
        <StatusMessage type={status.type} message={status.text} />
        <button className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">
          Submit Request
        </button>
      </form>
    </section>
  );
};

export default PurchaseRequest;
