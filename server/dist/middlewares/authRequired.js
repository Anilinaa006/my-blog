"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRequired = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const env_1 = require("../env");
const errors_1 = require("../utils/errors");
const extractToken = (req) => {
    const header = req.header("Authorization");
    if (!header)
        return null;
    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token)
        return null;
    return token;
};
const authRequired = (req, _res, next) => {
    try {
        const token = extractToken(req);
        if (!token)
            throw new errors_1.ApiError(401, "未登录");
        const decoded = (0, jsonwebtoken_1.verify)(token, env_1.env.JWT_SECRET);
        if (!decoded.username)
            throw new errors_1.ApiError(401, "未登录或 token 无效");
        const user = { id: decoded.sub, username: decoded.username };
        req.user = user;
        next();
    }
    catch (e) {
        next(new errors_1.ApiError(401, "未登录或 token 无效"));
    }
};
exports.authRequired = authRequired;
