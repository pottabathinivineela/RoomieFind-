import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", bio: user?.bio || "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setSuccess(""); setError("");
    try { await axios.put("/api/users/profile", form); setSuccess("Profile updated successfully!"); }
    catch (err) { setError(err.response?.data?.error || "Update failed"); }
    finally { setSaving(false); }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <div className="profile-header">
        <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
        <div className="profile-info">
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,.2)", padding: "3px 12px", borderRadius: 20, fontSize: "0.82rem" }}>{user?.role === "owner" ? "🏠 Property Owner" : "🔍 Tenant"}</span>
            <span className={`badge ${user?.isVerified ? "badge-verified" : "badge-unverified"}`}>{user?.isVerified ? "✅ Verified" : "⏳ Unverified"}</span>
          </div>
        </div>
      </div>

      <div className="card"><div className="card-body">
        <h3 style={{ fontWeight: 600, marginBottom: "1.2rem" }}>Edit Profile</h3>
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={save}>
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" /></div>
          <div className="form-group"><label className="form-label">Email (read-only)</label><input className="form-input" value={user?.email} readOnly style={{ background: "#f8fafc" }} /></div>
          <div className="form-group"><label className="form-label">Bio</label><textarea className="form-textarea" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell others about yourself..." /></div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "💾 Save Changes"}</button>
        </form>
      </div></div>

      <div className="card" style={{ marginTop: "1.5rem" }}><div className="card-body">
        <h3 style={{ fontWeight: 600, marginBottom: "1.2rem" }}>Account Details</h3>
        <div className="detail-grid">
          <div className="detail-item"><div className="detail-label">Member Since</div><div className="detail-value">{new Date(user?.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</div></div>
          <div className="detail-item"><div className="detail-label">Account Type</div><div className="detail-value" style={{ textTransform: "capitalize" }}>{user?.role}</div></div>
          <div className="detail-item"><div className="detail-label">Verification</div><div className="detail-value">{user?.isVerified ? "✅ Verified" : "⏳ Pending"}</div></div>
        </div>
      </div></div>

      <div className="card" style={{ marginTop: "1.5rem", borderColor: "#fecaca" }}><div className="card-body">
        <h3 style={{ fontWeight: 600, marginBottom: 8, color: "#b91c1c" }}>Danger Zone</h3>
        <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1rem" }}>Sign out of your SmartHousing account.</p>
        <button className="btn btn-danger" onClick={handleLogout}>🚪 Sign Out</button>
      </div></div>
    </div>
  );
}
