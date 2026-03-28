"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = require("jsonwebtoken");
const zod_1 = require("zod");
const env_1 = require("../env");
const db_1 = require("../db");
const errors_1 = require("../utils/errors");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
const registerBody = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50),
    password: zod_1.z.string().min(8).max(72)
});
router.post("/register", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = registerBody.parse(req.body);
    const [existing] = await db_1.pool.query("SELECT id FROM users WHERE username = ? LIMIT 1", [body.username]);
    if (existing.length > 0)
        throw new errors_1.ApiError(409, "用户名已存在");
    const passwordHash = await bcryptjs_1.default.hash(body.password, 10);
    const [result] = await db_1.pool.query("INSERT INTO users (username, password_hash) VALUES (?, ?)", [body.username, passwordHash]);
    const userId = result.insertId;
    const token = (0, jsonwebtoken_1.sign)({ sub: userId, username: body.username }, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
    return res.json({
        token,
        user: { id: userId, username: body.username }
    });
}));
const loginBody = registerBody;
router.post("/login", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = loginBody.parse(req.body);
    const [rows] = await db_1.pool.query("SELECT id, password_hash FROM users WHERE username = ? LIMIT 1", [body.username]);
    const user = rows[0];
    if (!user)
        throw new errors_1.ApiError(401, "用户名或密码错误");
    const ok = await bcryptjs_1.default.compare(body.password, user.password_hash);
    if (!ok)
        throw new errors_1.ApiError(401, "用户名或密码错误");
    const token = (0, jsonwebtoken_1.sign)({ sub: user.id, username: body.username }, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
    return res.json({
        token,
        user: { id: user.id, username: body.username }
    });
}));
exports.default = router;
