<template>
  <el-container class="home-container">
    <el-main>
      <div class="home">
        <h2 class="page-title">文章列表</h2>
        <el-skeleton :rows="3" animated v-if="loading" />
        <PostList :posts="posts" v-else />
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PostList from "../components/PostList.vue";
import { getPostMetadata } from "../utils/markdown.js";

const posts = ref([]);
const loading = ref(true);

const loadPosts = async () => {
  try {
    // 手动导入文章列表
    const postModules = import.meta.glob("../assets/posts/*.md", {
      as: "raw",
      eager: true,
    });

    const postList = Object.entries(postModules).map(([path, content]) => {
      const metadata = getPostMetadata(content);
      const id = path.split("/").pop().replace(".md", "");
      return {
        id,
        title: metadata.title,
        date: metadata.date,
        excerpt: metadata.content.substring(0, 150) + "...",
        contentLength: metadata.content.length,
      };
    });

    posts.value = postList.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error("加载文章失败:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadPosts();
});
</script>

<style scoped>
.home-container {
  min-height: calc(100vh - 60px);
}

.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem;
}

.page-header {
  margin-bottom: 3rem;
  position: relative;
  padding-bottom: 1rem;
}

.page-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #409eff, #69c0ff);
  border-radius: 3px;
}

.page-header .el-page-header__content {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.dark .page-header .el-page-header__content {
  color: #e0e0e0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 3rem;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  position: relative;
  padding-bottom: 1rem;
}

.page-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #409eff, #69c0ff);
  border-radius: 3px;
}

.dark .page-title {
  color: #e0e0e0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home {
    padding: 2rem 1rem;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .page-header .el-page-header__content {
    font-size: 1.5rem;
  }
}
</style>
