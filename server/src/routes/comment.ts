import {
  Router,
  type Request,
  type Response,
  type Router as RouterType,
} from "express";
import { pool } from "../db";
import { verifyToken, optionalVerifyToken } from "../middleware/auth";
import { ApiError } from "../utils/errors";
import { commentUpload } from "../utils/upload";

const router: RouterType = Router();

// 获取文章评论（包含点赞数和用户点赞状态）
router.get("/", optionalVerifyToken, async (req: Request, res: Response) => {
  try {
    const { postId } = req.query;

    if (!postId) {
      throw new ApiError(400, "缺少文章ID");
    }

    const userId = req.user?.id;

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
        c.images,
        c.created_at as createdAt, 
        c.updated_at as updatedAt,
        COALESCE(l.like_count, 0) as likeCount,
        CASE WHEN ul.comment_id IS NOT NULL THEN 1 ELSE 0 END as liked
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN (
        SELECT comment_id, COUNT(*) as like_count
        FROM comment_likes
        GROUP BY comment_id
      ) l ON c.id = l.comment_id
      LEFT JOIN comment_likes ul ON c.id = ul.comment_id AND ul.user_id = ?
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
    `,
      [userId || null, postId],
    );

    const comments = rows.map((row) => {
      let images: string[] = [];
      if (row.images) {
        if (Array.isArray(row.images)) {
          images = row.images;
        } else if (typeof row.images === "string") {
          try {
            images = JSON.parse(row.images);
            if (!Array.isArray(images)) {
              images = [];
            }
          } catch {
            images = [];
          }
        }
      }
      return {
        ...row,
        images,
      };
    });

    res.json(comments);
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "服务器错误" });
  }
});

router.post(
  "/",
  verifyToken,
  commentUpload.array("images", 9),
  async (req: Request, res: Response) => {
    try {
      const { postId, content } = req.body;
      const files = req.files as Express.Multer.File[];

      console.log("[comment] 创建评论:", {
        postId,
        contentLength: content?.length,
        filesCount: files?.length,
      });
      console.log(
        "[comment] files:",
        files?.map((f) => f.filename),
      );

      if (!req.user) {
        throw new ApiError(401, "用户未认证");
      }

      const userId = req.user.id;

      if (!postId) {
        throw new ApiError(400, "缺少文章ID");
      }

      if (!content && (!files || files.length === 0)) {
        throw new ApiError(400, "缺少评论内容或图片");
      }

      const imageUrls =
        files?.map((file) => `/uploads/comments/${file.filename}`) || [];
      const imagesJson =
        imageUrls.length > 0 ? JSON.stringify(imageUrls) : null;

      console.log("[comment] imageUrls:", imageUrls);
      console.log("[comment] imagesJson:", imagesJson);

      const [result]: any = await pool.query(
        "INSERT INTO comments (post_id, user_id, content, images) VALUES (?, ?, ?, ?)",
        [postId, userId, content, imagesJson],
      );

      console.log("[comment] INSERT result:", result);

      const [checkResult] = await pool.query<any[]>(
        "SELECT images FROM comments WHERE id = ?",
        [result.insertId],
      );
      console.log("[comment] 数据库中存储的 images:", checkResult[0]?.images);

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
        c.images,
        c.created_at as createdAt, 
        c.updated_at as updatedAt
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
      `,
        [result.insertId],
      );

      const comment = newComment[0];
      if (comment.images) {
        if (Array.isArray(comment.images)) {
          // mysql2 已经自动解析了 JSON 字段
          comment.images = comment.images;
        } else if (typeof comment.images === "string") {
          try {
            comment.images = JSON.parse(comment.images);
            if (!Array.isArray(comment.images)) {
              comment.images = [];
            }
          } catch {
            comment.images = [];
          }
        }
      } else {
        comment.images = [];
      }

      res.status(201).json(comment);
    } catch (error: any) {
      if (error instanceof ApiError) {
        console.error("API错误:", error);
        return res.status(error.status).json({ error: error.message });
      }
      console.error("创建评论失败:", error);
      res.status(500).json({ error: "服务器错误" });
    }
  },
);

