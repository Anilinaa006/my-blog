<template>
  <el-container class="home-container">
    <el-main>
      <div class="home">
        <section class="hero-section">
          <div class="hero-copy">
            <span class="hero-kicker">Frontend Diary</span>
            <h1 class="hero-title">把前端学习笔记整理成更舒服的阅读空间</h1>
            <p class="hero-description">
              这里收集 Vue、React、CSS、网络与工程化内容。希望它像一份持续更新的前端工作手记，清晰、耐读，也方便回看。
            </p>
          </div>
          <div class="hero-stats">
            <div class="stat-card">
              <span class="stat-label">文章数</span>
              <strong class="stat-value">{{ originalPosts.length }}</strong>
            </div>
            <div class="stat-card">
              <span class="stat-label">分类数</span>
              <strong class="stat-value">{{ categoryCount }}</strong>
            </div>
            <div class="stat-card">
              <span class="stat-label">预计阅读</span>
              <strong class="stat-value">{{ totalReadingHours }}</strong>
            </div>
          </div>
        </section>

        <section class="content-panel">
          <div class="page-header">
            <div class="title-group">
              <span class="section-tag">Latest Notes</span>
              <h2 class="page-title">文章列表</h2>
              <p class="page-subtitle">按分类和时间快速筛选，挑一篇继续读下去。</p>
            </div>
            <div class="filter-controls">
              <div class="category-filter">
                <span>类别</span>
                <el-select
                  v-model="selectedCategory"
                  @change="filterPosts"
                  size="small"
                >
                  <el-option label="全部" value="all" />
                  <el-option label="HTML" value="HTML" />
                  <el-option label="CSS" value="CSS" />
                  <el-option label="JS" value="JavaScript" />
                  <el-option label="Vue.js" value="Vue" />
                  <el-option label="React.js" value="React" />
                  <el-option label="网络" value="网络" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </div>
              <div class="sort-control">
                <span>排序</span>
                <el-select v-model="sortOrder" @change="sortPosts" size="small">
                  <el-option label="最新发布" value="desc" />
                  <el-option label="最早发布" value="asc" />
                </el-select>
              </div>
            </div>
          </div>
          <el-skeleton :rows="3" animated v-if="loading" />
          <PostList :posts="posts" v-else />
        </section>
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import PostList from "../components/PostList.vue";
import { getPostMetadata } from "../utils/markdown";
import { getAllPosts } from "../utils/postLoader";

const route = useRoute();

interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  contentLength: number;
  categories: string;
}

const posts = ref<Post[]>([]);
const originalPosts = ref<Post[]>([]);
const loading = ref(true);
const sortOrder = ref("desc");
const selectedCategory = ref("all");

const categoryCount = computed(() => {
  return new Set(originalPosts.value.map((post) => post.categories)).size;
});

const totalReadingHours = computed(() => {
  const totalMinutes = originalPosts.value.reduce((sum, post) => {
    return sum + Math.ceil(post.contentLength / 500);
  }, 0);

  return `${Math.max(1, Math.ceil(totalMinutes / 60))} 小时`;
});

const loadSavedSettings = (): void => {
  const savedCategory = localStorage.getItem("blogSelectedCategory");
  const savedSortOrder = localStorage.getItem("blogSortOrder");
  const categoryAliasMap: Record<string, string> = {
    缃戠粶: "网络",
    鍏朵粬: "其他",
    维尤: "Vue",
  };
  const validCategories = [
    "all",
    "HTML",
    "CSS",
    "JavaScript",
    "Vue",
    "React",
    "网络",
    "其他",
  ];

  const normalizedCategory = savedCategory
    ? (categoryAliasMap[savedCategory] ?? savedCategory)
    : null;

  if (normalizedCategory && validCategories.includes(normalizedCategory)) {
    selectedCategory.value = normalizedCategory;
  }

  if (savedSortOrder) {
    sortOrder.value = savedSortOrder;
  }
};

const saveSettings = (): void => {
  localStorage.setItem("blogSelectedCategory", selectedCategory.value);
  localStorage.setItem("blogSortOrder", sortOrder.value);
};

const saveScrollPosition = (): void => {
  localStorage.setItem("blogScrollPosition", window.scrollY.toString());
};

const restoreScrollPosition = (): void => {
  const savedPosition = localStorage.getItem("blogScrollPosition");

  if (savedPosition) {
    setTimeout(() => {
      window.scrollTo(0, Number.parseInt(savedPosition, 10));
    }, 100);
  }
};

const loadPosts = async (): Promise<void> => {
  try {
    const postContents = await getAllPosts();
    const postList = postContents.map(({ id, content }) => {
      const metadata = getPostMetadata(content);

      return {
        id,
        title: metadata.title,
        date: metadata.date,
        excerpt: `${metadata.content.substring(0, 150)}...`,
        contentLength: metadata.content.length,
        categories: metadata.categories || "其他",
      };
    });

    originalPosts.value = postList;
    sortPosts();
  } catch (error) {
    console.error("加载文章失败:", error);
  } finally {
    loading.value = false;
  }
};

const filterPosts = (): void => {
  let filteredPosts = [...originalPosts.value];

  if (selectedCategory.value !== "all") {
    filteredPosts = filteredPosts.filter(
      (post) => post.categories === selectedCategory.value,
    );
  }

  if (sortOrder.value === "desc") {
    filteredPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } else {
    filteredPosts.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }

  posts.value = filteredPosts;
  saveSettings();
};

