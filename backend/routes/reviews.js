const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db");
const { verifyToken } = require("../middleware/auth");

router.post("/", verifyToken, (req, res) => {
  const { targetId, targetType, rating, comment } = req.body;
  if (!targetId || !rating) return res.status(400).json({ error: "targetId and rating required" });
  const review = db.insert("reviews", {
    id: uuidv4(), reviewerId: req.user.id, targetId,
    targetType: targetType || "listing", rating: Number(rating),
    comment: comment || "", createdAt: new Date().toISOString(),
  });
  res.status(201).json(review);
});

router.get("/:targetId", (req, res) => {
  const reviews = db.findMany("reviews", (r) => r.targetId === req.params.targetId);
  const enriched = reviews.map((r) => {
    const reviewer = db.findOne("users", (u) => u.id === r.reviewerId);
    const { passwordHash: _, ...safe } = reviewer || {};
    return { ...r, reviewer: safe };
  });
  res.json(enriched);
});

module.exports = router;