// 更新评论
router.put(
  "/:id",
  verifyToken,
  commentUpload.array("images", 9),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { content, removeImages } = req.body;
      const files = req.files as Express.Multer.File[];
      const userId = req.user!.id;

      const [rows] = await pool.query<any[]>(
        "SELECT * FROM comments WHERE id = ? AND user_id = ?",
        [id, userId],
      );

      if (rows.length === 0) {
        throw new ApiError(404, "评论不存在或无权限修改");
      }

      const existingComment = rows[0];
      let existingImages: string[] = [];
      if (existingComment.images) {
        if (Array.isArray(existingComment.images)) {
          existingImages = existingComment.images;
        } else if (typeof existingComment.images === "string") {
          existingImages = JSON.parse(existingComment.images);
        }
      }

      const removedImages = removeImages ? JSON.parse(removeImages) : [];
      const remainingImages = existingImages.filter(
        (img) => !removedImages.includes(img),
      );

      const newImageUrls =
        files?.map((file) => `/uploads/comments/${file.filename}`) || [];
      const allImages = [...remainingImages, ...newImageUrls];
      const imagesJson =
        allImages.length > 0 ? JSON.stringify(allImages) : null;

      if (!content && allImages.length === 0) {
        throw new ApiError(400, "缺少评论内容或图片");
      }

      await pool.query(
        "UPDATE comments SET content = ?, images = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [content, imagesJson, id],
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
        c.images,
        c.created_at as createdAt, 
        c.updated_at as updatedAt
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
      `,
        [id],
      );

      const comment = updatedComment[0];
      if (comment.images) {
        if (Array.isArray(comment.images)) {
          comment.images = comment.images;
        } else if (typeof comment.images === "string") {
          try {
            comment.images = JSON.parse(comment.images);
            if (!Array.isArray(comment.images)) {
              comment.images = [];
            }
          } catch {
            comment.images = [];
          }
        }
      } else {
        comment.images = [];
      }

      res.json(comment);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "服务器错误" });
    }
  },
);

// 删除评论
router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole === "author") {
      await pool.query("DELETE FROM comments WHERE id = ?", [id]);
      res.json({ message: "删除成功" });
      return;
    }

    const [rows] = await pool.query<any[]>(
      "SELECT * FROM comments WHERE id = ? AND user_id = ?",
      [id, userId],
    );

    if (rows.length === 0) {
      throw new ApiError(404, "评论不存在或无权限删除");
    }

    await pool.query("DELETE FROM comments WHERE id = ?", [id]);

    res.json({ message: "删除成功" });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "服务器错误" });
  }
});

// 点赞评论
router.post("/:id/like", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await pool.query(
      "INSERT IGNORE INTO comment_likes (comment_id, user_id) VALUES (?, ?)",
      [id, userId],
    );

    const [result] = await pool.query<any[]>(
      "SELECT COUNT(*) as likeCount FROM comment_likes WHERE comment_id = ?",
      [id],
    );

    res.json({ likeCount: result[0].likeCount, liked: true });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "服务器错误" });
  }
});

// 取消点赞
router.delete("/:id/like", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await pool.query(
      "DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?",
      [id, userId],
    );

    const [result] = await pool.query<any[]>(
      "SELECT COUNT(*) as likeCount FROM comment_likes WHERE comment_id = ?",
      [id],
    );

    res.json({ likeCount: result[0].likeCount, liked: false });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "服务器错误" });
  }
});

// 获取评论的回复
router.get(
  "/:id/replies",
  optionalVerifyToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const [rows] = await pool.query<any[]>(
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
        cr.images,
        cr.created_at as createdAt, 
        cr.updated_at as updatedAt,
        COALESCE(r.like_count, 0) as likeCount,
        CASE WHEN ul.reply_id IS NOT NULL THEN 1 ELSE 0 END as liked
      FROM comment_replies cr
      JOIN users u ON cr.user_id = u.id
      LEFT JOIN users ru ON cr.reply_to_user_id = ru.id
      LEFT JOIN (
        SELECT reply_id, COUNT(*) as like_count
        FROM comment_reply_likes
        GROUP BY reply_id
      ) r ON cr.id = r.reply_id
      LEFT JOIN comment_reply_likes ul ON cr.id = ul.reply_id AND ul.user_id = ?
      WHERE cr.comment_id = ?
      ORDER BY cr.created_at ASC
    `,
        [userId || null, id],
      );

      const replies = rows.map((row) => {
        let images: string[] = [];
        if (row.images) {
          if (Array.isArray(row.images)) {
            images = row.images;
          } else if (typeof row.images === "string") {
            try {
              images = JSON.parse(row.images);
              if (!Array.isArray(images)) {
                images = [];
              }
            } catch {
              images = [];
            }
          }
        }
        return {
          ...row,
          images,
        };
      });

      res.json(replies);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "服务器错误" });
    }
  },
);

