import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useToast } from "../../context/ToastContext";
import {
  fetchCategoryReport,
  fetchCustomerReport,
  fetchPurchaseReport,
  fetchProductReport
} from "../../services/reportService";
import { downloadReportPdf } from "../../utils/reportPdf";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  DollarSign,
  Download,
  FileBarChart,
  FolderTree,
  Package,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Users,
  Boxes,
  ClipboardList
} from "lucide-react";

const REPORT_TYPES = {
  customers: {
    label: "Customer Report",
    description: "View the registered customer list with order history and spend summary.",
    sectionTitle: "Customer List",
    pdfTitle: "Customer Report",
    icon: Users,
    accent: "brand"
  },
  products: {
    label: "Product Report",
    description: "Review product availability, stock levels, and inventory value.",
    sectionTitle: "Product Inventory",
    pdfTitle: "Product Inventory Report",
    icon: Package,
    accent: "cyan"
  },
  categories: {
    label: "Category Report",
    description: "Inspect category stock distribution and inventory value by group.",
    sectionTitle: "Category Report",
    pdfTitle: "Category Report",
    icon: FolderTree,
    accent: "emerald"
  },
  purchases: {
    label: "Purchase Report",
    description: "Review order activity, statuses, and revenue from purchases.",
    sectionTitle: "Purchase History",
    pdfTitle: "Purchase Report",
    icon: ShoppingBag,
    accent: "amber"
  }
};

const REPORT_LOADERS = {
  customers: fetchCustomerReport,
  products: fetchProductReport,
  categories: fetchCategoryReport,
  purchases: fetchPurchaseReport
};

const FILE_NAME_PREFIX = {
  customers: "customer-report",
  products: "product-report",
  categories: "category-report",
  purchases: "purchase-report"
};

const TONE_CLASSES = {
  brand: {
    icon: "bg-brand-500/20 text-brand-400",
    chip: "border-brand-500/20 bg-brand-500/15 text-brand-300"
  },
  cyan: {
    icon: "bg-cyan-500/20 text-cyan-400",
    chip: "border-cyan-500/20 bg-cyan-500/15 text-cyan-300"
  },
  emerald: {
    icon: "bg-emerald-500/20 text-emerald-400",
    chip: "border-emerald-500/20 bg-emerald-500/15 text-emerald-300"
  },
  amber: {
    icon: "bg-amber-500/20 text-amber-400",
    chip: "border-amber-500/20 bg-amber-500/15 text-amber-300"
  },
  rose: {
    icon: "bg-rose-500/20 text-rose-400",
    chip: "border-rose-500/20 bg-rose-500/15 text-rose-300"
  },
  indigo: {
    icon: "bg-indigo-500/20 text-indigo-400",
    chip: "border-indigo-500/20 bg-indigo-500/15 text-indigo-300"
  },
  slate: {
    icon: "bg-slate-500/20 text-slate-300",
    chip: "border-white/10 bg-white/5 text-slate-300"
  }
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0
});

const safeNumber = (value) => Number(value || 0);

const formatCount = (value) => numberFormatter.format(safeNumber(value));

const formatCurrency = (value) => currencyFormatter.format(safeNumber(value));

const formatDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

const formatDateTime = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
};

const getTone = (tone) => TONE_CLASSES[tone] || TONE_CLASSES.slate;

const getStockTone = (status) => {
  const value = String(status || "").toLowerCase();

  if (value.includes("out of stock")) return "rose";
  if (value.includes("low stock")) return "amber";
  if (value.includes("available")) return "emerald";

  return "slate";
};

const getOrderTone = (status) => {
  const value = String(status || "").toLowerCase();

  if (value === "pending") return "amber";
  if (value === "approved" || value === "completed") return "emerald";
  if (value === "rejected") return "rose";

  return "slate";
};

const DetailChip = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
};

const SummaryCard = ({ card }) => {
  const Icon = card.icon;
  const tone = getTone(card.tone);

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{card.label}</p>
          <p className="mt-3 text-3xl font-bold text-white">{card.value}</p>
          {card.hint ? (
            <p className="mt-2 text-xs leading-5 text-slate-500">{card.hint}</p>
          ) : null}
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone.icon}`}
        >
          <Icon size={22} />
        </div>
      </div>
    </article>
  );
};

const ReportItemCard = ({ item }) => {
  const tone = getTone(item.badgeTone);

  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl transition hover:border-white/20 hover:bg-slate-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="text-lg font-semibold text-white">{item.title}</p>
          {item.subtitle ? (
            <p className="mt-1 truncate text-sm text-slate-400">{item.subtitle}</p>
          ) : null}
        </div>

        {item.badge ? (
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tone.chip}`}
          >
            {item.badge}
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {item.details.map((detail) => (
          <DetailChip key={`${item.title}-${detail.label}`} label={detail.label} value={detail.value} />
        ))}
      </div>
    </article>
  );
};

