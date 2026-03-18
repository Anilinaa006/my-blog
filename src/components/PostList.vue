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
          <el-tag size="small" type="info">{{ formatDate(post.date) }}</el-tag>
        </div>
      </template>
      <div class="post-excerpt" v-if="post.excerpt">
        {{ post.excerpt }}
      </div>
      <div class="post-footer">
        <router-link :to="`/post/${post.id}`" class="read-more">
          <el-button type="primary" size="small" plain>
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
import { computed } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";

const props = defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style scoped>
.post-list {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.post-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-title {
  font-size: 1.2rem;
  margin: 0;
  flex: 1;
}

.post-title a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.post-title a:hover {
  color: #409eff;
}

.post-excerpt {
  color: #555;
  line-height: 1.6;
  margin: 1rem 0;
}

.post-footer {
  margin-top: 1rem;
  text-align: right;
}

.read-more {
  text-decoration: none;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 4rem 0;
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
</style>
