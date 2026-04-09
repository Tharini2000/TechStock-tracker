import api from "./api";

const reportEndpoints = {
  overview: "/reports/dashboard",
  customers: "/reports/customers",
  products: "/reports/products",
  categories: "/reports/categories",
  purchases: "/reports/purchases"
};

export const fetchReport = async (type) => {
  const endpoint = reportEndpoints[type];
  if (!endpoint) {
    throw new Error(`Unknown report type: ${type}`);
  }

  const { data } = await api.get(endpoint);
  return data;
};

export const fetchInventoryReport = async () => {
  return fetchReport("products");
};

export const fetchCustomerReport = async () => {
  return fetchReport("customers");
};

export const fetchProductReport = async () => {
  return fetchReport("products");
};

export const fetchCategoryReport = async () => {
  return fetchReport("categories");
};

export const fetchPurchaseReport = async () => {
  return fetchReport("purchases");
};

export const fetchDashboard = async () => {
  return fetchReport("overview");
};
