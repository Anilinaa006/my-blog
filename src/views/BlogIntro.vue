<template>
  <el-container class="blog-intro-container">
    <el-main>
      <section class="intro-page">
        <div class="intro-hero">
          <div class="hero-copy">
            <span class="section-kicker">Blog Intro</span>
            <h1>一个持续更新的前端学习库</h1>
            <p>
              这里记录我学习前端时整理出的文章、问题复盘和项目实践。它不是一次性完成的展示页，
              而是一个会随着学习进度不断更新的知识空间。
            </p>
          </div>
          <div class="hero-metrics">
            <div>
              <strong>Markdown</strong>
              <span>文章沉淀</span>
            </div>
            <div>
              <strong>Comment</strong>
              <span>交流反馈</span>
            </div>
            <div>
              <strong>Dark Mode</strong>
              <span>舒适阅读</span>
            </div>
          </div>
        </div>

        <div class="feature-layout">
          <article class="feature-card large-card">
            <span class="section-kicker">Features</span>
            <h2>博客现在支持什么</h2>
            <div class="feature-list">
              <div class="feature-item">
                <span>01</span>
                <p>Markdown 文章编写、解析和分类展示，适合沉淀系统性学习笔记。</p>
              </div>
              <div class="feature-item">
                <span>02</span>
                <p>文章筛选、发布时间排序、阅读时间估算，让内容更容易查找和浏览。</p>
              </div>
              <div class="feature-item">
                <span>03</span>
                <p>登录、注册、评论、回复和点赞，让文章不只是静态记录，也可以被讨论。</p>
              </div>
              <div class="feature-item">
                <span>04</span>
                <p>亮色 / 暗色模式和响应式布局，兼顾桌面端与移动端的阅读体验。</p>
              </div>
            </div>
          </article>

          <aside class="stack-card">
            <span class="section-kicker">Stack</span>
            <h2>技术栈</h2>
            <div class="stack-list">
              <span>Vue 3</span>
              <span>TypeScript</span>
              <span>Vue Router</span>
              <span>Element Plus</span>
              <span>Marked</span>
              <span>Vite</span>
              <span>Express</span>
              <span>MySQL</span>
            </div>
          </aside>
        </div>

        <div class="roadmap-card">
          <span class="section-kicker">Roadmap</span>
          <h2>接下来会继续优化</h2>
          <div class="roadmap-list">
            <div class="roadmap-item">
              <strong>搜索与标签</strong>
              <span>让文章可以按关键词、分类和标签更快定位。</span>
            </div>
            <div class="roadmap-item">
              <strong>阅读体验</strong>
              <span>补充文章目录、锚点跳转和相关文章推荐。</span>
            </div>
            <div class="roadmap-item">
              <strong>互动体验</strong>
              <span>继续打磨评论、回复、点赞和用户状态展示。</span>
            </div>
          </div>
        </div>
      </section>
    </el-main>
  </el-container>
</template>

<script setup>
</script>

<style scoped>
.blog-intro-container {
  min-height: calc(100vh - 60px);
  background:
    linear-gradient(135deg, rgba(250, 252, 255, 0.98), rgba(239, 246, 255, 0.96)),
    radial-gradient(circle at 16% 8%, rgba(64, 158, 255, 0.16), transparent 30%),
    radial-gradient(circle at 86% 14%, rgba(255, 138, 101, 0.14), transparent 28%);
}

.intro-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 3rem 1.25rem 4rem;
}

.intro-hero,
.feature-card,
.stack-card,
.roadmap-card {
  border: 1px solid rgba(221, 230, 244, 0.92);
  box-shadow: 0 24px 70px rgba(69, 89, 126, 0.13);
  backdrop-filter: blur(14px);
}

.intro-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  gap: 1.2rem;
  align-items: stretch;
  padding: 1.2rem;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.7);
}

.hero-copy {
  padding: 2rem;
  border-radius: 24px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(243, 248, 255, 0.9)),
    radial-gradient(circle at top right, rgba(54, 207, 201, 0.16), transparent 32%);
}

.section-kicker {
  color: #2e7bd8;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-copy h1 {
  max-width: 780px;
  margin: 0.7rem 0 1rem;
  color: #162136;
  font-size: clamp(2.3rem, 5vw, 4rem);
  font-weight: 850;
  line-height: 1.08;
  letter-spacing: 0;
}

.hero-copy p {
  max-width: 800px;
  margin: 0;
  color: #5d6b84;
  line-height: 1.9;
}

