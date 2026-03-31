import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ command }) => {
  const isVercel = Boolean(process.env.VERCEL);
  const isDev = command === "serve";

  return {
    plugins: [vue()],
    assetsInclude: ["**/*.md"],
    base: isDev ? "/" : isVercel ? "/" : "/my-blog/",
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
      },
    },
    optimizeDeps: {
      exclude: ["**/*.md"],
    },
  };
});
