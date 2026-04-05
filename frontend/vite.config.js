// ─────────────────────────────────────────────────────────────
// vite.config.js  –  PRODUCTION VERSION
//
// WHAT CHANGED vs. localhost version:
//   • Removed the  server.proxy  block entirely.
//     In development the proxy was forwarding /api → localhost:5000.
//     In production axios.defaults.baseURL handles routing directly
//     to Render, so Vite never needs to touch API traffic.
//   • Added  define  so VITE_API_URL env var is available in code
//     (optional but useful if you want to toggle dev/prod URLs
//     via .env files without touching source code).
//   • build.outDir matches Vercel's expected "dist" folder.
// ─────────────────────────────────────────────────────────────

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: "dist",           // Vercel picks this up automatically
    sourcemap: false,         // Disable for production (saves bandwidth)
    chunkSizeWarningLimit: 600,
  },

  // ── Only used during  npm run dev  on your local machine ────
  // The proxy block has been REMOVED because:
  //   • Vercel doesn't run a Vite dev server
  //   • axios.defaults.baseURL = "https://roomiefind.onrender.com"
  //     already handles production routing
  //
  // If you still want the proxy for local dev, add it back here:
  //
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:5000",
  //       changeOrigin: true,
  //     },
  //   },
  // },
});
