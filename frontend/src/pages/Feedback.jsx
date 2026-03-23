import { useState } from "react";
import { submitFeedback } from "../services/feedbackService";
import { useToast } from "../context/ToastContext";
import {
  MessageSquareText,
  User,
  Mail,
  Send,
  ShieldCheck,
  Sparkles,
  ClipboardPenLine,
} from "lucide-react";

const Feedback = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      showToast("All fields are required", "error");
      return;
    }

    if (!form.email.includes("@")) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    try {
      setLoading(true);
      await submitFeedback(form);
      showToast("Feedback submitted successfully", "success");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to submit feedback",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-8rem)] overflow-hidden bg-slate-950 px-4 py-10">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute left-[-100px] top-[-80px] h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
        {/* Left Content */}
        <div className="hidden lg:block">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg">
                <MessageSquareText size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Feedback Center</h2>
                <p className="text-xs text-slate-400">
                  Help improve TechStock Tracker
                </p>
              </div>
            </div>

            <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white">
              Your ideas make our
              <span className="block bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
                inventory system better
              </span>
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Share suggestions, report issues, or tell us how we can improve
              the experience for inventory, order management, and product
              tracking.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                  <Sparkles size={22} />
                </div>
                <h3 className="text-base font-semibold text-white">
                  Better Experience
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Suggest UI improvements and helpful features for smoother
                  workflows.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <ClipboardPenLine size={22} />
                </div>
                <h3 className="text-base font-semibold text-white">
                  Share Suggestions
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Help improve inventory tracking, ordering, and admin tools.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Secure & Valuable
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Your feedback helps shape a more secure, reliable, and
                      effective inventory management platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="mx-auto w-full max-w-2xl">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg">
                <Send size={28} />
              </div>
              <h1 className="mt-4 text-3xl font-bold text-white">
                Send Feedback
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Share your suggestions to improve TechStock Tracker
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Your Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Your Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Your Message
                </label>
                <div className="relative">
                  <MessageSquareText
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />
                  <textarea
                    className="h-36 w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
                    placeholder="Write your suggestions, issues, or feedback here..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Send Feedback"}
                {!loading && <Send size={18} />}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Your feedback helps us build a better inventory management
            experience.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Feedback;