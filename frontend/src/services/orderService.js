import api from "./api";

export const placeOrder = async () => {
  const { data } = await api.post("/orders");
  return data;
};

export const fetchOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

export const updateOrder = async (id, payload) => {
  const { data } = await api.put(`/orders/${id}`, payload);
  return data;
};

export const deleteOrder = async (id) => {
  const { data } = await api.delete(`/orders/${id}`);
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.patch(`/orders/${id}/status`, { status });
  return data;
};
