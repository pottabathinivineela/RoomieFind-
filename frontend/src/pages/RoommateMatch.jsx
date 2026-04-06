import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";

const SCORE_CLASS = (s) => s >= 75 ? "score-high" : s >= 50 ? "score-med" : "score-low";
const SCORE_LABEL = (s) => s >= 75 ? "Great match" : s >= 50 ? "Good match" : "Low match";

export default function RoommateMatch() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sugLoading, setSugLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({ budgetMin: "", budgetMax: "", preferredArea: "", genderPref: "any", gender: "male", smoking: false, sleepSchedule: "flexible", cleanliness: 3, workSchedule: "9-5 office", bio: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

 useEffect(() => {
  const fetchProfile = async () => {
    try {
      const r = await api.get("/matches/profile");

      // ✅ IMPORTANT CHECK
      if (r.data && !r.data.error) {
        setProfile(r.data);
      } else {
        console.log("API ERROR:", r.data);
      }

    } catch (err) {
      console.error("ERROR:", err);
    } finally {
      setLoading(false);
    }
  };


  fetchProfile();
}, []);

  const fetchSuggestions = async () => {
    setSugLoading(true);
    try { const { data } = await api.get("/matches/suggestions"); setSuggestions(data); }
    catch { } finally { setSugLoading(false); }
  };

  const saveProfile = async (e) => {
    e.preventDefault(); setSaving(true); setSuccess("");
    try { const { data } = await api.post("/matches/profile", form); setProfile(data); setSuccess("Profile saved! Switch to Matches tab."); }
    catch { } finally { setSaving(false); }
  };

  const connect = async (userId) => {
    try { await api.post(`/matches/connect/${userId}`); navigate("/chat"); }
    catch { navigate("/chat"); }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) {
  return <div>No profile data available</div>;
}

  return (
    <div className="page">
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>🤝 Roommate Matching</h1>
        <p style={{ color: "#64748b", marginTop: 4 }}>Find your most compatible roommates based on lifestyle and preferences</p>
      </div>

      <div className="tabs">
        <button className={`tab${activeTab === "profile" ? " active" : ""}`} onClick={() => setActiveTab("profile")}>My Profile</button>
        <button className={`tab${activeTab === "matches" ? " active" : ""}`} onClick={() => { setActiveTab("matches"); fetchSuggestions(); }}>Find Matches</button>
      </div>

      {activeTab === "profile" && (
        <div style={{ maxWidth: 600 }}>
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={saveProfile}>
            <div className="card"><div className="card-body">
              <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Basic Preferences</h3>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Budget Min (₹/mo)</label><input className="form-input" type="number" value={form.budgetMin} onChange={(e) => setForm({ ...form, budgetMin: e.target.value })} placeholder="6000" /></div>
                <div className="form-group"><label className="form-label">Budget Max (₹/mo)</label><input className="form-input" type="number" value={form.budgetMax} onChange={(e) => setForm({ ...form, budgetMax: e.target.value })} placeholder="12000" /></div>
              </div>
              <div className="form-group"><label className="form-label">Preferred Area</label><input className="form-input" value={form.preferredArea} onChange={(e) => setForm({ ...form, preferredArea: e.target.value })} placeholder="Hitech City, Gachibowli..." /></div>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Your Gender</label>
                  <select className="form-select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Roommate Gender Pref</label>
                  <select className="form-select" value={form.genderPref} onChange={(e) => setForm({ ...form, genderPref: e.target.value })}>
                    <option value="any">Any</option><option value="male">Male</option><option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div></div>

            <div className="card" style={{ marginTop: "1.5rem" }}><div className="card-body">
              <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Lifestyle Habits</h3>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Sleep Schedule</label>
                  <select className="form-select" value={form.sleepSchedule} onChange={(e) => setForm({ ...form, sleepSchedule: e.target.value })}>
                    <option value="early">Early Bird (sleep by 10pm)</option><option value="flexible">Flexible</option><option value="night_owl">Night Owl (sleep after midnight)</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Work Schedule</label>
                  <select className="form-select" value={form.workSchedule} onChange={(e) => setForm({ ...form, workSchedule: e.target.value })}>
                    {["9-5 office", "remote", "student", "freelancer", "night shift"].map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Cleanliness Level: {["", "Messy", "Average", "Tidy", "Very Clean", "Spotless"][form.cleanliness]}</label>
                <input type="range" min={1} max={5} value={form.cleanliness} onChange={(e) => setForm({ ...form, cleanliness: Number(e.target.value) })} style={{ width: "100%", accentColor: "#2563eb" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b" }}><span>Messy</span><span>Spotless</span></div>
              </div>
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.smoking} onChange={(e) => setForm({ ...form, smoking: e.target.checked })} style={{ width: 18, height: 18, accentColor: "#2563eb" }} />
                  <span className="form-label" style={{ marginBottom: 0 }}>I smoke</span>
                </label>
              </div>
              <div className="form-group"><label className="form-label">About Me (optional)</label><textarea className="form-textarea" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell potential roommates about yourself..." rows={3} /></div>
            </div></div>

            <div style={{ marginTop: "1.5rem" }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>{saving ? "Saving..." : "💾 Save Profile"}</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "matches" && (
        <div>
          {!profile && <div className="alert" style={{ background: "#fefce8", border: "1px solid #fde68a", color: "#a16207" }}>⚠️ Please fill in your roommate profile first to see matches.</div>}
          {sugLoading && <div className="loading">Finding your best matches...</div>}
          {!sugLoading && suggestions.length === 0 && profile && <div className="empty"><div className="icon">🔍</div><p>No matches found yet. More users are joining daily!</p></div>}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 700 }}>
            {suggestions.map(({ profile: p, user, score }) => (
              <div key={p.id} className="match-card">
                <div className="avatar">{user.name?.[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ fontWeight: 700 }}>{user.name} {user.isVerified && "✅"}</div>
                    <span className={`score-ring ${SCORE_CLASS(score)}`}>🎯 {score}% – {SCORE_LABEL(score)}</span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: 8 }}>{p.preferredArea} · ₹{p.budgetMin?.toLocaleString()}–{p.budgetMax?.toLocaleString()}/mo</div>
                  <div className="tag-row" style={{ marginTop: 0, marginBottom: 8 }}>
                    <span className="tag">🌙 {p.sleepSchedule?.replace("_", " ")}</span>
                    <span className="tag">💼 {p.workSchedule}</span>
                    <span className="tag">✨ {["","Messy","Average","Tidy","Very Clean","Spotless"][p.cleanliness]}</span>
                    <span className="tag">{p.smoking ? "🚬 Smoker" : "🚭 Non-smoker"}</span>
                  </div>
                  {p.bio && <p style={{ fontSize: "0.85rem", color: "#374151", marginBottom: 10 }}>{p.bio}</p>}
                  <button className="btn btn-primary btn-sm" onClick={() => connect(user.id)}>💬 Connect</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
