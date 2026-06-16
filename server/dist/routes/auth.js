"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = require("jsonwebtoken");
const zod_1 = require("zod");
const env_1 = __importDefault(require("../env"));
const db_1 = require("../db");
const errors_1 = require("../utils/errors");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../utils/upload");
const router = (0, express_1.Router)();
const registerBody = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50),
    password: zod_1.z.string().min(8).max(72),
    role: zod_1.z.enum(['user', 'author']).optional().default('user'),
});
router.post("/register", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = registerBody.parse(req.body);
    const [existing] = await db_1.pool.query("SELECT id FROM users WHERE username = ? LIMIT 1", [body.username]);
    if (existing.length > 0)
        throw new errors_1.ApiError(409, "用户名已存在");
    const passwordHash = await bcryptjs_1.default.hash(body.password, 10);
    const [result] = await db_1.pool.query("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)", [body.username, passwordHash, body.role]);
    const userId = result.insertId;
    const token = (0, jsonwebtoken_1.sign)({ sub: userId, username: body.username }, env_1.default.JWT_SECRET, { expiresIn: env_1.default.JWT_EXPIRES_IN });
    return res.json({
        token,
        user: { id: userId, username: body.username }
    });
}));
const loginBody = registerBody;
router.post("/login", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = loginBody.parse(req.body);
    const [rows] = await db_1.pool.query("SELECT id, password_hash, avatar_url, role FROM users WHERE username = ? LIMIT 1", [body.username]);
    const user = rows[0];
    if (!user)
        throw new errors_1.ApiError(401, "用户名或密码错误");
    const ok = await bcryptjs_1.default.compare(body.password, user.password_hash);
    if (!ok)
        throw new errors_1.ApiError(401, "用户名或密码错误");
    const token = (0, jsonwebtoken_1.sign)({ sub: user.id, username: body.username, role: user.role }, env_1.default.JWT_SECRET, { expiresIn: env_1.default.JWT_EXPIRES_IN });
    return res.json({
        token,
        user: {
            id: user.id,
            username: body.username,
            avatarUrl: user.avatar_url || null,
            role: user.role || 'user'
        }
    });
}));
// 获取当前用户信息
router.get("/me", auth_1.verifyToken, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const [rows] = await db_1.pool.query("SELECT id, username, avatar_url, role, created_at FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
        throw new errors_1.ApiError(404, "用户不存在");
    }
    const user = rows[0];
    return res.json({
        id: user.id,
        username: user.username,
        avatarUrl: user.avatar_url,
        role: user.role || 'user',
        createdAt: user.created_at
    });
}));
// 上传头像
router.post("/avatar", auth_1.verifyToken, upload_1.upload.single("avatar"), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        throw new errors_1.ApiError(400, "请选择图片文件");
    }
    const userId = req.user.id;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    // 更新用户头像URL
    await db_1.pool.query("UPDATE users SET avatar_url = ? WHERE id = ?", [avatarUrl, userId]);
    return res.json({
        avatarUrl,
        message: "头像上传成功"
    });
}));
// 修改密码
router.post("/change-password", auth_1.verifyToken, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    if (!oldPassword || !newPassword) {
        throw new errors_1.ApiError(400, "请填写旧密码和新密码");
    }
    if (newPassword.length < 8) {
        throw new errors_1.ApiError(400, "新密码至少需要8个字符");
    }
    // 获取当前密码哈希
    const [rows] = await db_1.pool.query("SELECT password_hash FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
        throw new errors_1.ApiError(404, "用户不存在");
    }
    const user = rows[0];
    // 验证旧密码
    const isOldPasswordValid = await bcryptjs_1.default.compare(oldPassword, user.password_hash);
    if (!isOldPasswordValid) {
        throw new errors_1.ApiError(400, "旧密码不正确");
    }
    // 检查新密码是否与旧密码相同
    const isSamePassword = await bcryptjs_1.default.compare(newPassword, user.password_hash);
    if (isSamePassword) {
        throw new errors_1.ApiError(400, "新密码不能与旧密码相同");
    }
    // 更新密码
    const newPasswordHash = await bcryptjs_1.default.hash(newPassword, 10);
    await db_1.pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [newPasswordHash, userId]);
    return res.json({
        message: "密码修改成功"
    });
}));
const isAuthor = async (userId) => {
    const [rows] = await db_1.pool.query("SELECT role FROM users WHERE id = ?", [userId]);
    return rows.length > 0 && rows[0].role === 'author';
};
router.get("/users", auth_1.verifyToken, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    if (!await isAuthor(userId)) {
        throw new errors_1.ApiError(403, "权限不足");
    }
    const [rows] = await db_1.pool.query("SELECT id, username, role, avatar_url as avatarUrl, created_at as createdAt FROM users ORDER BY created_at DESC");
    return res.json(rows);
}));
router.delete("/users/:id", auth_1.verifyToken, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    if (!await isAuthor(userId)) {
        throw new errors_1.ApiError(403, "权限不足");
    }
    const targetId = parseInt(req.params.id);
    if (isNaN(targetId)) {
        throw new errors_1.ApiError(400, "无效的用户ID");
    }
    if (targetId === userId) {
        throw new errors_1.ApiError(400, "不能删除自己");
    }
    const [result] = await db_1.pool.query("DELETE FROM users WHERE id = ?", [targetId]);
    if (result.affectedRows === 0) {
        throw new errors_1.ApiError(404, "用户不存在");
    }
    return res.json({
        message: "用户删除成功"
    });
}));
exports.default = router;
//# sourceMappingURL=auth.js.map