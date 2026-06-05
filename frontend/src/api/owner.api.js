import API from "./axios";

// View all combined data
// Changed from /owner to /store to match your server.js!
export const getAverageRatingAPI = () => API.get("/store/average-rating");
export const getStoreRatingsAPI = () => API.get("/store/ratings");

// Store Management
export const addStoreAPI = (data) => API.post("/store/add-store", data);
export const deleteStoreAPI = (id) => API.delete(`/store/store/${id}`);

// Specific Store Analytics
export const getSingleStoreAverageAPI = (id) =>
  API.get(`/store/store/${id}/average-rating`);
export const getSingleStoreRatingsAPI = (id) =>
  API.get(`/store/store/${id}/ratings`);
