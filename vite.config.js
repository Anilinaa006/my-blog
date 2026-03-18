import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  assetsInclude: ["**/*.md"],
  optimizeDeps: {
    exclude: ["**/*.md"],
  },
  // 核心新增：指定 GitHub Pages 子路径（和仓库名一致）
  base: "/my-blog/",
});
