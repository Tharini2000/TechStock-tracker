import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import {
  getMyContactSupportRequests,
  submitContactSupport,
} from "../services/contactSupportService";
import {
  Mail,
  Phone,
  User,
  MessageSquare,
  Send,
  Headphones,
  Reply,
  Clock,
} from "lucide-react";

const Contact = () => {
  const { showToast } = useToast();
  const { auth } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    if (auth?.user) {
      setForm((prev) => ({
        ...prev,
        name: auth.user.name || prev.name,
        email: auth.user.email || prev.email,
      }));
    }
  }, [auth?.user]);

  const loadMyRequests = async () => {
    if (!auth?.user) {
      setMyRequests([]);
      return;
    }

    try {
      setLoadingRequests(true);
      const data = await getMyContactSupportRequests();
      setMyRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      setMyRequests([]);
      showToast("Failed to load your support requests", "error");
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadMyRequests();
  }, [auth?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      showToast("All fields are required", "error");
      return;
    }

    if (!form.email.includes("@")) {
      showToast("Enter a valid email", "error");
      return;
    }

    try {
      setLoading(true);
      await submitContactSupport(form);
      showToast("Customer support request sent successfully!", "success");

      setForm((prev) => ({
        name: auth?.user?.name || prev.name || "",
        email: auth?.user?.email || prev.email || "",
        message: "",
      }));

      await loadMyRequests();
    } catch (err) {
      const validationError = err.response?.data?.errors?.[0]?.msg;
      showToast(
        validationError ||
          err.response?.data?.message ||
          "Failed to send customer support request",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-8rem)] bg-slate-950 px-4 py-10">
      <div className="absolute inset-0">
        <div className="absolute left-[-100px] top-[-80px] h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg">
            <Headphones size={28} />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">Contact Support</h1>
          <p className="mt-2 text-sm text-slate-400">
            Send us a message and we'll help you with your inventory system
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Mail className="text-brand-400" size={20} />
                <div>
                  <p className="text-sm font-semibold text-white">Email</p>
                  <p className="text-sm text-slate-400">support@techstock.com</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Phone className="text-cyan-400" size={20} />
                <div>
                  <p className="text-sm font-semibold text-white">Phone</p>
                  <p className="text-sm text-slate-400">+94 77 843 7500</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <p className="text-sm text-slate-400">
                Our support team is available Monday to Friday, 9 AM - 5 PM. We usually
                respond within 24 hours.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm text-slate-300">Your Name</label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-10 pr-4 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300">Your Email</label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-10 pr-4 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300">Message</label>
                <div className="relative mt-2">
                  <MessageSquare className="absolute left-3 top-3 text-slate-400" size={18} />
                  <textarea
                    rows="4"
                    placeholder="Write your message..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-10 pr-4 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Customer Support"}
                {!loading && <Send size={18} />}
              </button>
            </form>
          </div>
        </div>

        {auth?.user ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white">My Support Requests</h2>
            <p className="mt-1 text-sm text-slate-400">
              Track your submitted contact messages and admin replies.
            </p>

            {loadingRequests ? (
              <p className="mt-5 text-sm text-slate-400">Loading your support messages...</p>
            ) : myRequests.length === 0 ? (
              <p className="mt-5 text-sm text-slate-400">
                You have not submitted any support requests yet.
              </p>
            ) : (
              <div className="mt-5 space-y-4">
                {myRequests.map((request) => (
                  <div
                    key={request._id}
                    className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-white">{request.email}</p>
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

                    <p className="mt-3 text-sm leading-7 text-slate-300">{request.message}</p>

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <Clock size={14} />
                      Submitted on {new Date(request.createdAt).toLocaleString()}
                    </div>

                    {request.adminReply?.message && (
                      <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                        <div className="flex items-center gap-2">
                          <Reply size={14} className="text-emerald-400" />
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                            Admin Reply
                          </p>
                        </div>
                        <p className="mt-2 text-sm leading-7 text-slate-200">
                          {request.adminReply.message}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {request.adminReply?.repliedAt
                            ? `Replied on ${new Date(request.adminReply.repliedAt).toLocaleString()}`
                            : ""}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            Login as customer to view your support request replies from admin.
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
