<template>
  <el-container class="post-detail-container">
    <el-main>
      <div class="post-detail">
        <el-page-header
          class="page-header"
          @back="handleBack"
          content="文章详情"
        />
        <el-card v-if="post" class="post-card" shadow="hover">
          <template #header>
            <div class="post-header">
              <h1 class="post-title">{{ post.title }}</h1>
              <el-tag size="small" type="info">{{
                formatDate(post.date)
              }}</el-tag>
            </div>
          </template>
          <div class="post-body" v-html="post.content"></div>
          <div class="post-footer">
            <el-button class="back-btn" @click="handleBack">
              <el-icon class="el-icon--left"><arrow-left /></el-icon>
              返回列表
            </el-button>
          </div>
        </el-card>
        <el-skeleton :rows="10" animated v-else />
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPostMetadata, parseMarkdown } from "../utils/markdown.js";
import { ArrowLeft } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const post = ref(null);

const loadPost = async () => {
  try {
    const postId = route.params.id;
    const postModules = import.meta.glob("../assets/posts/*.md", {
      as: "raw",
      eager: true,
    });

    const postPath = Object.keys(postModules).find((path) =>
      path.includes(postId),
    );

    if (!postPath) {
      throw new Error("文章不存在");
    }

    const content = postModules[postPath];
    const metadata = getPostMetadata(content);

    post.value = {
      title: metadata.title,
      date: metadata.date,
      content: parseMarkdown(metadata.content),
    };
  } catch (error) {
    console.error("加载文章失败:", error);
    post.value = {
      title: "加载失败",
      date: new Date().toISOString(),
      content: "<p>文章加载失败，请检查控制台错误信息。</p>",
    };
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const handleBack = () => {
  router.push("/");
};

onMounted(() => {
  loadPost();
});
</script>

<style scoped>
.post-detail-container {
  min-height: calc(100vh - 60px);
}

.post-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  margin-bottom: 2rem;
}

.post-card {
  transition: box-shadow 0.3s ease;
}

.post-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.post-title {
  font-size: 1.8rem;
  margin: 0;
  flex: 1;
  color: #333;
  transition: color 0.3s ease;
}

.post-body {
  line-height: 1.8;
  color: #333;
  margin: 1rem 0;
  transition: color 0.3s ease;
}

.post-body h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333;
  transition: color 0.3s ease;
}

.post-body p {
  margin-bottom: 1rem;
}

.post-body code {
  background-color: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: "Courier New", Courier, monospace;
}

.post-body pre {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.post-body pre code {
  background-color: transparent;
  padding: 0;
}

.post-body ul,
.post-body ol {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.post-body li {
  margin-bottom: 0.5rem;
}

/* 暗黑模式 */
.dark .post-title {
  color: #e0e0e0;
}

.dark .post-body {
  color: #e0e0e0;
}

.dark .post-body h2 {
  color: #e0e0e0;
}

.dark .post-body code {
  background-color: #303030;
  color: #e0e0e0;
}

.dark .post-body pre {
  background-color: #303030;
}

.dark .post-body pre code {
  color: #e0e0e0;
}

.dark .post-body ul,
.dark .post-body ol {
  color: #e0e0e0;
}

.dark .post-body li {
  color: #e0e0e0;
}

.post-footer {
  margin-top: 2rem;
  text-align: center;
}

.back-btn {
  background-color: #f5f5f5;
  border-color: #dcdcdc;
  color: #666;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}
</style>