// 回复评论
router.post(
  "/:id/replies",
  verifyToken,
  commentUpload.array("images", 9),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { content, replyToUserId } = req.body;
      const files = req.files as Express.Multer.File[];
      const userId = req.user!.id;

      if (!content && (!files || files.length === 0)) {
        throw new ApiError(400, "缺少回复内容或图片");
      }

      const imageUrls =
        files?.map((file) => `/uploads/comments/${file.filename}`) || [];
      const imagesJson =
        imageUrls.length > 0 ? JSON.stringify(imageUrls) : null;

      const [result]: any = await pool.query(
        "INSERT INTO comment_replies (comment_id, user_id, reply_to_user_id, content, images) VALUES (?, ?, ?, ?, ?)",
        [id, userId, replyToUserId || null, content, imagesJson],
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
        cr.images,
        cr.created_at as createdAt, 
        cr.updated_at as updatedAt,
        COALESCE(r.like_count, 0) as likeCount
      FROM comment_replies cr
      JOIN users u ON cr.user_id = u.id
      LEFT JOIN users ru ON cr.reply_to_user_id = ru.id
      LEFT JOIN (
        SELECT reply_id, COUNT(*) as like_count
        FROM comment_reply_likes
        GROUP BY reply_id
      ) r ON cr.id = r.reply_id
      WHERE cr.id = ?
    `,
        [replyId],
      );

      const reply = replies[0];
      if (reply.images) {
        if (Array.isArray(reply.images)) {
          reply.images = reply.images;
        } else if (typeof reply.images === "string") {
          try {
            reply.images = JSON.parse(reply.images);
            if (!Array.isArray(reply.images)) {
              reply.images = [];
            }
          } catch {
            reply.images = [];
          }
        }
      } else {
        reply.images = [];
      }

      res.status(201).json(reply);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "服务器错误" });
    }
  },
);

// 回复点赞
router.post(
  "/replies/:id/like",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await pool.query(
        "INSERT IGNORE INTO comment_reply_likes (reply_id, user_id) VALUES (?, ?)",
        [id, userId],
      );

      const [result] = await pool.query<any[]>(
        "SELECT COUNT(*) as likeCount FROM comment_reply_likes WHERE reply_id = ?",
        [id],
      );

      res.json({ likeCount: result[0].likeCount, liked: true });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "服务器错误" });
    }
  },
);

// 回复取消点赞
router.delete(
  "/replies/:id/like",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await pool.query(
        "DELETE FROM comment_reply_likes WHERE reply_id = ? AND user_id = ?",
        [id, userId],
      );

      const [result] = await pool.query<any[]>(
        "SELECT COUNT(*) as likeCount FROM comment_reply_likes WHERE reply_id = ?",
        [id],
      );

      res.json({ likeCount: result[0].likeCount, liked: false });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "服务器错误" });
    }
  },
);

// 更新回复
router.put(
  "/replies/:id",
  verifyToken,
  commentUpload.array("images", 9),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { content, removeImages } = req.body;
      const files = req.files as Express.Multer.File[];
      const userId = req.user!.id;
      const userRole = req.user!.role;

      if (userRole !== "author") {
        const [rows] = await pool.query<any[]>(
          "SELECT * FROM comment_replies WHERE id = ? AND user_id = ?",
          [id, userId],
        );

        if (rows.length === 0) {
          throw new ApiError(404, "回复不存在或无权限修改");
        }
      }

      const [existingRows] = await pool.query<any[]>(
        "SELECT * FROM comment_replies WHERE id = ?",
        [id],
      );
      const existingReply = existingRows[0];
      let existingImages: string[] = [];
      if (existingReply.images) {
        if (Array.isArray(existingReply.images)) {
          existingImages = existingReply.images;
        } else if (typeof existingReply.images === "string") {
          existingImages = JSON.parse(existingReply.images);
        }
      }

      const removedImages = removeImages ? JSON.parse(removeImages) : [];
      const remainingImages = existingImages.filter(
        (img) => !removedImages.includes(img),
      );

      const newImageUrls =
        files?.map((file) => `/uploads/comments/${file.filename}`) || [];
      const allImages = [...remainingImages, ...newImageUrls];
      const imagesJson =
        allImages.length > 0 ? JSON.stringify(allImages) : null;

      if (!content && allImages.length === 0) {
        throw new ApiError(400, "缺少回复内容或图片");
      }

      await pool.query(
        "UPDATE comment_replies SET content = ?, images = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [content, imagesJson, id],
      );

      const [updatedReply] = await pool.query<any[]>(
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
        cr.images,
        cr.created_at as createdAt, 
        cr.updated_at as updatedAt,
        COALESCE(r.like_count, 0) as likeCount
      FROM comment_replies cr
      JOIN users u ON cr.user_id = u.id
      LEFT JOIN users ru ON cr.reply_to_user_id = ru.id
      LEFT JOIN (
        SELECT reply_id, COUNT(*) as like_count
        FROM comment_reply_likes
        GROUP BY reply_id
      ) r ON cr.id = r.reply_id
      WHERE cr.id = ?
      `,
        [id],
      );

      const reply = updatedReply[0];
      if (reply.images) {
        if (Array.isArray(reply.images)) {
          reply.images = reply.images;
        } else if (typeof reply.images === "string") {
          try {
            reply.images = JSON.parse(reply.images);
            if (!Array.isArray(reply.images)) {
              reply.images = [];
            }
          } catch {
            reply.images = [];
          }
        }
      } else {
        reply.images = [];
      }

      res.json(reply);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "服务器错误" });
    }
  },
);

// 删除回复
router.delete(
  "/replies/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      if (userRole === "author") {
        await pool.query("DELETE FROM comment_replies WHERE id = ?", [id]);
        res.json({ message: "删除成功" });
        return;
      }

      const [rows] = await pool.query<any[]>(
        "SELECT * FROM comment_replies WHERE id = ? AND user_id = ?",
        [id, userId],
      );

      if (rows.length === 0) {
        throw new ApiError(404, "回复不存在或无权限删除");
      }

      await pool.query("DELETE FROM comment_replies WHERE id = ?", [id]);

      res.json({ message: "删除成功" });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "服务器错误" });
    }
  },
);

export default router;
