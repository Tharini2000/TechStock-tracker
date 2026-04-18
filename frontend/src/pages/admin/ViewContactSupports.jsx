import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getContactSupportRequests,
  replyContactSupportRequest,
} from "../../services/contactSupportService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useToast } from "../../context/ToastContext";
import {
  Headphones,
  ArrowLeft,
  User,
  Mail,
  Calendar,
  MessageSquare,
  Send,
  Reply,
} from "lucide-react";

const ViewContactSupports = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyInputs, setReplyInputs] = useState({});
  const [replyingId, setReplyingId] = useState("");
  const { showToast } = useToast();

  const loadSupportRequests = async () => {
    try {
      setLoading(true);
      const data = await getContactSupportRequests();
      const requests = Array.isArray(data) ? data : [];
      setSupportRequests(requests);

      const nextReplies = {};
      requests.forEach((request) => {
        nextReplies[request._id] = request.adminReply?.message || "";
      });
      setReplyInputs(nextReplies);
    } catch (error) {
      setSupportRequests([]);
      showToast("Failed to load customer support requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupportRequests();
  }, []);

  const handleReplyChange = (id, value) => {
    setReplyInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendReply = async (requestId) => {
    const replyMessage = (replyInputs[requestId] || "").trim();

    if (!replyMessage) {
      showToast("Reply message is required", "error");
      return;
    }

    try {
      setReplyingId(requestId);
      const updatedRequest = await replyContactSupportRequest(requestId, replyMessage);
      setSupportRequests((prev) =>
        prev.map((request) =>
          request._id === requestId ? updatedRequest : request
        )
      );
      showToast("Reply sent to customer successfully", "success");
    } catch (error) {
      const validationError = error.response?.data?.errors?.[0]?.msg;
      showToast(
        validationError || error.response?.data?.message || "Failed to send reply",
        "error"
      );
    } finally {
      setReplyingId("");
    }
  };

  if (loading) return <LoadingSpinner label="Loading customer support requests..." />;

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 px-4 py-10">
      <div className="absolute inset-0">
        <div className="absolute left-[-100px] top-[-80px] h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <Link
            to="/admin"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/70 text-slate-300 transition hover:border-brand-500 hover:bg-brand-500/10 hover:text-brand-400"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg">
              <Headphones size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Customer Support Requests</h1>
              
            </div>
          </div>
          <div className="ml-auto rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
            <p className="text-lg font-bold text-white">{supportRequests.length}</p>
            <p className="text-xs text-slate-400">Total Requests</p>
          </div>
        </div>

        {supportRequests.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-slate-300">
              <MessageSquare size={36} />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">No support requests yet</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
              Customer support requests will appear here once customers submit the contact
              support form.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {supportRequests.map((request) => (
              <div
                key={request._id}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg transition hover:border-brand-500/20 hover:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-brand-400" />
                    <h3 className="text-lg font-semibold text-white">{request.name}</h3>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      request.status === "replied"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                        : "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                    }`}
                  >
                    {request.status === "replied" ? "Replied" : "Pending"}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <Mail size={16} className="text-slate-400" />
                  <p className="text-sm text-slate-400">{request.email}</p>
                </div>

                <div className="mt-4 rounded-xl border border-white/5 bg-slate-950/50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Customer Message</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{request.message}</p>
                </div>

                {request.adminReply?.message && (
                  <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="flex items-center gap-2">
                      <Reply size={15} className="text-emerald-400" />
                      <p className="text-xs uppercase tracking-wide text-emerald-300">Admin Reply</p>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-200">{request.adminReply.message}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      Replied by {request.adminReply?.repliedBy?.name || "Admin"} on {" "}
                      {request.adminReply?.repliedAt
                        ? new Date(request.adminReply.repliedAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                )}

                <div className="mt-4 rounded-xl border border-white/5 bg-slate-950/50 p-4">
                  <label className="text-xs uppercase tracking-wide text-slate-500">
                    {request.adminReply?.message ? "Update Reply" : "Send Reply"}
                  </label>
                  <textarea
                    rows="3"
                    value={replyInputs[request._id] || ""}
                    onChange={(e) => handleReplyChange(request._id, e.target.value)}
                    placeholder="Type your reply for this customer"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendReply(request._id)}
                    disabled={replyingId === request._id}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Send size={16} />
                    {replyingId === request._id ? "Sending..." : "Send Reply to Customer"}
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Calendar size={14} className="text-slate-500" />
                  <p className="text-xs text-slate-500">
                    Submitted on {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ViewContactSupports;
