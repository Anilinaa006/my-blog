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
              <div class="post-meta">
                <div class="post-date">
                  <el-tag size="small" type="info">{{
                    formatDate(post.date)
                  }}</el-tag>
                </div>
                <div class="post-reading-time">
                  <el-icon><Timer /></el-icon>
                  <span
                    >{{ Math.ceil(post.contentLength / 500) }} 分钟阅读</span
                  >
                </div>
              </div>
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
import { getPostById } from "../utils/postLoader.js";
import { ArrowLeft, Timer } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const post = ref(null);

const loadPost = async () => {
  try {
    const postId = route.params.id;

    // 使用工具函数加载文章
    const content = await getPostById(postId);
    const metadata = getPostMetadata(content);

    post.value = {
      title: metadata.title,
      date: metadata.date,
      content: parseMarkdown(metadata.content),
      contentLength: metadata.content.length,
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
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.page-header .el-page-header__left {
  display: flex;
  align-items: center;
}

.page-header .el-page-header__back {
  font-size: 1rem;
  color: #666;
  transition: all 0.3s ease;
  margin-right: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
}

.page-header .el-page-header__back:hover {
  color: #409eff;
  background-color: #ecf5ff;
}

.page-header .el-page-header__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  transition: all 0.3s ease;
}

/* 暗黑模式 */
.dark .page-header {
  border-bottom: 1px solid #303030;
}

.dark .page-header .el-page-header__back {
  color: #c0c4cc;
}

.dark .page-header .el-page-header__back:hover {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}

.dark .page-header .el-page-header__title {
  color: #e0e0e0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header .el-page-header__title {
    font-size: 1.2rem;
  }
}

.post-card {
  transition: box-shadow 0.3s ease;
}

.post-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.post-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.post-title {
  font-size: 2.2rem;
  margin: 0 0 1rem 0;
  color: #333;
  transition: all 0.3s ease;
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.post-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.post-reading-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.post-body {
  line-height: 1.8;
  color: #333;
  margin: 2rem 0;
  transition: color 0.3s ease;
  font-size: 1.05rem;
}

.post-body h2 {
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #333;
  transition: color 0.3s ease;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.post-body h3 {
  margin-top: 2.5rem;
  margin-bottom: 1.2rem;
  font-size: 1.5rem;
  color: #333;
  transition: color 0.3s ease;
  font-weight: 600;
}

.post-body p {
  margin-bottom: 1.5rem;
  text-align: justify;
}

.post-body code {
  background-color: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: "Courier New", Courier, monospace;
  font-size: 0.9em;
}

.post-body pre {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.post-body pre code {
  background-color: transparent;
  padding: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.post-body ul,
.post-body ol {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.post-body li {
  margin-bottom: 0.8rem;
  line-height: 1.6;
}

.post-body img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 2rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.post-footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
  text-align: center;
}

.back-btn {
  background-color: #f5f5f5;
  border-color: #dcdcdc;
  color: #666;
  transition: all 0.3s ease;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
}

.back-btn:hover {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* 暗黑模式 */
.dark .post-header {
  border-bottom: 1px solid #303030;
}

.dark .post-title {
  color: #e0e0e0;
}

.dark .post-meta {
  color: #909399;
}

.dark .post-body {
  color: #e0e0e0;
}

.dark .post-body h2 {
  color: #e0e0e0;
  border-bottom: 1px solid #303030;
}

.dark .post-body h3 {
  color: #e0e0e0;
}

.dark .post-body code {
  background-color: #303030;
  color: #e0e0e0;
}

.dark .post-body pre {
  background-color: #303030;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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

.dark .post-footer {
  border-top: 1px solid #303030;
}

.dark .back-btn {
  background-color: #303030;
  border-color: #404040;
  color: #c0c4cc;
}

.dark .back-btn:hover {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .post-title {
    font-size: 1.8rem;
  }

  .post-body {
    font-size: 1rem;
  }

  .post-body h2 {
    font-size: 1.5rem;
  }

  .post-body h3 {
    font-size: 1.3rem;
  }

  .back-btn {
    padding: 0.5rem 1.2rem;
  }
}
</style>
