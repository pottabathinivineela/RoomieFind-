import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AMENITY_ICONS = { wifi: "📶", ac: "❄️", parking: "🅿️", gym: "💪", meals: "🍽️", laundry: "🧺", cctv: "📷", garden: "🌿", power_backup: "⚡", washing_machine: "🌀" };

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios.get(`/api/listings/${id}`).then((r) => setData(r.data)).catch(() => navigate("/listings")).finally(() => setLoading(false));
  }, [id]);

  const handleContact = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      await axios.post(`/api/matches/connect/${data.owner?.id}`);
      navigate("/chat");
    } catch { navigate("/chat"); }
  };

  const submitReview = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await axios.post("/api/reviews", { targetId: id, targetType: "listing", rating: Number(review.rating), comment: review.comment });
      const r = await axios.get(`/api/listings/${id}`);
      setData(r.data); setSuccess("Review submitted!"); setReview({ rating: 5, comment: "" });
    } catch { } finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading">Loading listing...</div>;
  if (!data) return null;

  const { listing, owner, reviews } = data;
  const avgRating = reviews?.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/listings" style={{ color: "#2563eb", fontSize: "0.9rem" }}>← Back to listings</Link>
      </div>

      {listing.photos?.length > 0 && (
        <div className="photo-grid">
          {listing.photos.slice(0, 2).map((p, i) => <img key={i} src={p} alt="" />)}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
            <span className={`type-badge badge-${listing.propertyType}`}>{listing.propertyType}</span>
            {avgRating && <span className="stars">{"★".repeat(Math.round(avgRating))} <span style={{ color: "#64748b", fontSize: "0.85rem" }}>({reviews.length} reviews)</span></span>}
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 6 }}>{listing.title}</h1>
          <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>📍 {listing.area}, {listing.city} – {listing.pincode}</p>

          <div className="detail-grid">
            <div className="detail-item"><div className="detail-label">Monthly Rent</div><div className="detail-value" style={{ color: "#2563eb", fontSize: "1.4rem" }}>₹{listing.rent?.toLocaleString()}</div></div>
            <div className="detail-item"><div className="detail-label">Security Deposit</div><div className="detail-value">₹{listing.deposit?.toLocaleString()}</div></div>
            <div className="detail-item"><div className="detail-label">Bedrooms</div><div className="detail-value">🛏 {listing.bedrooms}</div></div>
            <div className="detail-item"><div className="detail-label">Bathrooms</div><div className="detail-value">🛁 {listing.bathrooms}</div></div>
          </div>

          <hr className="divider" />
          <h3 style={{ fontWeight: 600, marginBottom: 10 }}>About this property</h3>
          <p style={{ color: "#374151", lineHeight: 1.8 }}>{listing.description}</p>

          {listing.amenities?.length > 0 && (
            <div className="features-section">
              <h3>Amenities</h3>
              <div className="tag-row">
                {listing.amenities.map((a) => <span key={a} className="tag">{AMENITY_ICONS[a] || "✓"} {a.replace(/_/g, " ")}</span>)}
              </div>
            </div>
          )}

          {user && (
            <div style={{ marginTop: "2rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.2rem" }}>
              <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Leave a Review</h3>
              {success && <div className="alert alert-success">{success}</div>}
              <form onSubmit={submitReview}>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <select className="form-select" value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })}>
                    {[5,4,3,2,1].map((n) => <option key={n} value={n}>{"★".repeat(n)} {n} star{n !== 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Comment</label>
                  <textarea className="form-textarea" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} placeholder="Share your experience..." />
                </div>
                <button className="btn btn-primary btn-sm" disabled={submitting}>{submitting ? "Submitting..." : "Submit Review"}</button>
              </form>
            </div>
          )}

          {reviews?.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Reviews ({reviews.length})</h3>
              {reviews.map((r) => (
                <div key={r.id} className="review-item">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{r.reviewer?.name || "User"}</div>
                    <div className="stars" style={{ fontSize: "0.85rem" }}>{"★".repeat(r.rating)}</div>
                  </div>
                  <p style={{ color: "#374151", fontSize: "0.9rem" }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: "sticky", top: 80 }}>
          <div className="card" style={{ overflow: "visible" }}>
            <div className="card-body">
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#2563eb", marginBottom: 4 }}>₹{listing.rent?.toLocaleString()}<span style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: 400 }}>/month</span></div>
              <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.2rem" }}>+ ₹{listing.deposit?.toLocaleString()} deposit</div>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: 10 }} onClick={handleContact}>
                💬 Contact Owner
              </button>
              {!user && <p style={{ fontSize: "0.8rem", color: "#64748b", textAlign: "center" }}>Please <Link to="/login" style={{ color: "#2563eb" }}>login</Link> to contact</p>}
              <hr className="divider" />
              <div style={{ fontSize: "0.85rem" }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Listed by</div>
                {owner && (
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div className="avatar" style={{ width: 40, height: 40, fontSize: "0.9rem" }}>{owner.name?.[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{owner.name}</div>
                      <div style={{ color: "#64748b", fontSize: "0.8rem" }}>{owner.isVerified ? "✅ Verified owner" : "Owner"}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
