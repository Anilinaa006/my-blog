import dotenv from "dotenv";

dotenv.config();

// 给 process.env 加类型断言，解决 TS 类型报错
const env = {
  PORT: (process.env.PORT as string) || 3001,
  JWT_SECRET: (process.env.JWT_SECRET as string) || "change_me_to_a_long_random_string",
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN as string) || "7d",
  DB_HOST: (process.env.DB_HOST as string) || "127.0.0.1",
  DB_PORT: Number(process.env.DB_PORT) || 3306,
  DB_USER: (process.env.DB_USER as string) || "root",
  DB_PASSWORD: (process.env.DB_PASSWORD as string) || "",
  DB_NAME: (process.env.DB_NAME as string) || "my-blog",
  CORS_ORIGIN: (process.env.CORS_ORIGIN as string) || "http://localhost:5173"
} as const;
export default env;
