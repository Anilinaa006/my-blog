import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// 动态判断部署平台：Vercel 用根路径 '/'，GitHub Pages 用 '/my-blog/'
const base = process.env.VERCEL ? "/" : "/my-blog/";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  assetsInclude: ["**/*.md"], // 确保 Markdown 文件被正确打包
  optimizeDeps: {
    exclude: ["**/*.md"],
  },
  base: base, // 关键：动态适配部署路径
});
