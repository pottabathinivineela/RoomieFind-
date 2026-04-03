const router = require("express").Router();
const db = require("../utils/db");
const { verifyToken } = require("../middleware/auth");

router.get("/rooms", verifyToken, (req, res) => {
  const conns = db.findMany("connections", (c) => c.userA === req.user.id || c.userB === req.user.id);
  const rooms = conns.map((c) => {
    const otherId = c.userA === req.user.id ? c.userB : c.userA;
    const other = db.findOne("users", (u) => u.id === otherId);
    const msgs = db.findMany("messages", (m) => m.roomId === c.roomId);
    const last = msgs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] || null;
    const { passwordHash: _, ...safe } = other || {};
    return { roomId: c.roomId, otherUser: safe, lastMessage: last, unread: msgs.filter((m) => !m.isRead && m.receiverId === req.user.id).length };
  });
  res.json(rooms.sort((a, b) => (b.lastMessage?.timestamp || b.roomId) > (a.lastMessage?.timestamp || a.roomId) ? 1 : -1));
});

router.get("/rooms/:roomId/messages", verifyToken, (req, res) => {
  const { roomId } = req.params;
  const msgs = db.findMany("messages", (m) => m.roomId === roomId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  db.writeAll("messages", db.findAll("messages").map((m) => m.roomId === roomId && m.receiverId === req.user.id ? { ...m, isRead: true } : m));
  res.json(msgs);
});

module.exports = router;
