import api from "./api";

export const submitFeedback = async (payload) => {
  const { data } = await api.post("/feedback", payload);
  return data;
};

export const getFeedbacks = async () => {
  const { data } = await api.get("/feedback");
  return data;
};
