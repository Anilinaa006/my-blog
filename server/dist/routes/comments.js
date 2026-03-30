"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const errors_1 = require("../utils/errors");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
// 获取文章评论
router.get("/comments/:postId", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { postId } = req.params;
    const [comments] = await db_1.pool.query(`
      SELECT 
        c.id, 
        c.post_id as postId, 
        c.user_id as userId, 
        u.username, 
        c.content, 
        c.created_at as createdAt, 
        c.updated_at as updatedAt
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
    `, [postId]);
    return res.json(comments);
}));
// 创建评论
router.post("/comments", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { postId, content, userId } = req.body;
    if (!postId || !content || !userId) {
        throw new errors_1.ApiError(400, "缺少必要参数");
    }
    const [result] = await db_1.pool.query("INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)", [postId, userId, content]);
    const commentId = result.insertId;
    // 返回创建的评论
    const [comments] = await db_1.pool.query(`
      SELECT 
        c.id, 
        c.post_id as postId, 
        c.user_id as userId, 
        u.username, 
        c.content, 
        c.created_at as createdAt, 
        c.updated_at as updatedAt
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [commentId]);
    return res.status(201).json(comments[0]);
}));
// 更新评论
router.put("/comments/:id", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { content, userId } = req.body;
    if (!content || !userId) {
        throw new errors_1.ApiError(400, "缺少必要参数");
    }
    // 检查评论是否存在且属于该用户
    const [comments] = await db_1.pool.query("SELECT * FROM comments WHERE id = ? AND user_id = ?", [id, userId]);
    if (comments.length === 0) {
        throw new errors_1.ApiError(404, "评论不存在或无权限修改");
    }
    await db_1.pool.query("UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [content, id]);
    // 返回更新后的评论
    const [updatedComments] = await db_1.pool.query(`
      SELECT 
        c.id, 
        c.post_id as postId, 
        c.user_id as userId, 
        u.username, 
        c.content, 
        c.created_at as createdAt, 
        c.updated_at as updatedAt
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [id]);
    return res.json(updatedComments[0]);
}));
// 删除评论
router.delete("/comments/:id", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) {
        throw new errors_1.ApiError(400, "缺少用户ID");
    }
    // 检查评论是否存在且属于该用户
    const [comments] = await db_1.pool.query("SELECT * FROM comments WHERE id = ? AND user_id = ?", [id, userId]);
    if (comments.length === 0) {
        throw new errors_1.ApiError(404, "评论不存在或无权限删除");
    }
    await db_1.pool.query("DELETE FROM comments WHERE id = ?", [id]);
    return res.json({ message: "评论删除成功" });
}));
exports.default = router;
//# sourceMappingURL=comments.js.map