.hero-metrics {
  display: grid;
  gap: 0.8rem;
}

.hero-metrics div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 96px;
  padding: 1rem;
  border-radius: 22px;
  background: linear-gradient(135deg, #409eff, #36cfc9);
  color: #fff;
}

.hero-metrics div:nth-child(2) {
  background: linear-gradient(135deg, #ff8a65, #ffbc6b);
}

.hero-metrics div:nth-child(3) {
  background: linear-gradient(135deg, #6c63ff, #409eff);
}

.hero-metrics strong {
  margin-bottom: 0.35rem;
  font-size: 1.25rem;
}

.hero-metrics span {
  opacity: 0.86;
}

.feature-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.8fr);
  gap: 1.2rem;
  margin-top: 1.2rem;
}

.feature-card,
.stack-card,
.roadmap-card {
  padding: 1.6rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
}

.feature-card h2,
.stack-card h2,
.roadmap-card h2 {
  margin: 0.55rem 0 1rem;
  color: #1d2a3f;
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: 0;
}

.feature-list {
  display: grid;
  gap: 0.85rem;
}

.feature-item {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 0.9rem;
  align-items: start;
  padding: 1rem;
  border: 1px solid #e6eef9;
  border-radius: 18px;
  background: #f7faff;
}

.feature-item span {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: #fff;
  color: #2181df;
  font-weight: 850;
  box-shadow: 0 10px 24px rgba(64, 158, 255, 0.12);
}

.feature-item p {
  margin: 0;
  color: #53627a;
  line-height: 1.75;
}

.stack-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.stack-list span {
  padding: 0.62rem 0.8rem;
  border: 1px solid #dbe7f6;
  border-radius: 999px;
  background: #f6f9ff;
  color: #48617f;
  font-weight: 700;
}

.roadmap-card {
  margin-top: 1.2rem;
}

.roadmap-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}

.roadmap-item {
  padding: 1rem;
  border: 1px solid #e6eef9;
  border-radius: 18px;
  background: #f7faff;
}

.roadmap-item strong {
  display: block;
  margin-bottom: 0.45rem;
  color: #21314a;
}

.roadmap-item span {
  color: #5f6d84;
  line-height: 1.7;
}

.dark .blog-intro-container {
  background:
    linear-gradient(135deg, #121722 0%, #151a24 52%, #10141c 100%),
    radial-gradient(circle at 16% 8%, rgba(64, 158, 255, 0.11), transparent 32%),
    radial-gradient(circle at 86% 14%, rgba(255, 138, 101, 0.1), transparent 30%);
}

.dark .intro-hero,
.dark .feature-card,
.dark .stack-card,
.dark .roadmap-card {
  border-color: rgba(70, 82, 104, 0.82);
  background: rgba(26, 32, 43, 0.88);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.34);
}

.dark .hero-copy {
  background:
    linear-gradient(135deg, rgba(35, 42, 56, 0.95), rgba(25, 31, 43, 0.9)),
    radial-gradient(circle at top right, rgba(54, 207, 201, 0.1), transparent 34%);
}

.dark .hero-copy h1,
.dark .feature-card h2,
.dark .stack-card h2,
.dark .roadmap-card h2,
.dark .roadmap-item strong {
  color: #eef3fb;
}

.dark .hero-copy p,
.dark .feature-item p,
.dark .roadmap-item span {
  color: #aab5c7;
}

.dark .section-kicker {
  color: #79bbff;
}

.dark .feature-item,
.dark .roadmap-item,
.dark .stack-list span {
  border-color: rgba(72, 84, 108, 0.86);
  background: rgba(38, 45, 60, 0.92);
}

.dark .feature-item span {
  background: rgba(22, 27, 37, 0.95);
  color: #79bbff;
}

.dark .stack-list span {
  color: #c4cedd;
}

@media (max-width: 900px) {
  .intro-hero,
  .feature-layout,
  .roadmap-list {
    grid-template-columns: 1fr;
  }

  .hero-metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .intro-page {
    padding: 2rem 0.9rem 3rem;
  }

  .intro-hero {
    padding: 0.8rem;
    border-radius: 24px;
  }

  .hero-copy,
  .feature-card,
  .stack-card,
  .roadmap-card {
    padding: 1.35rem;
    border-radius: 22px;
  }

  .hero-copy h1 {
    font-size: 2.05rem;
  }

  .hero-metrics {
    grid-template-columns: 1fr;
  }

  .feature-item {
    grid-template-columns: 1fr;
  }
}
</style>
