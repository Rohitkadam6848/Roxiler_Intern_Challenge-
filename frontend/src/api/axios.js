import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Make sure your backend runs on port 5000
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
