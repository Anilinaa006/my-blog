import mysql from "mysql2/promise";
import env from "./env";

export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4"
});

export const initSchema = async () => {
  // users: 注册用户
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      avatar_url VARCHAR(255) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // comments: 文章评论（post_id 由前端路由传入，不需要在 DB 中存文章本体）
  await pool.query(`
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

  // comment_likes: 评论点赞
  await pool.query(`
    CREATE TABLE IF NOT EXISTS comment_likes (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      comment_id BIGINT NOT NULL,
      user_id BIGINT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_comment_likes_comment FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
      CONSTRAINT fk_comment_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY uk_comment_like (comment_id, user_id),
      INDEX idx_comment_likes_comment_id (comment_id),
      INDEX idx_comment_likes_user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // comment_replies: 评论回复
  await pool.query(`
    CREATE TABLE IF NOT EXISTS comment_replies (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      comment_id BIGINT NOT NULL,
      user_id BIGINT NOT NULL,
      reply_to_user_id BIGINT NULL,
      content TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NULL,
      CONSTRAINT fk_comment_replies_comment FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
      CONSTRAINT fk_comment_replies_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_comment_replies_reply_to FOREIGN KEY (reply_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_comment_replies_comment_id (comment_id),
      INDEX idx_comment_replies_user_id (user_id),
      INDEX idx_comment_replies_reply_to (reply_to_user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};
