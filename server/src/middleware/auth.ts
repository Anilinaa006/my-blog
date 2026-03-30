import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../env";
import { ApiError } from "../utils/errors";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
      };
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "缺少认证令牌");
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, env.JWT_SECRET) as unknown as {
      sub: number;
      username: string;
    };

    req.user = {
      id: decoded.sub,
      username: decoded.username
    };
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "无效的认证令牌");
    }
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "认证令牌已过期");
    }
    throw error;
  }
};