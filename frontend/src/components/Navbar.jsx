import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = (path) => pathname === path ? "nav-link active" : "nav-link";

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">🏠 <span>SmartHousing</span></Link>
        <div className="navbar-links">
          <Link to="/listings" className={active("/listings")}>Browse</Link>
          {user && <Link to="/roommate-match" className={active("/roommate-match")}>Match</Link>}
          {user && <Link to="/chat" className={active("/chat")}>Chat</Link>}
          {user?.role === "owner" && <Link to="/add-listing" className={active("/add-listing")}>+ List</Link>}
          {user ? (
            <>
              <Link to="/profile" className={active("/profile")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#2563eb", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700 }}>
                  {user.name?.[0]?.toUpperCase()}
                </span>
                {user.name?.split(" ")[0]}
              </Link>
              <button className="nav-btn outline" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="nav-btn outline">Login</button></Link>
              <Link to="/register"><button className="nav-btn primary">Sign Up</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
