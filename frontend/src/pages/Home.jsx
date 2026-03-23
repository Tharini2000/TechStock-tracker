import { Link } from "react-router-dom";
import {
  Boxes,
  PackageCheck,
  ShoppingCart,
  BarChart3,
  ShieldCheck,
  ClipboardList,
  ArrowRight,
  Warehouse,
  BellRing,
  Users,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: <PackageCheck size={22} />,
      title: "Inventory Tracking",
      description:
        "Track product quantities, categories, and stock movement in real time.",
    },
    {
      icon: <ShoppingCart size={22} />,
      title: "Order Management",
      description:
        "Manage customer and internal orders with a clean, organized workflow.",
    },
    {
      icon: <BellRing size={22} />,
      title: "Low Stock Alerts",
      description:
        "Get notified when stock levels fall below safe inventory limits.",
    },
    {
      icon: <BarChart3 size={22} />,
      title: "Reports & Insights",
      description:
        "Generate useful reports for smarter purchasing and stock decisions.",
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Role-Based Access",
      description:
        "Secure authentication for admins and users with protected access.",
    },
    {
      icon: <ClipboardList size={22} />,
      title: "Purchase Requests",
      description:
        "Submit and manage internal purchase requests with better control.",
    },
  ];

  const stats = [
    { label: "Products Managed", value: "500+" },
    { label: "Orders Processed", value: "1,200+" },
    { label: "Low Stock Alerts", value: "24/7" },
    { label: "Team Access", value: "Secure" },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-10 lg:px-6">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-[-100px] top-[-80px] h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute right-[-120px] top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-100px] left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-10">
        {/* Hero Section */}
        <div className="grid items-center gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl lg:grid-cols-2 lg:p-12">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <Boxes size={18} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-200">
                TechStock Tracker
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
              Smart Inventory &  Order Management
              
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              A modern platform to manage stock, track inventory levels, process
              orders, monitor purchase requests, and improve operational
              decisions through one centralized dashboard.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
              >
                Explore Products
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/register"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Get Started
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-center"
                >
                  <p className="text-xl font-bold text-white">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                <Warehouse size={22} />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Centralized Inventory
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Keep all product, stock, and category data in one secure place.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <ShoppingCart size={22} />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Faster Orders
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Simplify order creation, tracking, and internal request flow.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md sm:col-span-2">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Users size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Built for Teams
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Designed for inventory admins, product teams, and purchasing
                    workflows with secure role-based access and clear reporting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div>
          <div className="mb-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-400">
              Core Features
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Everything you need to manage stock and orders
            </h2>
            <p className="mt-3 text-sm text-slate-400 md:text-base">
              Built to replace manual spreadsheets with a faster, smarter, and
              more reliable workflow.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-brand-500/30 hover:bg-white/10"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-brand-500/10 via-cyan-500/10 to-indigo-500/10 p-8 text-center backdrop-blur-xl">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-white">
              Ready to modernize your inventory workflow?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300 md:text-base">
              Start managing products, stock alerts, purchase requests, and
              orders from one modern web application.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/login"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Login Now
              </Link>

              <Link
                to="/about"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;