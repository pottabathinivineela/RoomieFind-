// ─────────────────────────────────────────────────────────────
// src/api.js  –  Central API helper  (PRODUCTION VERSION)
//
// HOW TO USE IN YOUR COMPONENTS:
//
//   import api from "../api";
//
//   // GET
//   const { data } = await api.get("/api/listings");
//
//   // POST
//   const { data } = await api.post("/api/listings", payload);
//
// WHAT THIS REPLACES:
//   Old:  axios.get("http://localhost:5000/api/listings")
//   Old:  fetch("/api/listings")          ← only worked via Vite proxy
//   New:  api.get("/api/listings")        ← always hits Render
//
// ─────────────────────────────────────────────────────────────

import axios from "axios";

export const API_BASE = "https://roomiefind.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ── Attach JWT to every outgoing request ─────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Global response error handler ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired – clear and send to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
