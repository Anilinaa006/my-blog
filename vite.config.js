import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  assetsInclude: ["**/*.md"],
  optimizeDeps: {
    exclude: ["**/*.md"],
  },
  // 核心修改：改用相对路径（彻底解决子路径适配问题）
  base: "./",
});
