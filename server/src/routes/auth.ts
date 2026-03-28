import { Router } from "express";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { z } from "zod";
import { env } from "../env";
import { pool } from "../db";
import { ApiError } from "../utils/errors";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

const registerBody = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(72)
});

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const body = registerBody.parse(req.body);

    const [existing] = await pool.query<any[]>(
      "SELECT id FROM users WHERE username = ? LIMIT 1",
      [body.username]
    );
    if (existing.length > 0) throw new ApiError(409, "用户名已存在");

    const passwordHash = await bcrypt.hash(body.password, 10);
    const [result]: any = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES (?, ?)",
      [body.username, passwordHash]
    );

    const userId = result.insertId as number;
    const token = sign(
      { sub: userId, username: body.username },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return res.json({
      token,
      user: { id: userId, username: body.username }
    });
  })
);

const loginBody = registerBody;

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const body = loginBody.parse(req.body);

    const [rows] = await pool.query<any[]>(
      "SELECT id, password_hash FROM users WHERE username = ? LIMIT 1",
      [body.username]
    );
    const user = rows[0];
    if (!user) throw new ApiError(401, "用户名或密码错误");

    const ok = await bcrypt.compare(body.password, user.password_hash);
    if (!ok) throw new ApiError(401, "用户名或密码错误");

    const token = sign(
      { sub: user.id as number, username: body.username },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return res.json({
      token,
      user: { id: user.id as number, username: body.username }
    });
  })
);

export default router;

