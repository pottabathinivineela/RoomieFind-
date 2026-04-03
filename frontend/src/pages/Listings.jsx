import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ListingCard from "../components/ListingCard";

const PROPERTY_TYPES = ["", "flat", "room", "pg", "house"];
const AMENITIES = ["wifi", "ac", "parking", "gym", "meals", "power_backup"];

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    location: searchParams.get("location") || "",
    type: "", minRent: "", maxRent: "", amenity: ""
  });

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await axios.get("/api/listings", { params });
      setListings(data.listings || []);
    } catch { setListings([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchListings(); }, []);

  const setF = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  const applyFilters = (e) => { e.preventDefault(); fetchListings(); };
  const clearFilters = () => { setFilters({ q: "", location: "", type: "", minRent: "", maxRent: "", amenity: "" }); };

  return (
    <div className="page">
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>Browse Listings</h1>
        <p style={{ color: "#64748b", marginTop: 4 }}>{listings.length} properties available</p>
      </div>

      <form className="filter-bar" onSubmit={applyFilters}>
        <div className="form-group">
          <label>Search</label>
          <input className="form-input" value={filters.q} onChange={(e) => setF("q", e.target.value)} placeholder="Keyword..." />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input className="form-input" value={filters.location} onChange={(e) => setF("location", e.target.value)} placeholder="Banjara Hills..." />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select className="form-select" value={filters.type} onChange={(e) => setF("type", e.target.value)}>
            <option value="">All types</option>
            {PROPERTY_TYPES.filter(Boolean).map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Min Rent (₹)</label>
          <input className="form-input" type="number" value={filters.minRent} onChange={(e) => setF("minRent", e.target.value)} placeholder="5000" />
        </div>
        <div className="form-group">
          <label>Max Rent (₹)</label>
          <input className="form-input" type="number" value={filters.maxRent} onChange={(e) => setF("maxRent", e.target.value)} placeholder="50000" />
        </div>
        <div className="form-group">
          <label>Amenity</label>
          <select className="form-select" value={filters.amenity} onChange={(e) => setF("amenity", e.target.value)}>
            <option value="">Any</option>
            {AMENITIES.map((a) => <option key={a} value={a}>{a.replace(/_/g, " ")}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
        <button type="button" className="btn btn-outline" onClick={clearFilters}>Clear</button>
      </form>

      {loading ? (
        <div className="loading">🔍 Searching listings...</div>
      ) : listings.length === 0 ? (
        <div className="empty"><div className="icon">🏠</div><p>No listings match your filters. Try adjusting your search.</p></div>
      ) : (
        <div className="listings-grid">
          {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}
