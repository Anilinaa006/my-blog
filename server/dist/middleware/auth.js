"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../env"));
const errors_1 = require("../utils/errors");
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new errors_1.ApiError(401, "缺少认证令牌");
        }
        const token = authHeader.slice(7);
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.JWT_SECRET);
        req.user = {
            id: decoded.sub,
            username: decoded.username
        };
        next();
    }
    catch (error) {
        if (error.name === "JsonWebTokenError") {
            throw new errors_1.ApiError(401, "无效的认证令牌");
        }
        if (error.name === "TokenExpiredError") {
            throw new errors_1.ApiError(401, "认证令牌已过期");
        }
        throw error;
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.js.map