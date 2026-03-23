import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { fetchInventoryReport, fetchPurchaseReport } from "../../services/reportService";

const Reports = () => {
  const [inventoryReport, setInventoryReport] = useState(null);
  const [purchaseReport, setPurchaseReport] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [inventory, purchase] = await Promise.all([fetchInventoryReport(), fetchPurchaseReport()]);
        setInventoryReport(inventory);
        setPurchaseReport(purchase);
      } catch (error) {
        setInventoryReport(null);
        setPurchaseReport(null);
      }
    };

    loadReports();
  }, []);

  return (
    <section className="flex flex-col gap-4 lg:flex-row">
      <Sidebar />
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Reports Dashboard</h1>

        {inventoryReport && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <h2 className="text-lg font-semibold">Inventory Report</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Total Products</p><p className="text-xl font-semibold">{inventoryReport.summary.totalProducts}</p></div>
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Low Stock</p><p className="text-xl font-semibold">{inventoryReport.summary.lowStockProducts}</p></div>
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Stock Value</p><p className="text-xl font-semibold">${inventoryReport.summary.inventoryValue.toFixed(2)}</p></div>
            </div>
          </div>
        )}

        {purchaseReport && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <h2 className="text-lg font-semibold">Purchase History Report</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Total</p><p className="text-xl font-semibold">{purchaseReport.summary.totalOrders}</p></div>
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Pending</p><p className="text-xl font-semibold">{purchaseReport.summary.pending}</p></div>
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Approved</p><p className="text-xl font-semibold">{purchaseReport.summary.approved}</p></div>
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Revenue</p><p className="text-xl font-semibold">${purchaseReport.summary.revenue.toFixed(2)}</p></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reports;
