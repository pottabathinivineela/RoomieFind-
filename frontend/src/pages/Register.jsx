import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "tenant" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try { await register(form); navigate("/listings"); }
    catch (err) { setError(err.response?.data?.error || "Registration failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Join SmartHousing 🏠</h2>
        <p>Create your free account and find your perfect home</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" name="name" value={form.name} onChange={handle} placeholder="Arjun Mehta" required />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" name="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" name="phone" value={form.phone} onChange={handle} placeholder="9876543210" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" value={form.password} onChange={handle} placeholder="Min 8 characters" required minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <div style={{ display: "flex", gap: 10 }}>
              {["tenant", "owner"].map((r) => (
                <label key={r} style={{ flex: 1, border: `2px solid ${form.role === r ? "#2563eb" : "#e2e8f0"}`, borderRadius: 10, padding: "12px", textAlign: "center", cursor: "pointer", background: form.role === r ? "#eff6ff" : "#fff", transition: "all .15s" }}>
                  <input type="radio" name="role" value={r} checked={form.role === r} onChange={handle} style={{ display: "none" }} />
                  <div style={{ fontSize: "1.5rem" }}>{r === "tenant" ? "🔍" : "🏠"}</div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", marginTop: 4, textTransform: "capitalize", color: form.role === r ? "#1d4ed8" : "#374151" }}>{r}</div>
                </label>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "#64748b" }}>
          Already have an account? <Link to="/login" style={{ color: "#2563eb", fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
