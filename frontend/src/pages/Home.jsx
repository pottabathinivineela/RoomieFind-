import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const search = (e) => { e.preventDefault(); navigate(`/listings?q=${q}`); };

  return (
    <div>
      <section className="hero">
        <h1>Find Your Perfect<br />Home in Hyderabad</h1>
        <p>Browse verified rental listings, connect with property owners, and find compatible roommates — all in one place.</p>
        <form className="search-bar" onSubmit={search}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by area, city or keyword..." />
          <button type="submit">Search 🔍</button>
        </form>
      </section>

      <div className="stats">
        <div className="stat"><div className="stat-num">500+</div><div className="stat-label">Verified Listings</div></div>
        <div className="stat"><div className="stat-num">2,000+</div><div className="stat-label">Happy Tenants</div></div>
        <div className="stat"><div className="stat-num">98%</div><div className="stat-label">Match Accuracy</div></div>
        <div className="stat"><div className="stat-num">50+</div><div className="stat-label">Neighbourhoods</div></div>
      </div>

      <div className="container">
        <section className="section">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get started in three simple steps</p>
          </div>
          <div className="how-it-works">
            <div className="how-card"><div className="icon">🔍</div><h3>Search & Filter</h3><p>Browse thousands of listings filtered by budget, location, amenities and property type.</p></div>
            <div className="how-card"><div className="icon">🤝</div><h3>Match Roommates</h3><p>Our AI-powered algorithm finds the most compatible roommates based on your lifestyle and preferences.</p></div>
            <div className="how-card"><div className="icon">💬</div><h3>Connect & Chat</h3><p>Message owners and potential roommates directly through our secure real-time chat system.</p></div>
            <div className="how-card"><div className="icon">🏠</div><h3>Move In</h3><p>Schedule viewings, pay your deposit and move into your new home with full confidence.</p></div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-header">
            <h2>Popular Areas in Hyderabad</h2>
            <p>Find listings in the most sought-after locations</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {["Banjara Hills", "Jubilee Hills", "Hitech City", "Gachibowli", "Madhapur", "Kondapur", "Miyapur", "Kukatpally"].map((area) => (
              <button key={area} className="btn btn-outline" onClick={() => navigate(`/listings?location=${area}`)}>📍 {area}</button>
            ))}
          </div>
        </section>

        {!user && (
          <section style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)", borderRadius: 16, padding: "3rem 2rem", textAlign: "center", color: "#fff", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 12 }}>Ready to find your perfect home?</h2>
            <p style={{ opacity: .88, marginBottom: "1.5rem" }}>Join thousands of happy tenants and property owners today.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/register"><button className="btn" style={{ background: "#fff", color: "#2563eb", fontWeight: 700 }}>Get Started Free</button></Link>
              <Link to="/listings"><button className="btn" style={{ border: "2px solid rgba(255,255,255,.5)", color: "#fff", background: "transparent" }}>Browse Listings</button></Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
