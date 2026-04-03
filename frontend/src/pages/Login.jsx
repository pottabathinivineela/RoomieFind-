import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try { await login(form.email, form.password); navigate("/listings"); }
    catch (err) { setError(err.response?.data?.error || "Login failed"); }
    finally { setLoading(false); }
  };

  const demo = async (email) => {
    setForm({ email, password: "password123" });
    setError(""); setLoading(true);
    try { await login(email, "password123"); navigate("/listings"); }
    catch { setError("Demo login failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome back 👋</h2>
        <p>Sign in to your SmartHousing account</p>

        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "12px 16px", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1d4ed8", marginBottom: 8 }}>🎯 Quick demo login:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <button className="btn btn-sm btn-outline" onClick={() => demo("arjun@example.com")}>Tenant (Arjun)</button>
            <button className="btn btn-sm btn-outline" onClick={() => demo("raj@example.com")}>Owner (Raj)</button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" value={form.password} onChange={handle} placeholder="••••••••" required />
          </div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "#64748b" }}>
          No account? <Link to="/register" style={{ color: "#2563eb", fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
