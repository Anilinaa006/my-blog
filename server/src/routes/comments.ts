import { Router } from "express";
import { z } from "zod";
import { pool } from "../db";
import { authRequired } from "../middlewares/authRequired";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/errors";

const router = Router();

const publishBody = z.object({
  content: z.string().min(1).max(5000)
});

router.get(
  "/posts/:postId/comments",
  asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const [rows] = await pool.query<any[]>(
      `
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
    `,
      [postId]
    );

    return res.json({
      comments: rows
    });
  })
);

router.post(
  "/posts/:postId/comments",
  authRequired,
  asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = publishBody.parse(req.body);
    const user = req.user;
    if (!user) throw new ApiError(401, "未登录");

    const [result]: any = await pool.query(
      "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
      [postId, user.id, content]
    );

    const commentId = result.insertId as number;
    const [rows] = await pool.query<any[]>(
      `
      SELECT c.id, c.content, c.created_at, c.updated_at, u.username
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.id = ?
    `,
      [commentId]
    );

    return res.status(201).json({ comment: rows[0] });
  })
);

router.put(
  "/posts/:postId/comments/:commentId",
  authRequired,
  asyncHandler(async (req, res) => {
    const { postId, commentId } = req.params;
    const { content } = publishBody.parse(req.body);
    const user = req.user;
    if (!user) throw new ApiError(401, "未登录");

    const [result]: any = await pool.query(
      `
      UPDATE comments
      SET content = ?, updated_at = NOW()
      WHERE id = ? AND post_id = ? AND user_id = ?
    `,
      [content, commentId, postId, user.id]
    );

    const affected = result.affectedRows as number;
    if (!affected) throw new ApiError(403, "无权限或评论不存在");

    const [rows] = await pool.query<any[]>(
      `
      SELECT c.id, c.content, c.created_at, c.updated_at, u.username
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.id = ?
    `,
      [commentId]
    );

    return res.json({ comment: rows[0] });
  })
);

router.delete(
  "/posts/:postId/comments/:commentId",
  authRequired,
  asyncHandler(async (req, res) => {
    const { postId, commentId } = req.params;
    const user = req.user;
    if (!user) throw new ApiError(401, "未登录");

    const [result]: any = await pool.query(
      `
      DELETE FROM comments
      WHERE id = ? AND post_id = ? AND user_id = ?
    `,
      [commentId, postId, user.id]
    );

    const affected = result.affectedRows as number;
    if (!affected) throw new ApiError(403, "无权限或评论不存在");

    return res.status(204).send();
  })
);

export default router;

