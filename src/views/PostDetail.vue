<template>
  <el-container class="post-detail-container">
    <!-- 固定导航栏 -->
    <div class="fixed-navbar">
      <div class="navbar-content">
        <el-button class="back-button" @click="handleBack" plain>
          <el-icon><ArrowLeft /></el-icon>
          <span>返回</span>
        </el-button>
        <h2 class="navbar-title">{{ post ? post.title : "文章详情" }}</h2>
        <div class="navbar-placeholder"></div>
      </div>
    </div>
    <el-main>
      <div class="post-detail">
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
              <el-icon class="el-icon--left"><ArrowLeft /></el-icon>
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
  console.log("点击返回按钮");
  router.push("/");
};

onMounted(() => {
  // 滚动到页面顶部
  window.scrollTo(0, 0);
  loadPost();
});
</script>

<style scoped>
.post-detail-container {
  min-height: calc(100vh - 60px);
  position: relative;
}

/* 固定导航栏 */
.fixed-navbar {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}

.dark .fixed-navbar {
  background-color: rgba(26, 26, 26, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.navbar-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #409eff;
  border-color: #409eff;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #ecf5ff;
  border-color: #66b1ff;
  color: #66b1ff;
}

.dark .back-button {
  color: #409eff;
  border-color: #409eff;
}

.dark .back-button:hover {
  background-color: rgba(64, 158, 255, 0.1);
  border-color: #66b1ff;
  color: #66b1ff;
}

.navbar-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  text-align: center;
  margin: 0 1rem;
}

.dark .navbar-title {
  color: #e0e0e0;
}

.navbar-placeholder {
  width: 80px;
}

.post-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 80px 1rem 2rem;
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
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.post-card:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12) !important;
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.dark .post-header {
  background: linear-gradient(135deg, #1f2329 0%, #2a2e35 100%);
  border-bottom-color: #303030;
}

.post-title {
  font-size: 2.2rem;
  margin: 0 0 1rem 0;
  color: #333;
  transition: all 0.3s ease;
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-align: center;
  width: 100%;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .post-title {
    font-size: 1.8rem;
    padding: 0 0.5rem;
  }
}

.dark .post-title {
  color: #e0e0e0;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #666;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.post-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f8f9fa;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.post-reading-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f8f9fa;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .post-meta {
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
  }

  .post-date,
  .post-reading-time {
    width: 100%;
    justify-content: center;
  }
}

.dark .post-meta {
  color: #909399;
}

.dark .post-date,
.dark .post-reading-time {
  background-color: #303030;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.post-body {
  line-height: 1.8;
  color: #333;
  margin: 2rem 0;
  transition: color 0.3s ease;
  font-size: 1.05rem;
  padding: 0 1.5rem;
}

.post-body h2 {
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #333;
  transition: color 0.3s ease;
  font-weight: 700;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid #409eff;
  position: relative;
}

.post-body h2::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 80px;
  height: 2px;
  background-color: #409eff;
  border-radius: 2px;
}

.post-body h3 {
  margin-top: 2.5rem;
  margin-bottom: 1.2rem;
  font-size: 1.5rem;
  color: #333;
  transition: color 0.3s ease;
  font-weight: 600;
  padding-left: 1rem;
  border-left: 4px solid #409eff;
}

.post-body p {
  margin-bottom: 1.8rem;
  text-align: justify;
  line-height: 1.8;
}

.post-body code {
  background-color: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: "Courier New", Courier, monospace;
  font-size: 0.9em;
  color: #e74c3c;
}

.post-body pre {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 2rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #409eff;
}

.post-body pre code {
  background-color: transparent;
  padding: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #333;
}

.post-body ul,
.post-body ol {
  margin: 1.5rem 0;
  padding-left: 2.5rem;
}

.post-body ul {
  list-style-type: disc;
}

.post-body ol {
  list-style-type: decimal;
}

.post-body li {
  margin-bottom: 0.8rem;
  line-height: 1.7;
  position: relative;
}

.post-body li::marker {
  color: #409eff;
  font-weight: 600;
}

.post-body img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 2rem auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: block;
}

/* 引用样式 */
.post-body blockquote {
  border-left: 4px solid #409eff;
  margin: 2rem 0;
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: #666;
}

/* 分隔线样式 */
.post-body hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, #409eff, transparent);
  margin: 3rem 0;
}

/* 表格样式 */
.post-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.post-body th,
.post-body td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.post-body th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.post-body tr:hover {
  background-color: #f8f9fa;
}

/* 暗黑模式样式 */
.dark .post-body {
  color: #e0e0e0;
}

.dark .post-body h2 {
  color: #e0e0e0;
  border-bottom-color: #409eff;
}

.dark .post-body h2::after {
  background-color: #409eff;
}

.dark .post-body h3 {
  color: #e0e0e0;
  border-left-color: #409eff;
}

.dark .post-body code {
  background-color: #303030;
  color: #ff7675;
}

.dark .post-body pre {
  background-color: #303030;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border-left-color: #409eff;
}

.dark .post-body pre code {
  color: #e0e0e0;
}

.dark .post-body blockquote {
  background-color: #303030;
  color: #b0b0b0;
}

.dark .post-body hr {
  background: linear-gradient(to right, transparent, #409eff, transparent);
}

.dark .post-body table {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark .post-body th {
  background-color: #303030;
  color: #e0e0e0;
}

.dark .post-body td {
  border-bottom-color: #404040;
}

.dark .post-body tr:hover {
  background-color: #303030;
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

  .navbar-content {
    padding: 0.8rem 1rem;
  }

  .navbar-title {
    font-size: 0.9rem;
  }

  .back-button {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
