import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AMENITY_OPTIONS = ["wifi", "ac", "parking", "gym", "meals", "laundry", "cctv", "garden", "power_backup", "washing_machine"];
const SAMPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80",
];

export default function AddListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", propertyType: "flat", rent: "", deposit: "", bedrooms: 1, bathrooms: 1, area: "", city: "Hyderabad", pincode: "", amenities: [], photos: [], availableFrom: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user?.role !== "owner") return <div className="page"><div className="empty"><div className="icon">🚫</div><p>Only property owners can add listings.</p></div></div>;

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleAmenity = (a) => setF("amenities", form.amenities.includes(a) ? form.amenities.filter((x) => x !== a) : [...form.amenities, a]);
  const addSamplePhoto = () => { const unused = SAMPLE_PHOTOS.filter((p) => !form.photos.includes(p)); if (unused.length) setF("photos", [...form.photos, unused[0]]); };

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try { const { data } = await axios.post("/api/listings", form); navigate(`/listings/${data.id}`); }
    catch (err) { setError(err.response?.data?.error || "Failed to create listing"); }
    finally { setLoading(false); }
  };

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.5rem" }}>Add New Listing</h1>
      <p style={{ color: "#64748b", marginBottom: "2rem" }}>Fill in the details to list your property</p>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={submit}>
        <div className="card"><div className="card-body">
          <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Basic Information</h3>
          <div className="form-group"><label className="form-label">Title *</label><input className="form-input" value={form.title} onChange={(e) => setF("title", e.target.value)} placeholder="Spacious 2BHK near Metro..." required /></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={(e) => setF("description", e.target.value)} placeholder="Describe your property in detail..." rows={4} /></div>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Property Type *</label>
              <select className="form-select" value={form.propertyType} onChange={(e) => setF("propertyType", e.target.value)}>
                {["flat","room","pg","house"].map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Available From</label><input className="form-input" type="date" value={form.availableFrom} onChange={(e) => setF("availableFrom", e.target.value)} /></div>
          </div>
        </div></div>

        <div className="card" style={{ marginTop: "1.5rem" }}><div className="card-body">
          <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Pricing & Details</h3>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Monthly Rent (₹) *</label><input className="form-input" type="number" value={form.rent} onChange={(e) => setF("rent", e.target.value)} placeholder="15000" required /></div>
            <div className="form-group"><label className="form-label">Security Deposit (₹)</label><input className="form-input" type="number" value={form.deposit} onChange={(e) => setF("deposit", e.target.value)} placeholder="45000" /></div>
            <div className="form-group"><label className="form-label">Bedrooms</label><input className="form-input" type="number" min={1} max={10} value={form.bedrooms} onChange={(e) => setF("bedrooms", e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Bathrooms</label><input className="form-input" type="number" min={1} max={10} value={form.bathrooms} onChange={(e) => setF("bathrooms", e.target.value)} /></div>
          </div>
        </div></div>

        <div className="card" style={{ marginTop: "1.5rem" }}><div className="card-body">
          <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Location</h3>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Area / Locality *</label><input className="form-input" value={form.area} onChange={(e) => setF("area", e.target.value)} placeholder="Banjara Hills" required /></div>
            <div className="form-group"><label className="form-label">City</label><input className="form-input" value={form.city} onChange={(e) => setF("city", e.target.value)} placeholder="Hyderabad" /></div>
            <div className="form-group"><label className="form-label">Pincode</label><input className="form-input" value={form.pincode} onChange={(e) => setF("pincode", e.target.value)} placeholder="500034" /></div>
          </div>
        </div></div>

        <div className="card" style={{ marginTop: "1.5rem" }}><div className="card-body">
          <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Amenities</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {AMENITY_OPTIONS.map((a) => (
              <label key={a} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: `2px solid ${form.amenities.includes(a) ? "#2563eb" : "#e2e8f0"}`, borderRadius: 8, cursor: "pointer", background: form.amenities.includes(a) ? "#eff6ff" : "#fff", fontSize: "0.85rem", fontWeight: 500, transition: "all .15s" }}>
                <input type="checkbox" style={{ display: "none" }} checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                {a.replace(/_/g, " ")}
              </label>
            ))}
          </div>
        </div></div>

        <div className="card" style={{ marginTop: "1.5rem" }}><div className="card-body">
          <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Photos</h3>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 10 }}>Add photo URLs or use sample photos for demo:</p>
          <button type="button" className="btn btn-outline btn-sm" onClick={addSamplePhoto} style={{ marginBottom: "1rem" }}>+ Add Sample Photo</button>
          {form.photos.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input className="form-input" value={p} onChange={(e) => { const ph = [...form.photos]; ph[i] = e.target.value; setF("photos", ph); }} placeholder="https://..." />
              <button type="button" className="btn btn-danger btn-sm" onClick={() => setF("photos", form.photos.filter((_, j) => j !== i))}>✕</button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setF("photos", [...form.photos, ""])}>+ Add URL</button>
        </div></div>

        <div style={{ marginTop: "1.5rem", display: "flex", gap: 12 }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>{loading ? "Publishing..." : "🏠 Publish Listing"}</button>
          <button type="button" className="btn btn-outline" onClick={() => navigate("/listings")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
