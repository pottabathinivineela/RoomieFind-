import { Link } from "react-router-dom";

const TYPE_BADGE = { flat: "badge-flat", room: "badge-room", pg: "badge-pg", house: "badge-house" };
const AMENITY_ICONS = { wifi: "📶", ac: "❄️", parking: "🅿️", gym: "💪", meals: "🍽️", laundry: "🧺", cctv: "📷", garden: "🌿", power_backup: "⚡", washing_machine: "🌀" };

export default function ListingCard({ listing }) {
  const img = listing.photos?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80";
  const typeClass = TYPE_BADGE[listing.propertyType] || "badge-flat";
  const shownAmenities = (listing.amenities || []).slice(0, 4);

  return (
    <Link to={`/listings/${listing.id}`}>
      <div className="card listing-card">
        <img src={img} alt={listing.title} loading="lazy" />
        <div className="card-body">
          <span className={`type-badge ${typeClass}`}>{listing.propertyType}</span>
          <div className="title">{listing.title}</div>
          <div className="location">📍 {listing.area}, {listing.city}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="price">₹{listing.rent?.toLocaleString()}<span>/mo</span></div>
            <div style={{ fontSize: "0.82rem", color: "#64748b" }}>🛏 {listing.bedrooms}  🛁 {listing.bathrooms}</div>
          </div>
          {shownAmenities.length > 0 && (
            <div className="amenity-tags">
              {shownAmenities.map((a) => <span key={a} className="amenity-tag">{AMENITY_ICONS[a] || "✓"} {a.replace(/_/g, " ")}</span>)}
              {listing.amenities.length > 4 && <span className="amenity-tag">+{listing.amenities.length - 4} more</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
