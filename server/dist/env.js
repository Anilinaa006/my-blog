"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 给 process.env 加类型断言，解决 TS 类型报错
const env = {
    PORT: process.env.PORT || 3001,
    JWT_SECRET: process.env.JWT_SECRET || "change_me_to_a_long_random_string",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    DB_HOST: process.env.DB_HOST || "127.0.0.1",
    DB_PORT: Number(process.env.DB_PORT) || 3306,
    DB_USER: process.env.DB_USER || "root",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_NAME: process.env.DB_NAME || "my-blog",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173"
};
exports.default = env;
//# sourceMappingURL=env.js.map