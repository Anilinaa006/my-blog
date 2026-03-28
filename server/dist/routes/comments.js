"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const authRequired_1 = require("../middlewares/authRequired");
const asyncHandler_1 = require("../utils/asyncHandler");
const errors_1 = require("../utils/errors");
const router = (0, express_1.Router)();
const publishBody = zod_1.z.object({
    content: zod_1.z.string().min(1).max(5000)
});
router.get("/posts/:postId/comments", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { postId } = req.params;
    const [rows] = await db_1.pool.query(`
      SELECT
        c.id,
        c.content,
        c.created_at,
        c.updated_at,
        u.username
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
    `, [postId]);
    return res.json({
        comments: rows
    });
}));
router.post("/posts/:postId/comments", authRequired_1.authRequired, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { postId } = req.params;
    const { content } = publishBody.parse(req.body);
    const user = req.user;
    if (!user)
        throw new errors_1.ApiError(401, "未登录");
    const [result] = await db_1.pool.query("INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)", [postId, user.id, content]);
    const commentId = result.insertId;
    const [rows] = await db_1.pool.query(`
      SELECT c.id, c.content, c.created_at, c.updated_at, u.username
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.id = ?
    `, [commentId]);
    return res.status(201).json({ comment: rows[0] });
}));
router.put("/posts/:postId/comments/:commentId", authRequired_1.authRequired, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { postId, commentId } = req.params;
    const { content } = publishBody.parse(req.body);
    const user = req.user;
    if (!user)
        throw new errors_1.ApiError(401, "未登录");
    const [result] = await db_1.pool.query(`
      UPDATE comments
      SET content = ?, updated_at = NOW()
      WHERE id = ? AND post_id = ? AND user_id = ?
    `, [content, commentId, postId, user.id]);
    const affected = result.affectedRows;
    if (!affected)
        throw new errors_1.ApiError(403, "无权限或评论不存在");
    const [rows] = await db_1.pool.query(`
      SELECT c.id, c.content, c.created_at, c.updated_at, u.username
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.id = ?
    `, [commentId]);
    return res.json({ comment: rows[0] });
}));
router.delete("/posts/:postId/comments/:commentId", authRequired_1.authRequired, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { postId, commentId } = req.params;
    const user = req.user;
    if (!user)
        throw new errors_1.ApiError(401, "未登录");
    const [result] = await db_1.pool.query(`
      DELETE FROM comments
      WHERE id = ? AND post_id = ? AND user_id = ?
    `, [commentId, postId, user.id]);
    const affected = result.affectedRows;
    if (!affected)
        throw new errors_1.ApiError(403, "无权限或评论不存在");
    return res.status(204).send();
}));
exports.default = router;
