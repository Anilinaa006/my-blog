<template>
  <div class="post-list">
    <el-card
      v-for="post in posts"
      :key="post.id"
      class="post-card"
      shadow="hover"
    >
      <template #header>
        <div class="post-header">
          <h2 class="post-title">
            <router-link :to="`/post/${post.id}`">{{ post.title }}</router-link>
          </h2>
        </div>
      </template>
      <div class="post-meta">
        <el-tag size="small" type="info">{{ formatDate(post.date) }}</el-tag>
        <span class="post-reading-time"
          >阅读时间: {{ Math.ceil(post.excerpt.length / 500) }} 分钟</span
        >
      </div>
      <div class="post-excerpt" v-if="post.excerpt">
        {{ post.excerpt }}
      </div>
      <div class="post-footer">
        <router-link :to="`/post/${post.id}`" class="read-more">
          <el-button type="primary" size="small" :plain="!isDark">
            阅读更多
            <el-icon class="el-icon--right"><arrow-right /></el-icon>
          </el-button>
        </router-link>
      </div>
    </el-card>
    <div v-if="posts.length === 0" class="empty-state">
      <el-empty description="暂无文章" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";

const props = defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
});

const isDark = ref(false);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// 监听暗黑模式变化
const checkDarkMode = () => {
  isDark.value = document.documentElement.classList.contains("dark");
};

onMounted(() => {
  checkDarkMode();
  window.addEventListener("resize", checkDarkMode);
});

// 监听主题变化
watch(
  () => document.documentElement.classList.contains("dark"),
  (newValue) => {
    isDark.value = newValue;
  },
);
</script>

<style scoped>
.post-list {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.post-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  overflow: hidden;
}

.post-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12) !important;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.post-title {
  font-size: 1.3rem;
  margin: 0;
  flex: 1;
  line-height: 1.4;
  font-weight: 600;
}

.post-title a {
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  display: block;
  padding-right: 1rem;
}

.post-title a:hover {
  color: #409eff;
  transform: translateX(5px);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #999;
}

.post-reading-time {
  color: #999;
  font-size: 0.85rem;
}

.dark .post-reading-time {
  color: #606266;
}

.post-excerpt {
  color: #555;
  line-height: 1.7;
  margin: 1rem 0;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-footer {
  margin-top: 1.5rem;
  text-align: right;
}

.read-more {
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.read-more:hover {
  transform: translateY(-2px);
}

.empty-state {
  grid-column: 1 / -1;
  padding: 6rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-state .el-empty {
  transform: scale(1.2);
}

/* 暗黑模式 */
.dark .post-title a {
  color: #e0e0e0;
}

.dark .post-title a:hover {
  color: #409eff;
}

.dark .post-excerpt {
  color: #a0a0a0;
}

.dark .post-meta {
  color: #606266;
}
</style>
