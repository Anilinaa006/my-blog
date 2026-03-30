"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = __importDefault(require("./env"));
const db_1 = require("./db");
const auth_1 = __importDefault(require("./routes/auth"));
const comment_1 = __importDefault(require("./routes/comment"));
const errors_1 = require("./utils/errors");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: env_1.default.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
}));
app.use(express_1.default.json({ limit: "2mb" }));
app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", auth_1.default);
app.use("/api/comments", comment_1.default);
// 统一错误处理
app.use((err, _req, res, _next) => {
    if (err instanceof errors_1.ApiError) {
        return res.status(err.status).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: "服务器错误" });
});
async function start() {
    await (0, db_1.initSchema)();
    // Test connection early (fail fast)
    await db_1.pool.query("SELECT 1");
    app.listen(env_1.default.PORT, () => {
        console.log(`[server] listening on :${env_1.default.PORT}`);
    });
}
start().catch((e) => {
    console.error("[server] failed to start:", e);
    process.exit(1);
});
//# sourceMappingURL=index.js.map