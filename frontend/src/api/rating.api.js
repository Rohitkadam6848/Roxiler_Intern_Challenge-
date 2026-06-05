import API from "./axios";

export const submitRatingAPI = (data) => API.post("/ratings", data);

export const updateRatingAPI = (id, data) => API.put(`/ratings/${id}`, data);
