"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSchema = exports.pool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = __importDefault(require("./env"));
exports.pool = promise_1.default.createPool({
    host: env_1.default.DB_HOST,
    port: env_1.default.DB_PORT,
    user: env_1.default.DB_USER,
    password: env_1.default.DB_PASSWORD,
    database: env_1.default.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4"
});
const initSchema = async () => {
    // users: 注册用户
    await exports.pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
    // comments: 文章评论（post_id 由前端路由传入，不需要在 DB 中存文章本体）
    await exports.pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      post_id VARCHAR(255) NOT NULL,
      user_id BIGINT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NULL,
      CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_post_id (post_id),
      INDEX idx_user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};
exports.initSchema = initSchema;
//# sourceMappingURL=db.js.map