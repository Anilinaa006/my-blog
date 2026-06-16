import { Router, type Request, type Response, type Router as RouterType } from "express";
import { pool } from "../db";
import { verifyToken } from "../middleware/auth";
import { ApiError } from "../utils/errors";

const router: RouterType = Router();

// 获取文章评论（包含点赞数）
router.get("/", async (req: Request, res: Response) => {
  try {
    const { postId } = req.query;
    
    if (!postId) {
      throw new ApiError(400, "缺少文章ID");
    }

    const [rows] = await pool.query<any[]>(
      `
      SELECT 
        c.id, 
        c.post_id as postId, 
        c.user_id as userId, 
        u.username, 
        u.avatar_url as avatarUrl,
        u.role,
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
    `,
      [postId]
    );

    res.json(rows);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message || "服务器错误" });
  }
});

// 创建评论
router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { postId, content } = req.body;
    console.log("创建评论请求:", req.body);
    console.log("用户信息:", req.user);
    
    if (!req.user) {
      throw new ApiError(401, "用户未认证");
    }
    
    const userId = req.user.id;

    if (!postId || !content) {
      throw new ApiError(400, "缺少文章ID或评论内容");
    }

    const [result]: any = await pool.query(
      "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
      [postId, userId, content]
    );

    const [newComment] = await pool.query<any[]>(
      `
      SELECT 
        c.id, 
        c.post_id as postId, 
        c.user_id as userId, 
        u.username, 
        u.avatar_url as avatarUrl,
        u.role,
        c.content, 
        c.created_at as createdAt, 
        c.updated_at as updatedAt
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
      `,
      [result.insertId]
    );

    res.status(201).json(newComment[0]);
  } catch (error: any) {
    if (error instanceof ApiError) {
      console.error("API错误:", error);
      return res.status(error.status).json({ error: error.message });
    }
    console.error("创建评论失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// 更新评论
router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user!.id;

    if (!content) {
      throw new ApiError(400, "缺少评论内容");
    }

    // 检查评论是否存在且属于当前用户
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM comments WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (rows.length === 0) {
      throw new ApiError(404, "评论不存在或无权限修改");
    }

    await pool.query(
      "UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [content, id]
    );

    const [updatedComment] = await pool.query<any[]>(
      `
      SELECT 
        c.id, 
        c.post_id as postId, 
        c.user_id as userId, 
        u.username, 
        u.avatar_url as avatarUrl,
        u.role,
        c.content, 
        c.created_at as createdAt, 
        c.updated_at as updatedAt
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
      `,
      [id]
    );

    res.json(updatedComment[0]);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message || "服务器错误" });
  }
});

// 删除评论
router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole === 'author') {
      await pool.query("DELETE FROM comments WHERE id = ?", [id]);
      res.json({ message: "删除成功" });
      return;
    }

    const [rows] = await pool.query<any[]>(
      "SELECT * FROM comments WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (rows.length === 0) {
      throw new ApiError(404, "评论不存在或无权限删除");
    }

    await pool.query("DELETE FROM comments WHERE id = ?", [id]);

    res.json({ message: "删除成功" });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message || "服务器错误" });
  }
});

// 点赞评论
router.post("/:id/like", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await pool.query(
      "INSERT IGNORE INTO comment_likes (comment_id, user_id) VALUES (?, ?)",
      [id, userId]
    );

    const [result] = await pool.query<any[]>(
      "SELECT COUNT(*) as likeCount FROM comment_likes WHERE comment_id = ?",
      [id]
    );

    res.json({ likeCount: result[0].likeCount, liked: true });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message || "服务器错误" });
  }
});

// 取消点赞
router.delete("/:id/like", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await pool.query(
      "DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?",
      [id, userId]
    );

    const [result] = await pool.query<any[]>(
      "SELECT COUNT(*) as likeCount FROM comment_likes WHERE comment_id = ?",
      [id]
    );

    res.json({ likeCount: result[0].likeCount, liked: false });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message || "服务器错误" });
  }
});

// 获取评论的回复
router.get("/:id/replies", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [replies] = await pool.query<any[]>(
      `
      SELECT 
        cr.id, 
        cr.comment_id as commentId, 
        cr.user_id as userId, 
        u.username, 
        u.avatar_url as avatarUrl,
        u.role,
        cr.reply_to_user_id as replyToUserId, 
        ru.username as replyToUsername,
        ru.avatar_url as replyToAvatarUrl,
        cr.content, 
        cr.created_at as createdAt, 
        cr.updated_at as updatedAt
      FROM comment_replies cr
      JOIN users u ON cr.user_id = u.id
      LEFT JOIN users ru ON cr.reply_to_user_id = ru.id
      WHERE cr.comment_id = ?
      ORDER BY cr.created_at ASC
    `,
      [id]
    );

    res.json(replies);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message || "服务器错误" });
  }
});

// 回复评论
router.post("/:id/replies", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content, replyToUserId } = req.body;
    const userId = req.user!.id;

    if (!content) {
      throw new ApiError(400, "缺少回复内容");
    }

    const [result]: any = await pool.query(
      "INSERT INTO comment_replies (comment_id, user_id, reply_to_user_id, content) VALUES (?, ?, ?, ?)",
      [id, userId, replyToUserId || null, content]
    );

    const replyId = result.insertId as number;

    const [replies] = await pool.query<any[]>(
      `
      SELECT 
        cr.id, 
        cr.comment_id as commentId, 
        cr.user_id as userId, 
        u.username, 
        u.avatar_url as avatarUrl,
        u.role,
        cr.reply_to_user_id as replyToUserId, 
        ru.username as replyToUsername,
        ru.avatar_url as replyToAvatarUrl,
        cr.content, 
        cr.created_at as createdAt, 
        cr.updated_at as updatedAt
      FROM comment_replies cr
      JOIN users u ON cr.user_id = u.id
      LEFT JOIN users ru ON cr.reply_to_user_id = ru.id
      WHERE cr.id = ?
    `,
      [replyId]
    );

    res.status(201).json(replies[0]);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message || "服务器错误" });
  }
});

export default router;