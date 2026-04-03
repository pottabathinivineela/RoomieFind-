const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const db = require("./utils/db");

const app = express();
const server = http.createServer(app);

const ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:5173"];

const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGINS, methods: ["GET", "POST"] },
});

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json({ limit: "10mb" }));

app.set("io", io);

app.use("/api/auth",     require("./routes/auth"));
app.use("/api/listings", require("./routes/listings"));
app.use("/api/matches",  require("./routes/matches"));
app.use("/api/chat",     require("./routes/chat"));
app.use("/api/reviews",  require("./routes/reviews"));
app.use("/api/users",    require("./routes/users"));

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date() })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// --------------- Socket.io real-time chat ---------------
io.on("connection", (socket) => {
  socket.on("join_room", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("send_message", ({ roomId, senderId, receiverId, content }) => {
    if (!content || !content.trim()) return;
    const message = {
      id: uuidv4(),
      roomId,
      senderId,
      receiverId,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    const msgs = db.findAll("messages");
    msgs.push(message);
    db.writeAll("messages", msgs);
    io.to(roomId).emit("new_message", message);
  });

  socket.on("typing", ({ roomId, userId }) => {
    socket.to(roomId).emit("user_typing", { userId });
  });

  socket.on("stop_typing", ({ roomId }) => {
    socket.to(roomId).emit("user_stop_typing");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("\n\x1b[36m  Smart Housing Platform  \x1b[0m");
  console.log(`  Backend   http://localhost:${PORT}`);
  console.log(`  API       http://localhost:${PORT}/api\n`);
});
