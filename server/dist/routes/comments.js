"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const errors_1 = require("../utils/errors");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = (0, express_1.Router)();
// 获取文章评论（包含点赞数）
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
        c.updated_at as updatedAt,
        COALESCE(l.like_count, 0) as likeCount
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN (
        SELECT comment_id, COUNT(*) as like_count
        FROM comment_likes
        GROUP BY comment_id
      ) l ON c.id = l.comment_id
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
// 点赞评论
router.post("/comments/:id/like", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) {
        throw new errors_1.ApiError(400, "缺少用户ID");
    }
    await db_1.pool.query("INSERT IGNORE INTO comment_likes (comment_id, user_id) VALUES (?, ?)", [id, userId]);
    const [result] = await db_1.pool.query("SELECT COUNT(*) as likeCount FROM comment_likes WHERE comment_id = ?", [id]);
    return res.json({ likeCount: result[0].likeCount, liked: true });
}));
// 取消点赞
router.delete("/comments/:id/like", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) {
        throw new errors_1.ApiError(400, "缺少用户ID");
    }
    await db_1.pool.query("DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?", [id, userId]);
    const [result] = await db_1.pool.query("SELECT COUNT(*) as likeCount FROM comment_likes WHERE comment_id = ?", [id]);
    return res.json({ likeCount: result[0].likeCount, liked: false });
}));
// 获取评论的回复
router.get("/comments/:id/replies", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const [replies] = await db_1.pool.query(`
      SELECT 
        cr.id, 
        cr.comment_id as commentId, 
        cr.user_id as userId, 
        u.username, 
        cr.reply_to_user_id as replyToUserId, 
        ru.username as replyToUsername,
        cr.content, 
        cr.created_at as createdAt, 
        cr.updated_at as updatedAt
      FROM comment_replies cr
      JOIN users u ON cr.user_id = u.id
      LEFT JOIN users ru ON cr.reply_to_user_id = ru.id
      WHERE cr.comment_id = ?
      ORDER BY cr.created_at ASC
    `, [id]);
    return res.json(replies);
}));
// 回复评论
router.post("/comments/:id/replies", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { userId, content, replyToUserId } = req.body;
    if (!userId || !content) {
        throw new errors_1.ApiError(400, "缺少必要参数");
    }
    const [result] = await db_1.pool.query("INSERT INTO comment_replies (comment_id, user_id, reply_to_user_id, content) VALUES (?, ?, ?, ?)", [id, userId, replyToUserId || null, content]);
    const replyId = result.insertId;
    const [replies] = await db_1.pool.query(`
      SELECT 
        cr.id, 
        cr.comment_id as commentId, 
        cr.user_id as userId, 
        u.username, 
        cr.reply_to_user_id as replyToUserId, 
        ru.username as replyToUsername,
        cr.content, 
        cr.created_at as createdAt, 
        cr.updated_at as updatedAt
      FROM comment_replies cr
      JOIN users u ON cr.user_id = u.id
      LEFT JOIN users ru ON cr.reply_to_user_id = ru.id
      WHERE cr.id = ?
    `, [replyId]);
    return res.status(201).json(replies[0]);
}));
exports.default = router;
//# sourceMappingURL=comments.js.map