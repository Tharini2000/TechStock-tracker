import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
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
  User,
  ArrowRight,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    adminCode: "",
  });

  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setStatus({ type: "error", text: "Name is required." });
      return;
    }

    if (!form.email.includes("@")) {
      setStatus({ type: "error", text: "Please enter a valid email." });
      return;
    }

    if (!form.password) {
      setStatus({ type: "error", text: "Password is required." });
      return;
    }

    if (form.password.length < 6) {
      setStatus({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setStatus({
        type: "error",
        text: "Passwords do not match.",
      });
      return;
    }

    if (form.role === "admin" && !form.adminCode.trim()) {
      setStatus({
        type: "error",
        text: "Admin code is required for admin registration.",
      });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: "", text: "" });

      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        adminCode: form.role === "admin" ? form.adminCode : undefined,
      });

      setStatus({
        type: "success",
        text: "Registration successful. Redirecting to login...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setStatus({
        type: "error",
        text: error.response?.data?.message || "Registration failed.",
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
              Create your
              <span className="block bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
                smart inventory account
              </span>
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Register to manage products, monitor stock, track orders, and
              streamline inventory operations in one secure platform.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                  <Package size={22} />
                </div>
                <h3 className="text-base font-semibold text-white">
                  Stock Management
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Organize products, quantities, categories, and stock flow with
                  ease.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <BarChart3 size={22} />
                </div>
                <h3 className="text-base font-semibold text-white">
                  Better Visibility
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Access inventory data and ordering details for smarter
                  decisions.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Secure User Access
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Register safely and access your inventory tools through a
                      secure role-based system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side register card */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg">
                <Boxes size={28} />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-white">
                Create Account
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Register for your inventory management account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
                  />
                </div>
              </div>

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
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
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
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
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

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-12 text-white placeholder:text-slate-500 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Account Type
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-4 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {form.role === "admin" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Admin Code
                  </label>
                  <div className="relative">
                    <ShieldCheck
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="password"
                      name="adminCode"
                      placeholder="Enter admin code"
                      value={form.adminCode}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
                    />
                  </div>
                </div>
              )}

              <StatusMessage type={status.type} message={status.text} />

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Register"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-wider text-slate-500">
                Secure Registration
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-brand-400 transition hover:text-brand-300"
              >
                Login here
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Secure inventory access for modern electronic product teams.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;