import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import assignmentRoutes from "./routes/assignment.routes";
import { errorHandler } from "./middleware/errorHandler";

const app: ReturnType<typeof express> = express();

// ── Middleware ──────────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { success: false, error: "Too many requests" },
  })
);

// ── Routes ─────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/assignments", assignmentRoutes);

// ── Error handler (must be last) ──────────
app.use(errorHandler);

export default app;
