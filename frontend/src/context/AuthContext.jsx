// ─────────────────────────────────────────────────────────────
// AuthContext.js  –  PRODUCTION VERSION
//
// WHAT CHANGED vs. localhost version:
//   • Single source-of-truth constant  API_BASE  holds the
//     deployed Render URL. Change only this one line if the
//     backend URL ever moves.
//   • Every axios / fetch call now uses  `${API_BASE}/api/...`
//     instead of  "/api/..."  so it works on Vercel (no proxy).
//   • Removed any reference to http://localhost:5000
// ─────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// ── 1. Single place to change if your backend URL ever moves ──
export const API_BASE = "https://roomiefind.onrender.com";

// Pre-configure axios so every call in the whole app automatically
// uses the production base URL and sends the stored JWT.
axios.defaults.baseURL = API_BASE;

// ── 2. Re-attach stored token on every page load ──────────────
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// ── 3. Context setup ──────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate stored token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${Token}`;

    // GET /api/auth/me  →  resolves to  API_BASE + /api/auth/me
    axios
      .get("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        // Token is invalid or expired – clean up
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── login ────────────────────────────────────────────────────
  const login = async (email, password) => {
    // POST /api/login  →  resolves to  API_BASE + /api/login
    const { data } = await axios.post("/api/login", { email, password });

    localStorage.setItem("token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data.user);
    return data.user;
  };

  // ── register ─────────────────────────────────────────────────
  const register = async (formData) => {
    // POST /api/register  →  resolves to  API_BASE + /api/register
    const { data } = await axios.post("/api/register", formData);

    localStorage.setItem("token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data.user);
    return data.user;
  };

  // ── logout ───────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, API_BASE }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
