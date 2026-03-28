import express from "express";
import cors from "cors";
import { env } from "./env";
import { initSchema, pool } from "./db";
import authRoutes from "./routes/auth";
import commentRoutes from "./routes/comments";
import { ApiError } from "./utils/errors";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/healthz", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api", commentRoutes);

// 统一错误处理
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (err instanceof ApiError) {
      return res.status(err.status).json({ error: err.message });
    }

    console.error(err);
    return res.status(500).json({ error: "服务器错误" });
  }
);

async function start() {
  await initSchema();

  // Test connection early (fail fast)
  await pool.query("SELECT 1");

  app.listen(env.PORT, () => {
    console.log(`[server] listening on :${env.PORT}`);
  });
}

start().catch((e) => {
  console.error("[server] failed to start:", e);
  process.exit(1);
});

