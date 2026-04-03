const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db");
const { verifyToken } = require("../middleware/auth");
const { computeCompatibility } = require("../utils/matchEngine");

router.post("/profile", verifyToken, (req, res) => {
  const { budgetMin, budgetMax, preferredArea, genderPref, gender, smoking, sleepSchedule, cleanliness, workSchedule, bio } = req.body;
  const existing = db.findOne("roommateProfiles", (p) => p.userId === req.user.id);
  const data = { budgetMin: Number(budgetMin), budgetMax: Number(budgetMax), preferredArea, genderPref, gender, smoking, sleepSchedule, cleanliness: Number(cleanliness), workSchedule, bio: bio || "" };
  if (existing) {
    const updated = db.update("roommateProfiles", (p) => p.userId === req.user.id, data);
    return res.json(updated);
  }
  const profile = db.insert("roommateProfiles", { id: uuidv4(), userId: req.user.id, ...data, createdAt: new Date().toISOString() });
  res.status(201).json(profile);
});

router.get("/profile", verifyToken, (req, res) => {
  const profile = db.findOne("roommateProfiles", (p) => p.userId === req.user.id);
  res.json(profile || null);
});

router.get("/suggestions", verifyToken, (req, res) => {
  const myProfile = db.findOne("roommateProfiles", (p) => p.userId === req.user.id);
  if (!myProfile) return res.status(400).json({ error: "Create your roommate profile first" });
  const allProfiles = db.findMany("roommateProfiles", (p) => p.userId !== req.user.id);
  const suggestions = allProfiles
    .map((p) => {
      const user = db.findOne("users", (u) => u.id === p.userId);
      if (!user) return null;
      const { passwordHash: _, ...safeUser } = user;
      const score = computeCompatibility(myProfile, p);
      return { profile: p, user: safeUser, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
  res.json(suggestions);
});

router.post("/connect/:userId", verifyToken, (req, res) => {
  const { userId } = req.params;
  const roomId = [req.user.id, userId].sort().join("_");
  const existing = db.findOne("connections", (c) => c.roomId === roomId);
  if (existing) return res.json(existing);
  const conn = db.insert("connections", {
    id: uuidv4(), roomId,
    userA: req.user.id, userB: userId,
    status: "pending", createdAt: new Date().toISOString(),
  });
  res.status(201).json(conn);
});

router.get("/connections", verifyToken, (req, res) => {
  const conns = db.findMany("connections", (c) => c.userA === req.user.id || c.userB === req.user.id);
  const enriched = conns.map((c) => {
    const otherId = c.userA === req.user.id ? c.userB : c.userA;
    const other = db.findOne("users", (u) => u.id === otherId);
    const { passwordHash: _, ...safe } = other || {};
    return { ...c, otherUser: safe };
  });
  res.json(enriched);
});

module.exports = router;
