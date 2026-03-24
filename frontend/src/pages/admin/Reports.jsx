import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  fetchInventoryReport,
  fetchPurchaseReport,
} from "../../services/reportService";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  BarChart3,
  Package,
  AlertTriangle,
  DollarSign,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  TrendingUp,
  FileBarChart,
} from "lucide-react";

const Reports = () => {
  const [inventoryReport, setInventoryReport] = useState(null);
  const [purchaseReport, setPurchaseReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const [inventory, purchase] = await Promise.all([
          fetchInventoryReport(),
          fetchPurchaseReport(),
        ]);
        setInventoryReport(inventory);
        setPurchaseReport(purchase);
      } catch (error) {
        setInventoryReport(null);
        setPurchaseReport(null);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading) return <LoadingSpinner label="Loading reports..." />;

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-[-100px] top-[-80px] h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <Sidebar />

        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg">
                  <FileBarChart size={26} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-400">
                    Analytics Center
                  </p>
                  <h1 className="mt-1 text-3xl font-bold text-white">
                    Reports Dashboard
                  </h1>
                  <p className="mt-2 text-sm text-slate-400">
                    Monitor inventory health, purchase activity, and business
                    performance from one place.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Insights</p>
                  <p className="text-sm font-semibold text-white">
                    Live Report Summary
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Report */}
          {inventoryReport && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400">
                  <Package size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Inventory Report
                  </h2>
                  <p className="text-sm text-slate-400">
                    Current inventory status and stock overview
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Total Products</p>
                      <p className="mt-2 text-3xl font-bold text-white">
                        {inventoryReport.summary.totalProducts}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400">
                      <Package size={22} />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Low Stock</p>
                      <p className="mt-2 text-3xl font-bold text-white">
                        {inventoryReport.summary.lowStockProducts}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                      <AlertTriangle size={22} />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-lg sm:col-span-2 xl:col-span-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Stock Value</p>
                      <p className="mt-2 text-3xl font-bold text-white">
                        ${inventoryReport.summary.inventoryValue.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                      <DollarSign size={22} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Report */}
          {purchaseReport && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Purchase History Report
                  </h2>
                  <p className="text-sm text-slate-400">
                    Order flow, approval activity, and revenue summary
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Total Orders</p>
                      <p className="mt-2 text-3xl font-bold text-white">
                        {purchaseReport.summary.totalOrders}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400">
                      <ShoppingBag size={22} />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Pending</p>
                      <p className="mt-2 text-3xl font-bold text-white">
                        {purchaseReport.summary.pending}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                      <Clock3 size={22} />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Approved</p>
                      <p className="mt-2 text-3xl font-bold text-white">
                        {purchaseReport.summary.approved}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 size={22} />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Revenue</p>
                      <p className="mt-2 text-3xl font-bold text-white">
                        ${purchaseReport.summary.revenue.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                      <BarChart3 size={22} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!inventoryReport && !purchaseReport && (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
                <FileBarChart size={28} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                No reports available
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Report data could not be loaded at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Reports;