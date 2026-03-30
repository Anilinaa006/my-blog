"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const errors_1 = require("../utils/errors");
const router = (0, express_1.Router)();
// 获取文章评论
router.get("/", async (req, res) => {
    try {
        const { postId } = req.query;
        if (!postId) {
            throw new errors_1.ApiError(400, "缺少文章ID");
        }
        const [rows] = await db_1.pool.query("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC", [postId]);
        res.json(rows);
    }
    catch (error) {
        res.status(error.status || 500).json({ error: error.message || "服务器错误" });
    }
});
// 创建评论
router.post("/", auth_1.verifyToken, async (req, res) => {
    try {
        const { postId, content } = req.body;
        console.log("创建评论请求:", req.body);
        console.log("用户信息:", req.user);
        if (!req.user) {
            throw new errors_1.ApiError(401, "用户未认证");
        }
        const userId = req.user.id;
        if (!postId || !content) {
            throw new errors_1.ApiError(400, "缺少文章ID或评论内容");
        }
        const [result] = await db_1.pool.query("INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)", [postId, userId, content]);
        const [newComment] = await db_1.pool.query("SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?", [result.insertId]);
        res.status(201).json(newComment[0]);
    }
    catch (error) {
        if (error instanceof errors_1.ApiError) {
            console.error("API错误:", error);
            return res.status(error.status).json({ error: error.message });
        }
        console.error("创建评论失败:", error);
        res.status(500).json({ error: "服务器错误" });
    }
});
// 更新评论
router.put("/:id", auth_1.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        if (!content) {
            throw new errors_1.ApiError(400, "缺少评论内容");
        }
        // 检查评论是否存在且属于当前用户
        const [rows] = await db_1.pool.query("SELECT * FROM comments WHERE id = ? AND user_id = ?", [id, userId]);
        if (rows.length === 0) {
            throw new errors_1.ApiError(404, "评论不存在或无权限修改");
        }
        await db_1.pool.query("UPDATE comments SET content = ? WHERE id = ?", [content, id]);
        const [updatedComment] = await db_1.pool.query("SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?", [id]);
        res.json(updatedComment[0]);
    }
    catch (error) {
        res.status(error.status || 500).json({ error: error.message || "服务器错误" });
    }
});
// 删除评论
router.delete("/:id", auth_1.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        // 检查评论是否存在且属于当前用户
        const [rows] = await db_1.pool.query("SELECT * FROM comments WHERE id = ? AND user_id = ?", [id, userId]);
        if (rows.length === 0) {
            throw new errors_1.ApiError(404, "评论不存在或无权限删除");
        }
        await db_1.pool.query("DELETE FROM comments WHERE id = ?", [id]);
        res.json({ message: "删除成功" });
    }
    catch (error) {
        res.status(error.status || 500).json({ error: error.message || "服务器错误" });
    }
});
exports.default = router;
//# sourceMappingURL=comment.js.map