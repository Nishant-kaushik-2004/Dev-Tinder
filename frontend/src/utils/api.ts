// src/api/axios.ts
import axios from "axios";

const isProduction = import.meta.env.PROD;

const api = axios.create({
  baseURL: isProduction ? "/api" : import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export default api;

// Local → direct backend (localhost)
// Production → /api (Vercel rewrite)
