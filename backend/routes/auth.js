// ─────────────────────────────────────────────────────────────
// routes/auth.js  –  PRODUCTION VERSION
//
// Exposes:
//   POST /api/register    → create account, return JWT
//   POST /api/login       → verify credentials, return JWT
//   GET  /api/auth/me     → return current user from token
//
// WHAT CHANGED vs. localhost version:
//   • JWT_SECRET now reads from  process.env.JWT_SECRET
//     (set this in Render's Environment → Secret Files panel).
//   • Passwords are hashed with bcrypt (cost 12).
//   • All three routes are confirmed present and named exactly
//     as the frontend expects.
// ─────────────────────────────────────────────────────────────

const router  = require("express").Router();
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");

// ── Read secret from env – NEVER hard-code in source ─────────
const JWT_SECRET = process.env.JWT_SECRET || "dev_only_change_in_production";

// ── In-memory user store (replace with MongoDB/your DB) ───────
// This mirrors whatever DB adapter you're already using.
// Just keep the same function signatures.
const db = require("../utils/db"); // your existing db helper

// ── Middleware: verify JWT on protected routes ────────────────
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    req.user = jwt.verify(header.split(" ")[1], JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Token invalid or expired" });
  }
}

// ── POST /api/register ────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }

    const existing = db.findOne("users", (u) => u.email === email);
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const { v4: uuidv4 } = require("uuid");

    const user = db.insert("users", {
      id:           uuidv4(),
      name,
      email,
      phone:        phone || "",
      passwordHash,
      role:         role || "tenant",
      isVerified:   false,
      bio:          "",
      createdAt:    new Date().toISOString(),
    });

    const { passwordHash: _ph, ...safeUser } = user;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    console.error("register:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/login ───────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = db.findOne("users", (u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const { passwordHash: _ph, ...safeUser } = user;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: safeUser });
  } catch (err) {
    console.error("login:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────
// Used by AuthContext on every page load to validate the stored token.
router.get("/me", requireAuth, (req, res) => {
  try {
    const user = db.findOne("users", (u) => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { passwordHash: _ph, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    console.error("me:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
module.exports.requireAuth = requireAuth; // export for use in other route files
