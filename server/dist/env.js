"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load env from .env (if present) or let caller handle missing vars.
dotenv_1.default.config();
const mustGet = (key) => {
    const v = process.env[key];
    if (!v)
        throw new Error(`Missing env: ${key}`);
    return v;
};
exports.env = {
    PORT: Number(process.env.PORT ?? 3001),
    JWT_SECRET: mustGet("JWT_SECRET"),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
    DB_HOST: mustGet("DB_HOST"),
    DB_PORT: Number(process.env.DB_PORT ?? 3306),
    DB_USER: mustGet("DB_USER"),
    DB_PASSWORD: mustGet("DB_PASSWORD"),
    DB_NAME: mustGet("DB_NAME"),
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? "*"
};
