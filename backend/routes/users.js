const router = require("express").Router();
const { verifyToken } = require("../middleware/auth");
const db = require("../utils/db");

router.get("/:id", (req, res) => {
  const user = db.findOne("users", (u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { passwordHash: _, ...safe } = user;
  res.json(safe);
});

router.put("/profile", verifyToken, (req, res) => {
  const { name, phone, bio, avatar } = req.body;
  const updated = db.update("users", (u) => u.id === req.user.id, { name, phone, bio, avatar });
  if (!updated) return res.status(404).json({ error: "User not found" });
  const { passwordHash: _, ...safe } = updated;
  res.json(safe);
});

module.exports = router;
