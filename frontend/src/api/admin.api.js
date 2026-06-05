import API from "./axios";

// Dashboard overview
export const getAdminDashboardAPI = () => API.get("/admin/dashboard");

// User Management
export const getAllUsersAPI = () => API.get("/admin/users");
export const addUserAPI = (data) => API.post("/admin/add-user", data);

// Store Management
export const getAllStoresAPI = () => API.get("/admin/stores");
export const addStoreAPI = (data) => API.post("/admin/stores", data);
