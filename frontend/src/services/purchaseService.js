import api from "./api";

export const createPurchaseRequest = async (payload) => {
  const { data } = await api.post("/purchases", payload);
  return data;
};

export const fetchPurchaseRequests = async () => {
  const { data } = await api.get("/purchases");
  return data;
};

export const updatePurchaseStatus = async (id, status) => {
  const { data } = await api.patch(`/purchases/${id}/status`, { status });
  return data;
};
