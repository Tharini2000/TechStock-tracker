import { useState } from "react";
import { useToast } from "../context/ToastContext";
import {
  Mail,
  Phone,
  User,
  MessageSquare,
  Send,
  Headphones,
} from "lucide-react";

const Contact = () => {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

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

      // 👉 Replace with your API later
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast("Message sent successfully!", "success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      showToast("Failed to send message", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-8rem)] bg-slate-950 px-4 py-10">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute left-[-100px] top-[-80px] h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg">
            <Headphones size={28} />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">
            Contact Support
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Send us a message and we’ll help you with your inventory system
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Contact Info */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Mail className="text-brand-400" size={20} />
                <div>
                  <p className="text-sm font-semibold text-white">Email</p>
                  <p className="text-sm text-slate-400">
                    support@techstock.local
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Phone className="text-cyan-400" size={20} />
                <div>
                  <p className="text-sm font-semibold text-white">Phone</p>
                  <p className="text-sm text-slate-400">
                    +94 00 000 0000
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <p className="text-sm text-slate-400">
                Our support team is available Monday to Friday, 9 AM – 5 PM.
                We usually respond within 24 hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {/* Name */}
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

              {/* Email */}
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

              {/* Message */}
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

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
                {!loading && <Send size={18} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;