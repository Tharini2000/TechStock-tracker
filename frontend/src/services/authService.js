import api from "./api";

export const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return { token: data.token, user: { _id: data._id, name: data.name, email: data.email, role: data.role } };
};

export const login = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return { token: data.token, user: { _id: data._id, name: data.name, email: data.email, role: data.role } };
};

export const getProfile = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};
