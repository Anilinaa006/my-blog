import { Router, type Router as RouterType } from "express";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { z } from "zod";
import env from "../env";
import { pool } from "../db";
import { ApiError } from "../utils/errors";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middleware/auth";
import { upload } from "../utils/upload";

const router: RouterType = Router();

const registerBody = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(72),
  role: z.enum(['user', 'author']).optional().default('user'),
});

router.post(
  "/register",
  upload.single("avatar"),
  asyncHandler(async (req, res) => {
    const body = registerBody.parse(req.body);

    const [existing] = await pool.query<any[]>(
      "SELECT id FROM users WHERE username = ? LIMIT 1",
      [body.username]
    );
    if (existing.length > 0) throw new ApiError(409, "用户名已存在");

    const passwordHash = await bcrypt.hash(body.password, 10);
    
    const avatarUrl = req.file ? `/uploads/avatars/${req.file.filename}` : null;
    
    const [result]: any = await pool.query(
      "INSERT INTO users (username, password_hash, role, avatar_url) VALUES (?, ?, ?, ?)",
      [body.username, passwordHash, body.role, avatarUrl]
    );

    const userId = result.insertId as number;
    const token = sign(
      { sub: userId, username: body.username, role: body.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return res.json({
      token,
      user: { id: userId, username: body.username, avatarUrl, role: body.role }
    });
  })
);

const loginBody = registerBody;

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const body = loginBody.parse(req.body);

    const [rows] = await pool.query<any[]>(
      "SELECT id, password_hash, avatar_url, role FROM users WHERE username = ? LIMIT 1",
      [body.username]
    );
    const user = rows[0];
    if (!user) throw new ApiError(401, "用户名或密码错误");

    const ok = await bcrypt.compare(body.password, user.password_hash);
    if (!ok) throw new ApiError(401, "用户名或密码错误");

    const token = sign(
      { sub: user.id as number, username: body.username, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return res.json({
      token,
      user: { 
        id: user.id as number, 
        username: body.username,
        avatarUrl: user.avatar_url || null,
        role: user.role || 'user'
      }
    });
  })
);

// 获取当前用户信息
router.get(
  "/me",
  verifyToken,
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    const [rows] = await pool.query<any[]>(
      "SELECT id, username, avatar_url, role, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      throw new ApiError(404, "用户不存在");
    }

    const user = rows[0];
    return res.json({
      id: user.id,
      username: user.username,
      avatarUrl: user.avatar_url,
      role: user.role || 'user',
      createdAt: user.created_at
    });
  })
);

// 上传头像
router.post(
  "/avatar",
  verifyToken,
  upload.single("avatar"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "请选择图片文件");
    }

    const userId = req.user!.id;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // 更新用户头像URL
    await pool.query(
      "UPDATE users SET avatar_url = ? WHERE id = ?",
      [avatarUrl, userId]
    );

    return res.json({
      avatarUrl,
      message: "头像上传成功"
    });
  })
);

// 修改密码
router.post(
  "/change-password",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user!.id;

    if (!oldPassword || !newPassword) {
      throw new ApiError(400, "请填写旧密码和新密码");
    }

    if (newPassword.length < 8) {
      throw new ApiError(400, "新密码至少需要8个字符");
    }

    // 获取当前密码哈希
    const [rows] = await pool.query<any[]>(
      "SELECT password_hash FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      throw new ApiError(404, "用户不存在");
    }

    const user = rows[0];

    // 验证旧密码
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isOldPasswordValid) {
      throw new ApiError(400, "旧密码不正确");
    }

    // 检查新密码是否与旧密码相同
    const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
    if (isSamePassword) {
      throw new ApiError(400, "新密码不能与旧密码相同");
    }

    // 更新密码
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE users SET password_hash = ? WHERE id = ?",
      [newPasswordHash, userId]
    );

    return res.json({
      message: "密码修改成功"
    });
  })
);

const isAuthor = async (userId: number): Promise<boolean> => {
  const [rows] = await pool.query<any[]>(
    "SELECT role FROM users WHERE id = ?",
    [userId]
  );
  return rows.length > 0 && rows[0].role === 'author';
};

router.get(
  "/author",
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query<any[]>(
      "SELECT id, username, avatar_url as avatarUrl, created_at as createdAt FROM users WHERE role = 'author' LIMIT 1"
    );

    if (rows.length === 0) {
      return res.json(null);
    }

    return res.json(rows[0]);
  })
);

router.get(
  "/users",
  verifyToken,
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    if (!await isAuthor(userId)) {
      throw new ApiError(403, "权限不足");
    }

    const [rows] = await pool.query<any[]>(
      "SELECT id, username, role, avatar_url as avatarUrl, created_at as createdAt FROM users ORDER BY created_at DESC"
    );

    return res.json(rows);
  })
);

router.delete(
  "/users/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    if (!await isAuthor(userId)) {
      throw new ApiError(403, "权限不足");
    }

    const targetId = parseInt(req.params.id);
    if (isNaN(targetId)) {
      throw new ApiError(400, "无效的用户ID");
    }

    if (targetId === userId) {
      throw new ApiError(400, "不能删除自己");
    }

    const [result]: any = await pool.query(
      "DELETE FROM users WHERE id = ?",
      [targetId]
    );

    if (result.affectedRows === 0) {
      throw new ApiError(404, "用户不存在");
    }

    return res.json({
      message: "用户删除成功"
    });
  })
);

export default router;

