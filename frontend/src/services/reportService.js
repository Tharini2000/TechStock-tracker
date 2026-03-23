import api from "./api";

export const fetchInventoryReport = async () => {
  const { data } = await api.get("/reports/inventory");
  return data;
};

export const fetchPurchaseReport = async () => {
  const { data } = await api.get("/reports/purchases");
  return data;
};

export const fetchDashboard = async () => {
  const { data } = await api.get("/reports/dashboard");
  return data;
};
