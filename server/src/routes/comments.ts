import { Router } from "express";
import { pool } from "../db";
import { ApiError } from "../utils/errors";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// 获取文章评论
router.get(
  "/comments/:postId",
  asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const [comments] = await pool.query<any[]>(
      `
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
    `,
      [postId]
    );

    return res.json(comments);
  })
);

// 创建评论
router.post(
  "/comments",
  asyncHandler(async (req, res) => {
    const { postId, content, userId } = req.body;

    if (!postId || !content || !userId) {
      throw new ApiError(400, "缺少必要参数");
    }

    const [result]: any = await pool.query(
      "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
      [postId, userId, content]
    );

    const commentId = result.insertId as number;

    // 返回创建的评论
    const [comments] = await pool.query<any[]>(
      `
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
    `,
      [commentId]
    );

    return res.status(201).json(comments[0]);
  })
);

// 更新评论
router.put(
  "/comments/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content, userId } = req.body;

    if (!content || !userId) {
      throw new ApiError(400, "缺少必要参数");
    }

    // 检查评论是否存在且属于该用户
    const [comments] = await pool.query<any[]>(
      "SELECT * FROM comments WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (comments.length === 0) {
      throw new ApiError(404, "评论不存在或无权限修改");
    }

    await pool.query(
      "UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [content, id]
    );

    // 返回更新后的评论
    const [updatedComments] = await pool.query<any[]>(
      `
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
    `,
      [id]
    );

    return res.json(updatedComments[0]);
  })
);

// 删除评论
router.delete(
  "/comments/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      throw new ApiError(400, "缺少用户ID");
    }

    // 检查评论是否存在且属于该用户
    const [comments] = await pool.query<any[]>(
      "SELECT * FROM comments WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (comments.length === 0) {
      throw new ApiError(404, "评论不存在或无权限删除");
    }

    await pool.query("DELETE FROM comments WHERE id = ?", [id]);

    return res.json({ message: "评论删除成功" });
  })
);

export default router;