const sortPosts = (): void => {
  filterPosts();
};

watch(selectedCategory, saveSettings);
watch(sortOrder, saveSettings);

watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/") {
      restoreScrollPosition();
    }
  },
);

onMounted(() => {
  loadSavedSettings();
  loadPosts();
  window.addEventListener("scroll", saveScrollPosition);
  restoreScrollPosition();
});

onBeforeUnmount(() => {
  saveScrollPosition();
  window.removeEventListener("scroll", saveScrollPosition);
});
</script>

<style scoped>
.home-container {
  min-height: calc(100vh - 60px);
}

.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1rem 4rem;
}

.hero-section {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.8fr);
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 2.5rem;
  border-radius: 28px;
  background:
    radial-gradient(circle at top right, rgba(64, 158, 255, 0.22), transparent 34%),
    radial-gradient(circle at left bottom, rgba(54, 207, 201, 0.16), transparent 28%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(242, 247, 255, 0.88));
  border: 1px solid rgba(255, 255, 255, 0.86);
  box-shadow: 0 26px 64px rgba(75, 101, 143, 0.16);
}

.hero-section::before {
  content: "";
  position: absolute;
  right: -40px;
  bottom: -60px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(64, 158, 255, 0.24), transparent 70%);
}

.hero-copy,
.hero-stats {
  position: relative;
  z-index: 1;
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: inset 0 0 0 1px rgba(64, 158, 255, 0.18);
  color: #195fc9;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-title {
  margin: 1rem 0;
  max-width: 720px;
  font-size: clamp(2.4rem, 5vw, 4rem);
  line-height: 1.12;
  letter-spacing: -0.04em;
  color: #162136;
}

.hero-description {
  max-width: 640px;
  font-size: 1.04rem;
  line-height: 1.9;
  color: #56647f;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-content: end;
}

.stat-card {
  min-height: 132px;
  padding: 1.2rem 1.25rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(194, 206, 225, 0.55);
  box-shadow: 0 12px 30px rgba(110, 134, 174, 0.13);
  backdrop-filter: blur(10px);
}

.stat-card:last-child {
  grid-column: 1 / -1;
}

.stat-label {
  display: block;
  margin-bottom: 0.75rem;
  color: #74829b;
  font-size: 0.86rem;
}

.stat-value {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1;
  color: #192339;
}

.content-panel {
  padding: 2rem;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(223, 231, 242, 0.95);
  box-shadow: 0 22px 55px rgba(74, 97, 138, 0.12);
  backdrop-filter: blur(10px);
}

.page-header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
}

.title-group {
  max-width: 560px;
}

.section-tag {
  display: inline-block;
  margin-bottom: 0.6rem;
  color: #3c78d8;
  font-size: 0.82rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.page-title {
  margin: 0 0 0.6rem;
  padding-bottom: 1rem;
  position: relative;
  color: #1a2438;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.page-title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 72px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #409eff, #36cfc9);
}

.page-subtitle {
  color: #687791;
  line-height: 1.8;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.category-filter,
.sort-control {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.8rem 0.95rem;
  border-radius: 16px;
  background: rgba(245, 248, 255, 0.9);
  border: 1px solid #e3ebf7;
  color: #5d677b;
  font-size: 0.92rem;
}

.category-filter .el-select {
  width: 118px;
}

.sort-control .el-select {
  width: 126px;
}

.dark .hero-section {
  background:
    radial-gradient(circle at top right, rgba(64, 158, 255, 0.18), transparent 34%),
    radial-gradient(circle at left bottom, rgba(45, 212, 191, 0.12), transparent 30%),
    linear-gradient(135deg, rgba(24, 30, 42, 0.96), rgba(18, 22, 31, 0.94));
  border-color: rgba(80, 92, 116, 0.82);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.32);
}

.dark .hero-kicker,
.dark .stat-card {
  background: rgba(31, 37, 51, 0.8);
  border-color: rgba(93, 109, 136, 0.42);
}

.dark .hero-title,
.dark .stat-value,
.dark .page-title {
  color: #edf3ff;
}

.dark .hero-description,
.dark .page-subtitle {
  color: #aab6ca;
}

.dark .stat-label {
  color: #8e9ab2;
}

.dark .content-panel {
  background: rgba(20, 25, 35, 0.9);
  border-color: rgba(60, 69, 86, 0.95);
  box-shadow: 0 22px 55px rgba(0, 0, 0, 0.28);
}

.dark .category-filter,
.dark .sort-control {
  background: rgba(28, 35, 48, 0.95);
  border-color: #3a4558;
  color: #b6c1d3;
}

@media (max-width: 992px) {
  .hero-section {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .stat-card:last-child {
    grid-column: auto;
  }
}

@media (max-width: 768px) {
  .home {
    padding: 1.5rem 0.85rem 3rem;
  }

  .hero-section,
  .content-panel {
    padding: 1.35rem;
    border-radius: 22px;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-description {
    font-size: 0.96rem;
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .filter-controls {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .category-filter,
  .sort-control {
    width: 100%;
  }

  .category-filter .el-select,
  .sort-control .el-select {
    width: 100%;
  }
}
</style>
