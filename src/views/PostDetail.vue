<template>
  <el-container class="post-detail-container">
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
                  <span>{{ Math.ceil(post.contentLength / 500) }} 分钟阅读</span>
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

        <div class="comments-section" v-if="post">
          <h3 class="comments-title">
            <el-icon><ChatDotRound /></el-icon>
            评论（{{ comments.length }}）
          </h3>

          <div class="comment-form">
            <el-card shadow="hover">
              <template #header>
                <div class="comment-form-header">
                  <h4>发表评论</h4>
                </div>
              </template>
              <div v-if="isLoggedIn">
                <el-input
                  v-model="commentContent"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入评论内容"
                  maxlength="500"
                  show-word-limit
                />
                <div class="comment-form-actions">
                  <el-button
                    type="primary"
                    @click="handleSubmitComment"
                    :loading="submittingComment"
                  >
                    发表评论
                  </el-button>
                </div>
              </div>
              <div v-else class="login-prompt">
                <el-button type="primary" @click="handleLogin">
                  <el-icon><User /></el-icon>
                  登录后发表评论
                </el-button>
              </div>
            </el-card>
          </div>

          <div class="comments-list" v-if="comments.length > 0">
            <el-card
              v-for="comment in comments"
              :key="comment.id"
              class="comment-card"
              shadow="hover"
            >
              <div class="comment-header">
                <div class="comment-user">
                  <el-avatar
                    :size="32"
                    :src="`https://ui-avatars.com/api/?name=${comment.username}&background=409eff&color=fff`"
                  />
                  <span class="username">{{ comment.username }}</span>
                </div>
                <div class="comment-time">
                  {{ formatCommentDate(comment.created_at) }}
                </div>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
              <div
                class="comment-actions"
                v-if="isLoggedIn && comment.user_id === currentUserId"
              >
                <el-button size="small" @click="handleEditComment(comment)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDeleteComment(comment.id)"
                >
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
              <div
                class="edit-comment-form"
                v-if="editingCommentId === comment.id"
              >
                <el-input
                  v-model="editCommentContent"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入评论内容"
                  maxlength="500"
                  show-word-limit
                />
                <div class="edit-comment-actions">
                  <el-button size="small" @click="cancelEditComment">
                    取消
                  </el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="submitEditComment(comment.id)"
                    :loading="editingComment"
                  >
                    保存
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
          <div class="no-comments" v-else>
            <el-empty description="暂无评论，快来发表第一条评论吧" />
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { getPostMetadata, parseMarkdown } from "../utils/markdown";
import { getPostById } from "../utils/postLoader";
import { authAPI, commentAPI } from "../services/api";
import {
  ArrowLeft,
  Timer,
  ChatDotRound,
  User,
  Edit,
  Delete,
} from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const post = ref<any>(null);

const comments = ref<any[]>([]);
const commentContent = ref("");
const submittingComment = ref(false);
const editingCommentId = ref<number | null>(null);
const editCommentContent = ref("");
const editingComment = ref(false);

const isLoggedIn = computed(() => authAPI.isLoggedIn());
const currentUserId = computed(() => {
  const user = authAPI.getUser();
  return user ? user.id : null;
});

const loadPost = async () => {
  try {
    const postId = route.params.id as string;
    const content = await getPostById(postId);
    const metadata = getPostMetadata(content);

    post.value = {
      title: metadata.title,
      date: metadata.date,
      content: await parseMarkdown(metadata.content),
      contentLength: metadata.content.length,
    };

    await loadComments();
  } catch (error: any) {
    console.error("加载文章失败:", error);
    post.value = {
      title: "加载失败",
      date: new Date().toISOString(),
      content: "<p>文章加载失败，请检查控制台错误信息。</p>",
    };
  }
};

const loadComments = async () => {
  try {
    const postId = route.params.id as string;
    const data = await commentAPI.getComments(postId);
    comments.value = data;
  } catch (error: any) {
    console.error("加载评论失败:", error);
    ElMessage.error(error.message || "加载评论失败");
  }
};

const handleSubmitComment = async () => {
  if (!commentContent.value.trim()) {
    ElMessage.warning("请输入评论内容");
    return;
  }

  try {
    submittingComment.value = true;
    const postId = route.params.id as string;
    const newComment = await commentAPI.createComment(
      postId,
      commentContent.value,
    );
    comments.value.unshift(newComment);
    commentContent.value = "";
    ElMessage.success("评论发表成功");
  } catch (error: any) {
    console.error("发表评论失败:", error);
    ElMessage.error(error.message || "发表评论失败");
  } finally {
    submittingComment.value = false;
  }
};

