// ─────────────────────────────────────────────────────────────
// server.js  –  PRODUCTION VERSION
//
// WHAT CHANGED vs. localhost version:
//   • Added  cors()  middleware with explicit allowed origins so
//     Vercel frontend can call the Render backend.
//   • PORT now reads from  process.env.PORT  (Render sets this
//     automatically – never hard-code 5000 in production).
//   • JWT_SECRET reads from  process.env.JWT_SECRET  instead of
//     being a hard-coded string.
//   • Added GET /api/health  for uptime monitoring.
//   • All three required routes are confirmed present:
//       POST /api/register
//       POST /api/login
//       GET  /api/auth/me
// ─────────────────────────────────────────────────────────────

const express = require("express");
const cors    = require("cors");

const app = express();

// ── 1. CORS  ──────────────────────────────────────────────────
// Allow your Vercel frontend (and localhost for local dev).
// Add any extra Vercel preview URLs to the array as needed.
const ALLOWED_ORIGINS = [
  "https://roomie-find-ten.vercel.app",       // ← replace with your real Vercel URL
  "https://roomiefind.vercel.app",
  /https:\/\/roomie-find-.*\.vercel\.app/, // preview deployments
  "http://localhost:3000",                 // local dev (Vite default)
  "http://localhost:5173",                 // local dev (alternate Vite port)
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server calls (no Origin header) and known origins
      if (!origin) return callback(null, true);
      const allowed = ALLOWED_ORIGINS.some((o) =>
        typeof o === "string" ? o === origin : o.test(origin)
      );
      if (allowed) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── 2. Body parsing ───────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── 3. Routes ─────────────────────────────────────────────────
// Auth routes expose:
//   POST /api/register
//   POST /api/login
//   GET  /api/auth/me
const authRouter  = require("./routes/auth");

app.use("/api", authRouter);            // POST /api/register, POST /api/login
app.use("/api/auth", authRouter);       // GET  /api/auth/me

// Add your other routers here:
// app.use("/api/listings", require("./routes/listings"));
// app.use("/api/matches",  require("./routes/matches"));
// app.use("/api/chat",     require("./routes/chat"));
// app.use("/api/reviews",  require("./routes/reviews"));

// ── 4. Health check (Render ping / uptime monitors) ──────────
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ── 5. 404 catch-all ─────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

// ── 6. Global error handler ───────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// ── 7. Port  (Render sets process.env.PORT automatically) ────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n  RoomieFind API running on port ${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/api/health\n`);
});
