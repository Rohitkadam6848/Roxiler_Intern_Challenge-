import API from "./axios";

export const getStoresAPI = () => API.get("/user/stores");
export const searchStoresAPI = (keyword) =>
  API.get(`/user/stores/search?keyword=${keyword}`);

// Changed from "/ratings" to "/rating" to match your backend!
// Fix these two to match the exact same prefix!
export const submitRatingAPI = (data) => API.post("/user/rating", data);
export const updateRatingAPI = (data) => API.put("/user/rating", data);
