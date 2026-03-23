import {
  Boxes,
  ShieldCheck,
  BarChart3,
  PackageCheck,
  ClipboardList,
  Layers3,
} from "lucide-react";

const About = () => {
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
                <Boxes size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  About TechStock Tracker
                </h2>
                <p className="text-xs text-slate-400">
                  Smart Inventory Management Platform
                </p>
              </div>
            </div>

            <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white">
              Modern inventory
              <span className="block bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
                made simple and secure
              </span>
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              TechStock Tracker helps teams manage inventory, control stock,
              submit purchase requests, and improve daily operations through one
              centralized platform.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                  <PackageCheck size={22} />
                </div>
                <h3 className="text-base font-semibold text-white">
                  Stock Control
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Keep products, quantities, and stock levels organized in real
                  time.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <BarChart3 size={22} />
                </div>
                <h3 className="text-base font-semibold text-white">
                  Better Decisions
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Use reports and insights to make faster and smarter inventory
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
                      Secure Role-Based Access
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Built with secure authentication and controlled access for
                      admins and users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Card */}
        <div className="mx-auto w-full max-w-3xl">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg">
                <Layers3 size={28} />
              </div>
              <h1 className="mt-4 text-3xl font-bold text-white">
                About TechStock Tracker
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Inventory and Order Management System for modern product teams
              </p>
            </div>

            <div className="space-y-5 text-slate-300">
              <p className="leading-7">
                <span className="font-semibold text-white">
                  TechStock Tracker
                </span>{" "}
                is an Inventory and Order Management System developed for
                electronic product design and development teams. It replaces
                manual spreadsheet workflows with a secure, centralized, and
                role-based platform built on the MERN stack.
              </p>

              <p className="leading-7">
                The system helps teams maintain product inventory, monitor stock
                levels, submit internal purchase requests, and generate
                actionable reports for better decision making.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-brand-500/30 hover:bg-slate-900">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                  <PackageCheck size={22} />
                </div>
                <p className="text-sm font-semibold text-white">
                  Inventory Tracking
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Manage and monitor stock levels with accuracy.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-cyan-500/30 hover:bg-slate-900">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <ClipboardList size={22} />
                </div>
                <p className="text-sm font-semibold text-white">
                  Order Requests
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Submit and manage internal purchase requests easily.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-emerald-500/30 hover:bg-slate-900">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <BarChart3 size={22} />
                </div>
                <p className="text-sm font-semibold text-white">
                  Useful Reports
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Generate insights for better planning and decision making.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">Technology Stack</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Built using the <span className="text-white font-medium">MERN Stack</span> —
                MongoDB, Express.js, React, and Node.js — to provide a fast,
                scalable, and modern web application experience.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            A smarter way to manage inventory, orders, and team operations.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;