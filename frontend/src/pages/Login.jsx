import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import StatusMessage from "../components/StatusMessage";
import {
  Boxes,
  ShieldCheck,
  Package,
  BarChart3,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login: loginContext } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.includes("@")) {
      setStatus({ type: "error", text: "Please enter a valid email." });
      return;
    }

    if (!form.password) {
      setStatus({ type: "error", text: "Password is required." });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: "", text: "" });

      const data = await login({
        email: form.email,
        password: form.password,
      });

      // Update auth context with user data
      loginContext(data);

      // Navigate based on user role
      if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/products", { replace: true });
      }
    } catch (error) {
      setStatus({
        type: "error",
        text: error.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute left-[-100px] top-[-80px] h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:px-8">
        {/* Left side content */}
        <div className="hidden lg:block">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg">
                <Boxes size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  TechStock Tracker
                </h2>
                <p className="text-xs text-slate-400">
                  Inventory Management System
                </p>
              </div>
            </div>

            <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white">
              Smarter inventory
              <span className="block bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
                starts here
              </span>
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Sign in to manage products, track stock levels, monitor orders,
              and control inventory operations through a secure and modern
              platform.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                  <Package size={22} />
                </div>
                <h3 className="text-base font-semibold text-white">
                  Product Tracking
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Manage available stock, update item quantities, and monitor
                  movement easily.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <BarChart3 size={22} />
                </div>
                <h3 className="text-base font-semibold text-white">
                  Inventory Insights
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Access organized data for better stock and order decisions.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Secure Role-Based Access
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Safe access for admins and users with a smooth login
                      experience and protected workflow access.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side login card */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg">
                <Boxes size={28} />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-white">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Login to your inventory management account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email Address
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
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-12 text-white placeholder:text-slate-500 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-400">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) =>
                      setForm({ ...form, remember: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-white/10 bg-slate-800 text-brand-600 focus:ring-brand-500"
                  />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="font-medium text-brand-400 transition hover:text-brand-300"
                >
                  Forgot password?
                </Link>
              </div>

              <StatusMessage type={status.type} message={status.text} />

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Login"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-wider text-slate-500">
                Secure Access
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <p className="text-center text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-brand-400 transition hover:text-brand-300"
              >
                Create an account
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Secure inventory control for modern electronic product teams.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;