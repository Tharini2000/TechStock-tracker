import api from "./api";

export const submitContactSupport = async (payload) => {
  const { data } = await api.post("/contact-support", payload);
  return data;
};

export const getContactSupportRequests = async () => {
  const { data } = await api.get("/contact-support");
  return data;
};

export const replyContactSupportRequest = async (id, replyMessage) => {
  const { data } = await api.patch(`/contact-support/${id}/reply`, { replyMessage });
  return data;
};

export const getMyContactSupportRequests = async () => {
  const { data } = await api.get("/contact-support/my");
  return data;
};
