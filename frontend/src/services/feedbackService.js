import api from "./api";

export const submitFeedback = async (payload) => {
  const { data } = await api.post("/feedback", payload);
  return data;
};
