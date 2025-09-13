import path from "path";
import { createServer } from "./index";
import * as express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files
app.use(express.static(distPath));

// Explicitly handle favicon to avoid CORP warnings if missing
app.get("/favicon.ico", (_req, res) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.status(204).end();
});

// Handle React Router - serve index.html for all non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API-like routes
  const apiPrefixes = [
    "/api/",
    "/auth",
    "/wallet",
    "/transactions",
    "/services",
    "/dashboard",
    "/portfolio",
    "/investments",
    "/kyc",
    "/payments",
    "/analytics",
    "/notifications",
    "/otp",
    "/roundup",
    "/achievements",
    "/leaderboard",
    "/level",
    "/crypto",
    "/bills",
    "/transfer",
    "/admin",
    "/social",
    "/metrics",
    "/health",
    "/ready",
    "/live",
  ];

  if (apiPrefixes.some((p) => req.path.startsWith(p))) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