const buildReportView = (type, data) => {
  if (!data) {
    return {
      sectionTitle: REPORT_TYPES[type]?.sectionTitle || "Report Details",
      emptyMessage: "No report data has been loaded yet.",
      summaryCards: [],
      items: []
    };
  }

  switch (type) {
    case "customers": {
      const summary = data.summary || {};
      const items = (data.items || []).map((customer) => ({
        title: customer.name || "Unknown Customer",
        subtitle: customer.email || "No email provided",
        badge:
          safeNumber(customer.totalOrders) > 0
            ? `${formatCount(customer.totalOrders)} Orders`
            : "No Orders",
        badgeTone: safeNumber(customer.totalOrders) > 0 ? "emerald" : "slate",
        details: [
          { label: "Customer ID", value: customer._id || "N/A" },
          { label: "Joined At", value: formatDate(customer.joinedAt) },
          { label: "Total Orders", value: formatCount(customer.totalOrders) },
          { label: "Total Spent", value: formatCurrency(customer.totalSpent) },
          { label: "Last Order", value: formatDate(customer.lastOrderDate) }
        ]
      }));

      return {
        sectionTitle: "Customer List",
        emptyMessage: "No customers were returned for this report.",
        summaryCards: [
          {
            label: "Total Customers",
            value: formatCount(summary.totalCustomers),
            icon: Users,
            tone: "brand",
            hint: "All registered customer accounts"
          },
          {
            label: "Active Customers",
            value: formatCount(summary.activeCustomers),
            icon: CheckCircle2,
            tone: "emerald",
            hint: "Customers with at least one order"
          },
          {
            label: "New This Month",
            value: formatCount(summary.newThisMonth),
            icon: CalendarDays,
            tone: "cyan",
            hint: "Customers created during the current month"
          },
          {
            label: "Total Orders",
            value: formatCount(summary.totalOrders),
            icon: ShoppingBag,
            tone: "amber",
            hint: "All customer orders combined"
          },
          {
            label: "Total Spent",
            value: formatCurrency(summary.totalSpent),
            icon: DollarSign,
            tone: "indigo",
            hint: "Combined order value across all customers"
          }
        ],
        items
      };
    }

    case "products": {
      const summary = data.summary || {};
      const items = (data.items || []).map((product) => ({
        title: product.name || "Unnamed Product",
        subtitle: product.productId || "No product ID provided",
        badge: product.stockStatus || "Unknown",
        badgeTone: getStockTone(product.stockStatus),
        details: [
          { label: "Category", value: product.categoryName || "Uncategorized" },
          { label: "Quantity", value: formatCount(product.quantity) },
          { label: "Unit Price", value: formatCurrency(product.price) },
          {
            label: "Inventory Value",
            value: formatCurrency(safeNumber(product.quantity) * safeNumber(product.price))
          },
          { label: "Added On", value: formatDate(product.createdAt) }
        ]
      }));

      return {
        sectionTitle: "Product Inventory",
        emptyMessage: "No products were returned for this report.",
        summaryCards: [
          {
            label: "Total Products",
            value: formatCount(summary.totalProducts),
            icon: Package,
            tone: "brand",
            hint: "Products currently stored in the system"
          },
          {
            label: "Available",
            value: formatCount(summary.availableProducts),
            icon: CheckCircle2,
            tone: "emerald",
            hint: "Products ready to sell"
          },
          {
            label: "Low Stock",
            value: formatCount(summary.lowStockProducts),
            icon: AlertTriangle,
            tone: "amber",
            hint: "Products close to the minimum level"
          },
          {
            label: "Out of Stock",
            value: formatCount(summary.outOfStockProducts),
            icon: Boxes,
            tone: "rose",
            hint: "Products that need replenishment"
          },
          {
            label: "Inventory Value",
            value: formatCurrency(summary.inventoryValue),
            icon: DollarSign,
            tone: "indigo",
            hint: "Value of all product stock"
          }
        ],
        items
      };
    }

    case "categories": {
      const summary = data.summary || {};
      const items = (data.items || []).map((category) => ({
        title: category.categoryName || "Unnamed Category",
        subtitle: category.description || "No description provided",
        badge:
          category.productCount > 0
            ? `${formatCount(category.productCount)} products`
            : "Empty",
        badgeTone:
          category.productCount > 0
            ? category.productCount < 3
              ? "amber"
              : "emerald"
            : "rose",
        details: [
          { label: "Products", value: formatCount(category.productCount) },
          { label: "Available Stock", value: formatCount(category.availableStock) },
          { label: "Low Stock Items", value: formatCount(category.lowStockProducts) },
          { label: "Out of Stock Items", value: formatCount(category.outOfStockProducts) },
          { label: "Inventory Value", value: formatCurrency(category.inventoryValue) }
        ]
      }));

      return {
        sectionTitle: "Category Report",
        emptyMessage: "No categories were returned for this report.",
        summaryCards: [
          {
            label: "Total Categories",
            value: formatCount(summary.totalCategories),
            icon: FolderTree,
            tone: "brand",
            hint: "Category groups stored in the system"
          },
          {
            label: "With Products",
            value: formatCount(summary.categoriesWithProducts),
            icon: CheckCircle2,
            tone: "emerald",
            hint: "Categories that already have products"
          },
          {
            label: "Empty Categories",
            value: formatCount(summary.emptyCategories),
            icon: AlertTriangle,
            tone: "amber",
            hint: "Categories that still need products"
          },
          {
            label: "Total Products",
            value: formatCount(summary.totalProducts),
            icon: Package,
            tone: "cyan",
            hint: "Products mapped into categories"
          },
          {
            label: "Inventory Value",
            value: formatCurrency(summary.totalInventoryValue),
            icon: DollarSign,
            tone: "indigo",
            hint: "Total value across all categories"
          }
        ],
        items
      };
    }

    case "purchases": {
      const summary = data.summary || {};
      const items = (data.items || []).map((order) => {
        const orderItems = Array.isArray(order.products) ? order.products : [];
        const totalUnits = orderItems.reduce(
          (sum, line) => sum + safeNumber(line.quantity),
          0
        );
        const productNames = orderItems
          .map((line) => line.product?.name || "Product")
          .filter(Boolean);
        const productPreview = productNames.length
          ? productNames.slice(0, 3).join(", ") + (productNames.length > 3 ? " ..." : "")
          : "No products listed";

        return {
          title: order.userId?.name || "Unknown Customer",
          subtitle: order._id ? `Order ID: ${order._id}` : "No order ID available",
          badge: String(order.status || "pending").toUpperCase(),
          badgeTone: getOrderTone(order.status),
          details: [
            { label: "Customer Email", value: order.userId?.email || "Not available" },
            { label: "Order Date", value: formatDate(order.orderDate || order.createdAt) },
            { label: "Units", value: formatCount(totalUnits) },
            { label: "Products", value: productPreview },
            { label: "Total", value: formatCurrency(order.totalPrice) }
          ]
        };
      });

      return {
        sectionTitle: "Purchase History",
        emptyMessage: "No purchases were returned for this report.",
        summaryCards: [
          {
            label: "Total Orders",
            value: formatCount(summary.totalOrders),
            icon: ShoppingBag,
            tone: "brand",
            hint: "All orders recorded in the system"
          },
          {
            label: "Pending",
            value: formatCount(summary.pending),
            icon: Clock3,
            tone: "amber",
            hint: "Orders waiting for review"
          },
          {
            label: "Approved",
            value: formatCount(summary.approved),
            icon: CheckCircle2,
            tone: "emerald",
            hint: "Orders approved for processing"
          },
          {
            label: "Completed",
            value: formatCount(summary.completed),
            icon: ClipboardList,
            tone: "cyan",
            hint: "Orders already completed"
          },
          {
            label: "Revenue",
            value: formatCurrency(summary.revenue),
            icon: DollarSign,
            tone: "indigo",
            hint: "Approved and completed order value"
          }
        ],
        items
      };
    }

    default:
      return {
        sectionTitle: "Report Details",
        emptyMessage: "No report data is available.",
        summaryCards: [],
        items: []
      };
  }
};

