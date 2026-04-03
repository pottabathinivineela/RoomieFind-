const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db");
const { verifyToken, JWT_SECRET } = require("../middleware/auth");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Name, email and password required" });
    if (db.findOne("users", (u) => u.email === email))
      return res.status(409).json({ error: "Email already registered" });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = db.insert("users", {
      id: uuidv4(), name, email, phone: phone || "", passwordHash,
      role: role || "tenant", isVerified: false, avatar: "",
      bio: "", createdAt: new Date().toISOString(),
    });
    const { passwordHash: _, ...safe } = user;
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: safe });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.findOne("users", (u) => u.email === email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const { passwordHash: _, ...safe } = user;
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: safe });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get("/me", verifyToken, (req, res) => {
  const user = db.findOne("users", (u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { passwordHash: _, ...safe } = user;
  res.json(safe);
});

module.exports = router;
