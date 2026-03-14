// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  // baseURL: import.meta.env.VITE_BACKEND_URL,
  baseURL: "/api",
  withCredentials: true,
});

export default api;
