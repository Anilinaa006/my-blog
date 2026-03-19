<template>
  <el-container class="blog-intro-container">
    <el-main>
      <div class="blog-intro">
        <h2 class="page-title">博客介绍</h2>
        <el-card class="blog-intro-card" shadow="hover">
          <template #header>
            <div class="blog-intro-header">
              <h2 class="blog-intro-title">关于本博客</h2>
            </div>
          </template>
          <div class="blog-intro-content">
            <el-descriptions border :column="1">
              <el-descriptions-item label="博客功能">
                <ul class="feature-list">
                  <li>📝 支持 Markdown 格式文章</li>
                  <li>🌙 深色/浅色模式切换</li>
                  <li>📱 响应式设计，对移动端友好</li>
                  <li>🏷️ 文章分类筛选</li>
                  <li>📅 文章发布时间排序</li>
                  <li>⏱️ 阅读时间估算</li>
                  <li>🔍 简洁美观的界面</li>
                </ul>
              </el-descriptions-item>
              <el-descriptions-item label="技术栈">
                <ul class="tech-stack">
                  <li>Vue 3 + Composition API</li>
                  <li>Vue Router</li>
                  <li>Element Plus 组件库</li>
                  <li>Marked 用于 Markdown 解析</li>
                  <li>Vite 构建工具</li>
                </ul>
              </el-descriptions-item>
              <el-descriptions-item label="如何使用">
                <p>
                  1. 在 <code>src/assets/posts/</code> 目录下创建 Markdown 文件
                </p>
                <p>2. 每个 Markdown 文件需要包含以下 front matter：</p>
                <pre><code>---
title: 文章标题
date: 2026-01-01
categories: 分类
---</code></pre>
                <p>
                  3. 在 <code>Home.vue</code> 和
                  <code>PostDetail.vue</code> 中添加新文章的导入
                </p>
                <p>4. 运行 <code>npm run build</code> 构建项目</p>
              </el-descriptions-item>
              <el-descriptions-item label="未来计划">
                <ul class="future-plans">
                  <li>🔍 添加搜索功能</li>
                  <li>📊 添加文章统计</li>
                  <li>💬 添加评论系统</li>
                  <li>📚 添加标签系统</li>
                  <li>📱 优化移动端体验</li>
                  <li>🚀 持续更新新功能....</li>
                </ul>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
// 博客介绍页组件
</script>

<style scoped>
.blog-intro-container {
  min-height: calc(100vh - 60px);
}

.blog-intro {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 2rem;
  transition: color 0.3s ease;
}

.blog-intro-card {
  transition: box-shadow 0.3s ease;
}

.blog-intro-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.blog-intro-header {
  display: flex;
  align-items: center;
}

.blog-intro-title {
  font-size: 1.5rem;
  margin: 0;
  color: #333;
  transition: color 0.3s ease;
}

.blog-intro-content {
  line-height: 1.8;
  color: #333;
  transition: color 0.3s ease;
}

.feature-list,
.tech-stack,
.future-plans {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li,
.tech-stack li,
.future-plans li {
  margin-bottom: 0.8rem;
  padding-left: 1.5rem;
  position: relative;
}

.feature-list li::before,
.future-plans li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.5rem;
}

.blog-intro-content pre {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.blog-intro-content code {
  background-color: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: "Courier New", Courier, monospace;
  font-size: 0.9em;
}

/* 暗黑模式 */
.dark .page-title {
  color: #e0e0e0;
}

.dark .blog-intro-title {
  color: #e0e0e0;
}

.dark .blog-intro-content {
  color: #e0e0e0;
}

.dark .blog-intro-content pre {
  background-color: #303030;
}

.dark .blog-intro-content code {
  background-color: #303030;
  color: #e0e0e0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .blog-intro {
    padding: 1.5rem 1rem;
  }

  .page-title {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }

  .blog-intro-title {
    font-size: 1.3rem;
  }

  .blog-intro-content {
    font-size: 0.95rem;
  }

  .feature-list li,
  .tech-stack li,
  .future-plans li {
    margin-bottom: 0.6rem;
  }
}
</style>
