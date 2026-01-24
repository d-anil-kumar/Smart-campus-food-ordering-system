import axios from "axios";

// ✅ Public API (no token)
export const PUBLIC_API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// ✅ Private API (token attached)
export const PRIVATE_API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

PRIVATE_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
