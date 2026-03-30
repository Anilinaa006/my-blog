<template>
  <el-container class="home-container">
    <el-main>
      <div class="home">
        <div class="page-header">
          <h2 class="page-title">文章列表</h2>
          <div class="filter-controls">
            <div class="category-filter">
              <span>类别：</span>
              <el-select
                v-model="selectedCategory"
                @change="filterPosts"
                size="small"
              >
                <el-option label="全部" value="all" />
                <el-option label="HTML" value="HTML" />
                <el-option label="CSS" value="CSS" />
                <el-option label="JS" value="JavaScript" />
                <el-option label="Vue" value="Vue" />
                <el-option label="React" value="React" />
                <el-option label="网络" value="网络" />
                <el-option label="其他" value="其他" />
              </el-select>
            </div>
            <div class="sort-control">
              <span>排序：</span>
              <el-select v-model="sortOrder" @change="sortPosts" size="small">
                <el-option label="最新发布" value="desc" />
                <el-option label="最早发布" value="asc" />
              </el-select>
            </div>
          </div>
        </div>
        <el-skeleton :rows="3" animated v-if="loading" />
        <PostList :posts="posts" v-else />
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
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

const loadSavedSettings = (): void => {
  const savedCategory = localStorage.getItem("blogSelectedCategory");
  const savedSortOrder = localStorage.getItem("blogSortOrder");
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
  if (savedCategory && validCategories.includes(savedCategory)) {
    selectedCategory.value = savedCategory;
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
  const scrollPosition = window.scrollY;
  localStorage.setItem("blogScrollPosition", scrollPosition.toString());
  console.log("保存滚动位置:", scrollPosition);
};

const restoreScrollPosition = (): void => {
  const savedPosition = localStorage.getItem("blogScrollPosition");
  if (savedPosition) {
    console.log("恢复滚动位置:", savedPosition);
    setTimeout(() => {
      window.scrollTo(0, parseInt(savedPosition));
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
        excerpt: metadata.content.substring(0, 150) + "...",
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

watch(selectedCategory, () => {
  saveSettings();
});

watch(sortOrder, () => {
  saveSettings();
});

watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/") {
      console.log("路由进入首页，恢复滚动位置");
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
  console.log("组件卸载前保存滚动位置");
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
  padding: 3rem 1rem;
}

.page-header {
  margin-bottom: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.filter-controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.category-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.category-filter .el-select {
  width: 100px;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.sort-control .el-select {
  width: 120px;
}

.dark .category-filter {
  color: #909399;
}

.dark .sort-control {
  color: #909399;
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

@media (max-width: 768px) {
  .home {
    padding: 2rem 1rem;
  }
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 0;
  }
  .page-header .el-page-header__content {
    font-size: 1.5rem;
  }
  .filter-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    width: 100%;
  }
  .category-filter {
    width: 100%;
  }
  .category-filter .el-select {
    width: 100%;
  }
  .sort-control {
    width: 100%;
  }
  .sort-control .el-select {
    width: 100%;
  }
}
</style>