const handleEditComment = (comment: any) => {
  editingCommentId.value = comment.id;
  editCommentContent.value = comment.content;
};

const cancelEditComment = () => {
  editingCommentId.value = null;
  editCommentContent.value = "";
};

const submitEditComment = async (commentId: number) => {
  if (!editCommentContent.value.trim()) {
    ElMessage.warning("请输入评论内容");
    return;
  }

  try {
    editingComment.value = true;
    const updatedComment = await commentAPI.updateComment(
      commentId,
      editCommentContent.value,
    );
    const index = comments.value.findIndex((c) => c.id === commentId);
    if (index !== -1) {
      comments.value[index] = updatedComment;
    }
    editingCommentId.value = null;
    editCommentContent.value = "";
    ElMessage.success("评论更新成功");
  } catch (error: any) {
    console.error("更新评论失败:", error);
    ElMessage.error(error.message || "更新评论失败");
  } finally {
    editingComment.value = false;
  }
};

const handleDeleteComment = async (commentId: number) => {
  try {
    await ElMessageBox.confirm("确定要删除这条评论吗？", "删除评论", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await commentAPI.deleteComment(commentId);
    comments.value = comments.value.filter((c) => c.id !== commentId);
    ElMessage.success("评论删除成功");
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除评论失败:", error);
      ElMessage.error(error.message || "删除评论失败");
    }
  }
};

const handleLogin = () => {
  router.push("/auth");
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCommentDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleBack = () => {
  router.push("/");
};

onMounted(() => {
  window.scrollTo(0, 0);
  loadPost();
});
</script>
<style scoped>
.post-detail-container {
  min-height: calc(100vh - 60px);
  position: relative;
}

/* 鍥哄畾瀵艰埅鏍?*/
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

/* 鏆楅粦妯″紡 */
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

/* 鍝嶅簲寮忚璁?*/
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

.dark .post-card {
  background-color: #1f2329 !important;
  border-color: #30363d !important;
}

.dark .post-card .el-card__header {
  background-color: #1f2329 !important;
  border-bottom-color: #30363d !important;
}

.dark .post-card .el-card__body {
  background-color: #1f2329 !important;
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

/* 寮曠敤鏍峰紡 */
.post-body blockquote {
  border-left: 4px solid #409eff;
  margin: 2rem 0;
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: #666;
}

/* 鍒嗛殧绾挎牱寮?*/
.post-body hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, #409eff, transparent);
  margin: 3rem 0;
}

/* 琛ㄦ牸鏍峰紡 */
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

/* 鏆楅粦妯″紡鏍峰紡 */
.dark .post-body {
  color: #e0e0e0;
}

.dark .post-body p,
.dark .post-body ul,
.dark .post-body ol,
.dark .post-body li,
.dark .post-body strong,
.dark .post-body em,
.dark .post-body td {
  color: #d6dbe1;
}

.dark .post-body a {
  color: #79bbff;
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

/* 鏆楅粦妯″紡 */
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

/* 璇勮妯″潡鏍峰紡 */
.comments-section {
  margin-top: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 1rem;
}

.comments-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.dark .comments-title {
  color: #e0e0e0;
  border-bottom-color: #303030;
}

.comment-form {
  margin-bottom: 2rem;
}

.dark .comment-form .el-card,
.dark .comment-card {
  background-color: #1f2329 !important;
  border-color: #30363d !important;
}

.dark .comment-form .el-card__header,
.dark .comment-card .el-card__body,
.dark .comment-form .el-card__body {
  background-color: #1f2329 !important;
}

.comment-form-header h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.dark .comment-form-header h4 {
  color: #e0e0e0;
}

.login-prompt {
  padding: 2rem 0;
  text-align: center;
}

.comment-form-actions {
  margin-top: 1rem;
  text-align: right;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-card {
  transition: all 0.3s ease;
  border-radius: 8px;
}

.comment-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.dark .comment-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.username {
  font-weight: 600;
  color: #333;
}

.dark .username {
  color: #e0e0e0;
}

.comment-time {
  font-size: 0.85rem;
  color: #999;
}

.dark .comment-time {
  color: #606266;
}

.comment-content {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #333;
  word-break: break-word;
}

.dark .comment-content {
  color: #e0e0e0;
}

.comment-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.dark .comment-actions {
  border-top-color: #303030;
}

.edit-comment-form {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.dark .edit-comment-form {
  border-top-color: #303030;
}

.edit-comment-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.no-comments {
  padding: 3rem 0;
  text-align: center;
}

/* 鍝嶅簲寮忚璁?*/
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

  .comments-title {
    font-size: 1.3rem;
  }

  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .comment-time {
    align-self: flex-start;
  }
}
</style>

