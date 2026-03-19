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

<script setup>
import { ref, onMounted } from "vue";
import PostList from "../components/PostList.vue";
import { getPostMetadata } from "../utils/markdown.js";
import { getAllPosts } from "../utils/postLoader.js";

const posts = ref([]);
const originalPosts = ref([]);
const loading = ref(true);
const sortOrder = ref("desc");
const selectedCategory = ref("all");

const loadPosts = async () => {
  try {
    // 使用工具函数加载所有文章
    const postContents = await getAllPosts();

    console.log("Loaded post contents:", postContents.length);

    const postList = postContents.map(({ id, content }) => {
      console.log("Processing post:", id);
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

    console.log("Final post list:", postList);
    originalPosts.value = postList;
    sortPosts();
  } catch (error) {
    console.error("加载文章失败:", error);
  } finally {
    loading.value = false;
  }
};

const filterPosts = () => {
  let filteredPosts = [...originalPosts.value];

  // 按类别筛选
  if (selectedCategory.value !== "all") {
    filteredPosts = filteredPosts.filter(
      (post) => post.categories === selectedCategory.value,
    );
  }

  // 按日期排序
  if (sortOrder.value === "desc") {
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    filteredPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  posts.value = filteredPosts;
};

const sortPosts = () => {
  filterPosts();
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

/* 响应式设计 */
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
