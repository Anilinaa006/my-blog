<template>
  <div class="post-list">
    <el-card
      v-for="(post, index) in posts"
      :key="post.id"
      class="post-card"
      shadow="hover"
    >
      <template #header>
        <div class="post-header">
          <div class="post-badge-row">
            <span class="post-index">0{{ index + 1 }}</span>
            <el-tag effect="plain" round class="category-tag">
              {{ formatCategory(post.categories) }}
            </el-tag>
          </div>
          <h2 class="post-title">
            <router-link :to="`/post/${post.id}`">{{ post.title }}</router-link>
          </h2>
        </div>
      </template>

      <div class="post-meta">
        <span class="meta-pill">{{ formatDate(post.date) }}</span>
        <span class="meta-pill">阅读 {{ Math.ceil(post.contentLength / 500) }} 分钟</span>
      </div>

      <div class="post-excerpt" v-if="post.excerpt">
        {{ post.excerpt }}
      </div>

      <div class="post-footer">
        <router-link :to="`/post/${post.id}`" class="read-more">
          <el-button type="primary" size="small" :plain="!isDark">
            阅读更多
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </router-link>
      </div>
    </el-card>

    <div v-if="posts.length === 0" class="empty-state">
      <el-empty description="暂无文章" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";

interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  contentLength: number;
  categories: string;
}

defineProps<{
  posts: Post[];
}>();

const isDark = ref(false);

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCategory = (category: string): string => {
  const labelMap: Record<string, string> = {
    Vue: "Vue.js",
    维尤: "Vue.js",
    React: "React.js",
  };

  return labelMap[category] ?? category;
};

const checkDarkMode = (): void => {
  isDark.value = document.documentElement.classList.contains("dark");
};

onMounted(() => {
  checkDarkMode();
  window.addEventListener("resize", checkDarkMode);
});

watch(
  () => document.documentElement.classList.contains("dark"),
  (newValue) => {
    isDark.value = newValue;
  },
);
</script>

<style scoped>
.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.post-card {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid #e6edf7;
  background:
    radial-gradient(circle at top right, rgba(64, 158, 255, 0.08), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(250, 252, 255, 0.98));
  box-shadow: 0 18px 38px rgba(84, 108, 147, 0.1);
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease;
}

.post-card::before {
  content: "";
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #409eff, #36cfc9);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.post-card:hover {
  transform: translateY(-8px);
  border-color: #cfe3ff;
  box-shadow: 0 24px 50px rgba(60, 96, 160, 0.16) !important;
}

.post-card:hover::before {
  opacity: 1;
}

.post-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-badge-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.post-index {
  color: #b3bfd3;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.category-tag {
  border-color: rgba(64, 158, 255, 0.2);
  color: #2f6fd7;
  background: rgba(64, 158, 255, 0.08);
}

.post-title {
  margin: 0;
  font-size: 1.32rem;
  line-height: 1.45;
  font-weight: 700;
}

.post-title a {
  display: block;
  color: #1d2740;
  text-decoration: none;
  transition: color 0.3s ease, transform 0.3s ease;
}

.post-title a:hover {
  color: #409eff;
  transform: translateX(4px);
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-bottom: 1rem;
}

.meta-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  background: #f4f7fb;
  color: #66748a;
  font-size: 0.84rem;
}

.post-excerpt {
  color: #556176;
  line-height: 1.85;
  font-size: 0.96rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 7.2em;
}

.post-footer {
  margin-top: 1.6rem;
  text-align: right;
}

.read-more {
  display: inline-block;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.read-more:hover {
  transform: translateY(-2px);
}

.empty-state {
  grid-column: 1 / -1;
  padding: 6rem 0;
  display: flex;
  justify-content: center;
}

.empty-state .el-empty {
  transform: scale(1.12);
}

.dark .post-card {
  border-color: #344056 !important;
  background:
    radial-gradient(circle at top right, rgba(64, 158, 255, 0.12), transparent 30%),
    linear-gradient(180deg, rgba(27, 34, 47, 0.98), rgba(21, 26, 36, 0.98)) !important;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
}

.dark .post-card .el-card__header,
.dark .post-card .el-card__body {
  background: transparent !important;
}

.dark .post-index {
  color: #6f7d93;
}

.dark .category-tag {
  color: #8fc5ff;
  background: rgba(64, 158, 255, 0.12);
  border-color: rgba(64, 158, 255, 0.18);
}

.dark .post-title a {
  color: #ecf2ff;
}

.dark .post-excerpt {
  color: #aab4c7;
}

.dark .meta-pill {
  background: rgba(40, 48, 63, 0.95);
  color: #b5bfd2;
}

@media (max-width: 767px) {
  .post-list {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }

  .post-card {
    border-radius: 18px;
  }

  .post-title {
    font-size: 1.15rem;
  }

  .post-excerpt {
    min-height: auto;
    -webkit-line-clamp: 3;
    font-size: 0.92rem;
  }
}
</style>