const buildPdfContent = (type, view, generatedAt) => {
  const definition = REPORT_TYPES[type] || REPORT_TYPES.customers;

  return {
    title: definition.pdfTitle,
    subtitle: definition.description,
    generatedAt: generatedAt || new Date(),
    summary: view.summaryCards.map((card) => ({
      label: card.label,
      value: card.value
    })),
    sections: [
      {
        title: view.sectionTitle,
        items: view.items.map((item) => ({
          title: item.title,
          details: [
            item.subtitle,
            ...(item.details || []).map((detail) => `${detail.label}: ${detail.value}`)
          ].filter(Boolean)
        }))
      }
    ]
  };
};

const Reports = () => {
  const toast = useToast();
  const showToast = toast?.showToast;
  const [selectedType, setSelectedType] = useState("customers");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const requestIdRef = useRef(0);

  const selectedDefinition = REPORT_TYPES[selectedType] || REPORT_TYPES.customers;
  const reportView = useMemo(
    () => buildReportView(selectedType, reportData),
    [selectedType, reportData]
  );
  const pdfContent = useMemo(
    () => buildPdfContent(selectedType, reportView, lastUpdated),
    [selectedType, reportView, lastUpdated]
  );

  useEffect(() => {
    let active = true;
    const requestId = ++requestIdRef.current;

    const loadReport = async () => {
      setLoading(true);
      setError("");
      setReportData(null);

      try {
        const loader = REPORT_LOADERS[selectedType];
        const data = await loader();

        if (!active || requestId !== requestIdRef.current) return;

        setReportData(data);
        setLastUpdated(new Date());
      } catch (err) {
        if (!active || requestId !== requestIdRef.current) return;

        const message =
          err?.response?.data?.message || err?.message || "Unable to load the selected report.";
        setError(message);
        showToast?.(message, "error");
      } finally {
        if (active && requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    loadReport();

    return () => {
      active = false;
    };
  }, [selectedType, refreshTick, showToast]);

  const handleRefresh = () => {
    setRefreshTick((value) => value + 1);
  };

  const handleDownload = () => {
    if (!reportData) return;

    try {
      const filePrefix = FILE_NAME_PREFIX[selectedType] || "report";
      const fileName = `${filePrefix}-${new Date().toISOString().slice(0, 10)}.pdf`;
      downloadReportPdf(pdfContent, fileName);
      showToast?.(`${selectedDefinition.label} downloaded as PDF.`, "success");
    } catch (downloadError) {
      showToast?.("Unable to generate the PDF report.", "error");
    }
  };

  const hasData = Boolean(reportData);
  const isInitialLoad = loading && !hasData && !error;

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <div className="absolute left-[-100px] top-[-80px] h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <Sidebar />

        <div className="flex-1 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${getTone(
                    selectedDefinition.accent
                  ).icon}`}
                >
                  <selectedDefinition.icon size={26} />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-400">
                    Admin Reports
                  </p>
                  <h1 className="mt-1 text-3xl font-bold text-white">
                    {selectedDefinition.label}
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                    {selectedDefinition.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getTone(
                    selectedDefinition.accent
                  ).chip}`}
                >
                  {selectedDefinition.label}
                </span>
                <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs font-semibold text-slate-300">
                  {loading ? "Refreshing data..." : `${formatCount(reportView.items.length)} records`}
                </span>
                <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs font-semibold text-slate-300">
                  Updated {formatDateTime(lastUpdated)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <label
                  htmlFor="reportType"
                  className="mb-2 block text-sm font-semibold text-white"
                >
                  Choose Report
                </label>
                <div className="relative">
                  <select
                    id="reportType"
                    value={selectedType}
                    onChange={(event) => setSelectedType(event.target.value)}
                    className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/20"
                  >
                    {Object.entries(REPORT_TYPES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
                
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-white transition hover:border-brand-500/30 hover:bg-brand-500/10"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  Refresh Report
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!hasData || loading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download size={16} />
                  Download PDF
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-300">
                  <AlertTriangle size={22} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white">
                    Report load failed
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-rose-100/90">{error}</p>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleRefresh}
                      className="inline-flex items-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/25"
                    >
                      <RefreshCw size={16} />
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {isInitialLoad ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
              <div className="flex min-h-[320px] items-center justify-center">
                <LoadingSpinner label={`Loading ${selectedDefinition.label.toLowerCase()}...`} />
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {reportView.summaryCards.map((card) => (
                  <SummaryCard key={card.label} card={card} />
                ))}
              </div>

              <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400">
                        <FileBarChart size={22} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {reportView.sectionTitle}
                        </h2>
                        <p className="text-sm text-slate-400">
                          {selectedDefinition.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-300">
                    <TrendingUp size={14} className="text-brand-400" />
                    {formatCount(reportView.items.length)} records shown
                  </div>
                </div>

                {reportView.items.length > 0 ? (
                  <div className="space-y-4">
                    {reportView.items.map((item) => (
                      <ReportItemCard key={item.title + item.subtitle} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/50 p-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
                      <selectedDefinition.icon size={28} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">
                      No records available
                    </h3>
                    <p className="mt-2 text-sm text-slate-400">
                      {reportView.emptyMessage}
                    </p>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Reports;
