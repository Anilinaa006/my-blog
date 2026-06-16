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

        <div class="comments-section" v-if="post">
          <h3 class="comments-title">
            <el-icon><ChatDotRound /></el-icon>
            评论（{{ comments.length }}）
          </h3>

          <div class="comment-form">
            <div class="comment-form-inner">
              <div v-if="isLoggedIn" class="comment-input-wrapper">
                <el-input
                  v-model="commentContent"
                  type="textarea"
                  :rows="1"
                  placeholder="留下你的精彩评论吧"
                  maxlength="500"
                  show-word-limit
                  class="comment-input"
                />
                <el-button
                  type="primary"
                  size="small"
                  @click="handleSubmitComment"
                  :loading="submittingComment"
                  class="comment-submit-btn"
                >
                  发送
                </el-button>
              </div>
              <div v-else class="login-prompt">
                <el-button type="primary" @click="handleLogin">
                  <el-icon><User /></el-icon>
                  登录后发表评论
                </el-button>
              </div>
            </div>
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
                  <el-avatar :size="32" :src="getCommentAvatar(comment)">
                    {{ getDefaultAvatarText(comment.username) }}
                  </el-avatar>
                  <div class="user-info">
                    <span class="username">{{ comment.username }}</span>
                    <el-tag
                      v-if="comment.role === 'author'"
                      type="danger"
                      size="small"
                      class="author-tag"
                    >
                      作者
                    </el-tag>
                  </div>
                </div>
                <div class="comment-time">
                  {{ formatCommentDate(comment.createdAt) }}
                </div>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
              <div class="comment-interactions">
                <div
                  class="comment-like"
                  :class="{ liked: likedComments.has(comment.id) }"
                  @click="handleLikeComment(comment)"
                >
                  <el-icon><Star /></el-icon>
                  <span>{{ comment.likeCount || 0 }}</span>
                </div>
                <div class="comment-reply" @click="toggleReplyForm(comment.id)">
                  <el-icon><Message /></el-icon>
                  <span>{{ getCommentReplyCount(comment.id) }} 回复</span>
                </div>
              </div>
              <div
                class="comment-actions"
                v-if="
                  isLoggedIn && (comment.userId === currentUserId || isAuthor)
                "
              >
                <el-button
                  v-if="comment.userId === currentUserId"
                  size="small"
                  @click="handleEditComment(comment)"
                >
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
              <div
                class="reply-form"
                v-if="replyingCommentId === comment.id && isLoggedIn"
              >
                <el-input
                  v-model="replyContentMap[comment.id]"
                  type="textarea"
                  :rows="2"
                  placeholder="输入回复内容"
                  maxlength="500"
                  show-word-limit
                />
                <div class="reply-form-actions">
                  <el-button
                    size="small"
                    @click="
                      replyingCommentId = null;
                      replyContentMap[comment.id] = '';
                    "
                  >
                    取消
                  </el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="handleSubmitReply(comment.id)"
                    :loading="submittingReplyId === comment.id"
                  >
                    回复
                  </el-button>
                </div>
              </div>
              <div
                class="replies-list"
                v-if="getCommentReplies(comment.id).length > 0"
              >
                <div
                  v-for="reply in getCommentReplies(comment.id)"
                  :key="reply.id"
                  class="reply-item"
                >
                  <div class="reply-header">
                    <el-avatar :size="24" :src="getCommentAvatar(reply)">
                      {{ getDefaultAvatarText(reply.username) }}
                    </el-avatar>
                    <span class="reply-username">{{ reply.username }}</span>
                    <el-tag
                      v-if="reply.role === 'author'"
                      type="danger"
                      size="small"
                      class="author-tag"
                    >
                      作者
                    </el-tag>
                    <span v-if="reply.replyToUsername" class="reply-to">
                      回复 {{ reply.replyToUsername }}
                    </span>
                    <span class="reply-time">{{
                      formatCommentDate(reply.createdAt)
                    }}</span>
                  </div>
                  <div class="reply-content" v-if="editingReplyId !== reply.id">
                    {{ reply.content }}
                  </div>
                  <div
                    class="edit-reply-form"
                    v-if="editingReplyId === reply.id"
                  >
                    <el-input
                      v-model="editReplyContent"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入回复内容"
                      maxlength="500"
                      show-word-limit
                    />
                    <div class="edit-reply-actions">
                      <el-button size="small" @click="cancelEditReply">
                        取消
                      </el-button>
                      <el-button
                        size="small"
                        type="primary"
                        @click="submitEditReply(comment.id, reply.id)"
                        :loading="editingReply"
                      >
                        保存
                      </el-button>
                    </div>
                  </div>
                  <div class="reply-interactions">
                    <div
                      class="reply-like"
                      :class="{ liked: likedReplies.has(reply.id) }"
                      @click="handleLikeReply(comment.id, reply)"
                    >
                      <el-icon><Star /></el-icon>
                      <span>{{ reply.likeCount || 0 }}</span>
                    </div>
                    <div
                      class="reply-reply"
                      v-if="isLoggedIn && reply.userId !== currentUserId"
                      @click="toggleReplyForm(comment.id, reply)"
                    >
                      <el-icon><Message /></el-icon>
                      <span>回复</span>
                    </div>
                  </div>
                  <div
                    class="reply-actions"
                    v-if="
                      isLoggedIn && (reply.userId === currentUserId || isAuthor)
                    "
                  >
                    <el-button
                      v-if="reply.userId === currentUserId"
                      size="small"
                      @click="handleEditReply(reply)"
                    >
                      <el-icon><Edit /></el-icon>
                      编辑
                    </el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click="handleDeleteReply(comment.id, reply.id)"
                    >
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </div>
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
import { computed, onMounted, ref, reactive } from "vue";
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
  Star,
  Message,
} from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const post = ref<any>(null);

const comments = ref<any[]>([]);
const commentReplies = ref<Map<number, any[]>>(new Map());
const commentContent = ref("");
const submittingComment = ref(false);
const editingCommentId = ref<number | null>(null);
const editCommentContent = ref("");
const editingComment = ref(false);
const likedComments = ref<Set<number>>(new Set());
const likedReplies = ref<Set<number>>(new Set());
const editingReplyId = ref<number | null>(null);
const editReplyContent = ref("");
const editingReply = ref(false);
const replyContentMap = reactive<Record<number, string>>({});
const replyingCommentId = ref<number | null>(null);
const submittingReplyId = ref<number | null>(null);
const replyToReply = ref<any>(null);

const isLoggedIn = computed(() => authAPI.isLoggedIn());
const currentUserId = computed(() => {
  const user = authAPI.getUser();
  return user ? user.id : null;
});
const isAuthor = computed(() => {
  const user = authAPI.getUser();
  return user ? user.role === "author" : false;
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
    likedComments.value = new Set(
      data.filter((c: any) => c.liked).map((c: any) => c.id),
    );
    for (const comment of data) {
      await loadCommentReplies(comment.id);
    }
  } catch (error: any) {
    console.error("加载评论失败:", error);
    ElMessage.error(error.message || "加载评论失败");
  }
};

const loadCommentReplies = async (commentId: number) => {
  try {
    const replies = await commentAPI.getCommentReplies(commentId);
    commentReplies.value.set(commentId, replies);
    for (const reply of replies) {
      if (reply.liked) {
        likedReplies.value.add(reply.id);
      }
    }
  } catch (error: any) {
    console.error("加载回复失败:", error);
  }
};

const getCommentReplies = (commentId: number) => {
  return commentReplies.value.get(commentId) || [];
};

const getCommentReplyCount = (commentId: number) => {
  return getCommentReplies(commentId).length;
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

const formatCommentDate = (dateString: string | undefined) => {
  if (!dateString) {
    return "-";
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleLikeComment = async (comment: any) => {
  if (!isLoggedIn.value) {
    ElMessage.warning("请先登录");
    return;
  }

  try {
    if (likedComments.value.has(comment.id)) {
      const result = await commentAPI.unlikeComment(comment.id);
      comment.likeCount = result.likeCount;
      likedComments.value.delete(comment.id);
    } else {
      const result = await commentAPI.likeComment(comment.id);
      comment.likeCount = result.likeCount;
      likedComments.value.add(comment.id);
    }
  } catch (error: any) {
    console.error("点赞失败:", error);
    ElMessage.error(error.message || "点赞失败");
  }
};

const handleLikeReply = async (_commentId: number, reply: any) => {
  if (!isLoggedIn.value) {
    ElMessage.warning("请先登录");
    return;
  }

  try {
    if (likedReplies.value.has(reply.id)) {
      const result = await commentAPI.unlikeReply(reply.id);
      reply.likeCount = result.likeCount;
      likedReplies.value.delete(reply.id);
    } else {
      const result = await commentAPI.likeReply(reply.id);
      reply.likeCount = result.likeCount;
      likedReplies.value.add(reply.id);
    }
  } catch (error: any) {
    console.error("回复点赞失败:", error);
    ElMessage.error(error.message || "回复点赞失败");
  }
};

const handleEditReply = (reply: any) => {
  editingReplyId.value = reply.id;
  editReplyContent.value = reply.content;
};

const cancelEditReply = () => {
  editingReplyId.value = null;
  editReplyContent.value = "";
};

const submitEditReply = async (commentId: number, replyId: number) => {
  if (!editReplyContent.value.trim()) {
    ElMessage.warning("请输入回复内容");
    return;
  }

  try {
    editingReply.value = true;
    const updatedReply = await commentAPI.updateReply(
      replyId,
      editReplyContent.value,
    );
    const replies = commentReplies.value.get(commentId) || [];
    const index = replies.findIndex((r) => r.id === replyId);
    if (index !== -1) {
      replies[index] = updatedReply;
      commentReplies.value.set(commentId, [...replies]);
    }
    editingReplyId.value = null;
    editReplyContent.value = "";
    ElMessage.success("回复更新成功");
  } catch (error: any) {
    console.error("更新回复失败:", error);
    ElMessage.error(error.message || "更新回复失败");
  } finally {
    editingReply.value = false;
  }
};

const handleDeleteReply = async (commentId: number, replyId: number) => {
  try {
    await ElMessageBox.confirm("确定要删除这条回复吗？", "删除回复", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await commentAPI.deleteReply(replyId);
    const replies = commentReplies.value.get(commentId) || [];
    commentReplies.value.set(
      commentId,
      replies.filter((r) => r.id !== replyId),
    );
    ElMessage.success("回复删除成功");
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除回复失败:", error);
      ElMessage.error(error.message || "删除回复失败");
    }
  }
};

const toggleReplyForm = (commentId: number, reply?: any) => {
  if (!isLoggedIn.value) {
    ElMessage.warning("请先登录");
    return;
  }

  if (replyingCommentId.value === commentId) {
    replyingCommentId.value = null;
    replyToReply.value = null;
  } else {
    replyingCommentId.value = commentId;
    replyToReply.value = reply || null;
    if (!replyContentMap[commentId]) {
      replyContentMap[commentId] = "";
    }
  }
};

const handleSubmitReply = async (commentId: number) => {
  const content = replyContentMap[commentId];
  if (!content.trim()) {
    ElMessage.warning("请输入回复内容");
    return;
  }

  try {
    submittingReplyId.value = commentId;
    const replyToUserId = replyToReply.value?.userId || undefined;
    const newReply = await commentAPI.createReply(
      commentId,
      content,
      replyToUserId,
    );

    const replies = commentReplies.value.get(commentId) || [];
    replies.push(newReply);
    commentReplies.value.set(commentId, replies);

    replyContentMap[commentId] = "";
    replyingCommentId.value = null;
    replyToReply.value = null;
    ElMessage.success("回复成功");
  } catch (error: any) {
    console.error("回复失败:", error);
    ElMessage.error(error.message || "回复失败");
  } finally {
    submittingReplyId.value = null;
  }
};

const handleBack = () => {
  router.push("/");
};

const getCommentAvatar = (comment: any) => {
  if (comment.avatarUrl) {
    const url = comment.avatarUrl;
    if (url.startsWith("http")) {
      return url;
    }
    return `http://localhost:3001${url}`;
  }
  return "";
};

const getDefaultAvatarText = (username: string) => {
  if (username) {
    return username.substring(0, 2).toUpperCase();
  }
  return "";
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

.comment-interactions {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.comment-like,
.comment-reply {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  color: #666;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.comment-like:hover,
.comment-reply:hover {
  color: #409eff;
}

.dark .comment-like,
.dark .comment-reply {
  color: #909399;
}

.dark .comment-like:hover,
.dark .comment-reply:hover {
  color: #79bbff;
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

.reply-form {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.dark .reply-form {
  border-top-color: #303030;
}

.reply-form-actions {
  margin-top: 0.8rem;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.replies-list {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #e9ecef;
}

.dark .replies-list {
  border-top-color: #303030;
}

.reply-item {
  padding: 0.8rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 0.8rem;
}

.dark .reply-item {
  background-color: #2a2e35;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.author-tag {
  margin-left: 0.5rem;
}

.reply-username {
  font-weight: 600;
  color: #333;
}

.dark .reply-username {
  color: #e0e0e0;
}

.reply-to {
  color: #666;
  font-size: 0.85rem;
}

.dark .reply-to {
  color: #909399;
}

.reply-time {
  margin-left: auto;
  font-size: 0.8rem;
  color: #999;
}

.dark .reply-time {
  color: #606266;
}

.reply-content {
  color: #333;
  line-height: 1.5;
  word-break: break-word;
}

.dark .reply-content {
  color: #d6dbe1;
}

.reply-interactions {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.reply-like,
.reply-reply {
  min-height: 30px;
  padding: 0.32rem 0.68rem;
  border-radius: 999px;
  background: #f3f7fd;
  color: #63718a;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.reply-like:hover,
.reply-reply:hover {
  background: #eaf4ff;
  color: #2179d8;
}

.reply-like.liked {
  background: #fef0f0 !important;
  color: #f56c6c !important;
}

.reply-like.liked :deep(.el-icon) {
  color: #f56c6c !important;
}

.reply-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #eef2f8;
}

.edit-reply-form {
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: #f6f9ff;
}

.edit-reply-actions {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.dark .reply-like,
.dark .reply-reply {
  background: rgba(38, 45, 60, 0.92);
  color: #8f9aae;
}

.dark .reply-like:hover,
.dark .reply-reply:hover {
  background: rgba(64, 158, 255, 0.15);
  color: #79bbff;
}

.dark .reply-actions {
  border-top-color: #30363d;
}

.dark .edit-reply-form {
  background: rgba(38, 45, 60, 0.92);
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

/* Visual refresh overrides */
.post-detail-container {
  background:
    linear-gradient(
      180deg,
      rgba(244, 248, 255, 0.94) 0%,
      #f7faff 42%,
      #eef5ff 100%
    ),
    radial-gradient(
      circle at 15% 12%,
      rgba(64, 158, 255, 0.12),
      transparent 32%
    );
}

.dark .post-detail-container {
  background:
    linear-gradient(180deg, #151922 0%, #11151d 56%, #141922 100%),
    radial-gradient(
      circle at 15% 12%,
      rgba(64, 158, 255, 0.12),
      transparent 34%
    );
}

.fixed-navbar {
  border-bottom: 1px solid rgba(222, 231, 246, 0.92);
  background-color: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
  box-shadow: 0 10px 30px rgba(61, 84, 125, 0.1);
}

.dark .fixed-navbar {
  border-bottom-color: rgba(70, 82, 104, 0.72);
  background-color: rgba(18, 22, 30, 0.84);
}

.navbar-content,
.post-detail,
.comments-section {
  max-width: 960px;
}

.back-button,
.back-btn {
  border-radius: 999px;
}

.post-detail {
  padding: 88px 1.25rem 3rem;
}

.post-card {
  border: 1px solid rgba(220, 229, 244, 0.95);
  border-radius: 18px;
  box-shadow: 0 24px 70px rgba(64, 86, 128, 0.14);
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 30px 80px rgba(64, 86, 128, 0.18) !important;
}

.post-card :deep(.el-card__header) {
  padding: 0;
  border-bottom: 0;
}

.post-card :deep(.el-card__body) {
  padding: 0;
}

.dark .post-card {
  border-color: rgba(64, 76, 98, 0.88) !important;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.34);
}

.post-header {
  position: relative;
  margin-bottom: 0;
  padding: 3.4rem 3rem 2.4rem;
  border-bottom: 1px solid #e7edf7;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.98),
      rgba(240, 247, 255, 0.96)
    ),
    radial-gradient(
      circle at top right,
      rgba(54, 207, 201, 0.18),
      transparent 35%
    );
}

.post-header::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 4px;
  background: linear-gradient(90deg, #409eff, #36cfc9, #8b5cf6);
}

.dark .post-header {
  border-bottom-color: rgba(66, 78, 100, 0.8);
  background:
    linear-gradient(135deg, rgba(31, 36, 49, 0.98), rgba(23, 29, 40, 0.96)),
    radial-gradient(
      circle at top right,
      rgba(45, 212, 191, 0.1),
      transparent 36%
    );
}

.post-title {
  max-width: 760px;
  margin: 0 auto 1.35rem;
  padding: 0;
  color: #162137;
  font-size: clamp(2rem, 4vw, 3.1rem);
  letter-spacing: 0;
  line-height: 1.18;
}

.post-meta {
  margin-top: 0;
  gap: 0.8rem;
}

.post-date,
.post-reading-time {
  min-height: 34px;
  border: 1px solid #dce7f6;
  background: rgba(255, 255, 255, 0.78);
  color: #60708b;
  box-shadow: none;
  backdrop-filter: blur(8px);
}

.post-date :deep(.el-tag) {
  border: 0;
  background: transparent;
  color: inherit;
}

.post-body {
  max-width: 760px;
  margin: 0 auto;
  padding: 3rem 1rem 1rem;
  color: #2c3445;
  font-size: 1.05rem;
  line-height: 1.9;
}

.post-body h2 {
  margin-top: 3.2rem;
  padding-bottom: 0;
  border-bottom: 0;
  color: #172135;
  font-size: 1.8rem;
  letter-spacing: 0;
}

.post-body h2::after {
  display: none;
}

.post-body h3 {
  margin-top: 2.4rem;
  border-left: 0;
  padding-left: 0;
  color: #24304a;
  font-size: 1.38rem;
}

.post-body p {
  margin-bottom: 1.45rem;
  text-align: left;
}

.post-body li {
  margin-bottom: 0.65rem;
}

.post-body code {
  border: 1px solid #e1e8f2;
  background: #f6f8fc;
  color: #d04f5f;
}

.post-body pre,
.post-body blockquote,
.post-body table {
  border: 1px solid #e2eaf6;
  box-shadow: 0 12px 32px rgba(72, 93, 132, 0.1);
}

.post-body pre {
  border-left: 4px solid #36cfc9;
  background: #f7f9fd;
}

.post-body blockquote {
  border-left: 4px solid #409eff;
  background: #f6f9ff;
}

.post-footer {
  max-width: 760px;
  margin: 2rem auto 0;
  padding: 2rem 1rem 2.6rem;
}

.comments-section {
  margin-top: 2rem;
  padding: 0;
}

.comments-title {
  margin-bottom: 1rem;
  padding: 0 0.25rem 1rem;
  border-bottom: 0;
  color: #172135;
  font-size: 1.45rem;
}

.comments-title::after {
  content: "";
  flex: 1;
  height: 1px;
  margin-left: 0.8rem;
  background: linear-gradient(90deg, #d7e3f3, transparent);
}

.comment-form {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0.3rem 0 0;
  background: transparent;
}

.comment-form-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem;
}

.comment-input-wrapper {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 6px 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(221, 230, 244, 0.6);
}

.comment-input {
  flex: 1;
}

.comment-input :deep(.el-input__wrapper) {
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
  min-height: auto !important;
  margin-bottom: 0 !important;
  border: none !important;
}

.comment-input :deep(.el-textarea__inner) {
  padding: 4px 0 !important;
  line-height: 1.3 !important;
  min-height: 28px !important;
  height: auto !important;
  margin-bottom: 0 !important;
  color: #1e293b !important;
}

.comment-input :deep(.el-textarea__inner)::placeholder {
  color: rgba(148, 163, 184, 0.7) !important;
}

.comment-submit-btn {
  border-radius: 20px;
  height: 34px;
  padding: 0 1.2rem;
  font-weight: 500;
}

.comment-form :deep(.el-card),
.comment-card {
  border: 1px solid rgba(221, 230, 244, 0.95);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 16px 44px rgba(65, 87, 128, 0.1);
  backdrop-filter: blur(10px);
}

.comment-form :deep(.el-card__header) {
  padding: 1rem 1.25rem 0;
  border-bottom: 0;
}

.comment-form :deep(.el-card__body),
.comment-card :deep(.el-card__body) {
  padding: 1.25rem;
}

.comment-form-header h4 {
  color: #1d2a3f;
  font-size: 1rem;
}

.comments-list {
  gap: 1rem;
  padding-bottom: 60px;
}

.comment-card {
  position: relative;
  overflow: visible;
}

.comment-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 1.25rem;
  bottom: 1.25rem;
  width: 3px;
  border-radius: 999px;
  background: linear-gradient(180deg, #409eff, #36cfc9);
  opacity: 0.78;
}

.comment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 56px rgba(65, 87, 128, 0.15) !important;
}

.comment-header {
  margin-bottom: 0.9rem;
}

.comment-user :deep(.el-avatar),
.reply-header :deep(.el-avatar) {
  border: 2px solid #fff;
  box-shadow: 0 8px 20px rgba(63, 87, 130, 0.18);
}

.username,
.reply-username {
  color: #1d2a3f;
}

.comment-time,
.reply-time {
  color: #8a96a8;
}

.comment-content {
  margin: 0.7rem 0 1rem 2.8rem;
  color: #2f394d;
  font-size: 1rem;
  line-height: 1.75;
}

.comment-interactions {
  margin: 0 0 0 2.8rem;
  gap: 0.6rem;
}

.comment-like,
.comment-reply {
  min-height: 30px;
  padding: 0.32rem 0.68rem;
  border-radius: 999px;
  background: #f3f7fd;
  color: #63718a;
}

.comment-like:hover,
.comment-reply:hover {
  background: #eaf4ff;
  color: #2179d8;
}

.comment-like.liked {
  background: #fef0f0 !important;
  color: #f56c6c !important;
}

.comment-like.liked :deep(.el-icon) {
  color: #f56c6c !important;
}

.comment-actions,
.edit-comment-form,
.reply-form,
.replies-list {
  margin-left: 2.8rem;
}

.comment-actions {
  border-top: 1px solid #eef2f8;
}

.edit-comment-form,
.reply-form {
  border-top: 0;
  border-radius: 14px;
  background: #f6f9ff;
  padding: 1rem;
}

.replies-list {
  margin-top: 1rem;
  padding: 1rem;
  border-top: 0;
  border-radius: 14px;
  background: #f7f9fc;
}

.reply-item {
  margin-bottom: 0.75rem;
  padding: 0.95rem 1rem;
  border: 1px solid #e8eef7;
  background: #fff;
  border-radius: 12px;
}

.reply-item:last-child {
  margin-bottom: 0;
}

.reply-content {
  padding-left: 2.3rem;
  color: #3a4558;
  line-height: 1.65;
}

.reply-to {
  color: #6b7a93;
}

.no-comments {
  border: 1px dashed #cdd9ea;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.58);
}

.dark .comments-title,
.dark .post-body h2,
.dark .post-body h3,
.dark .comment-form-header h4,
.dark .username,
.dark .reply-username {
  color: #eef3fb;
}

.dark .post-body {
  color: #d7dde8;
}

.dark .post-date,
.dark .post-reading-time {
  border-color: rgba(81, 94, 118, 0.72);
  background: rgba(32, 38, 51, 0.78);
}

.dark .post-body code,
.dark .post-body pre,
.dark .post-body blockquote {
  border-color: rgba(72, 84, 108, 0.88);
  background-color: #202633;
}

.dark .comment-form {
  background: rgba(15, 23, 42, 0.98);
  border-top-color: rgba(148, 163, 184, 0.3);
}

.dark .comment-input :deep(.el-input__wrapper) {
  background: rgba(148, 163, 184, 0.2) !important;
}

.dark .comment-input :deep(.el-textarea__inner) {
  color: #f1f5f9 !important;
}

.dark .comment-input :deep(.el-textarea__inner)::placeholder {
  color: rgba(148, 163, 184, 0.6) !important;
}

.dark .comment-form :deep(.el-card),
.dark .comment-card {
  border-color: rgba(67, 80, 103, 0.88) !important;
  background: rgba(28, 33, 45, 0.9) !important;
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.28);
}

.dark .comment-form :deep(.el-card__header),
.dark .comment-form :deep(.el-card__body),
.dark .comment-card :deep(.el-card__body) {
  background: transparent !important;
}

.dark .comment-content,
.dark .reply-content {
  color: #d8dee9;
}

.dark .comment-time,
.dark .reply-time,
.dark .reply-to {
  color: #8f9aae;
}

.dark .comment-like,
.dark .comment-reply,
.dark .reply-action,
.dark .edit-comment-form,
.dark .reply-form,
.dark .replies-list {
  background: rgba(38, 45, 60, 0.92);
}

.dark .reply-item {
  border-color: rgba(68, 80, 104, 0.8);
  background: rgba(29, 35, 48, 0.95);
}

.dark .no-comments {
  border-color: rgba(76, 89, 114, 0.84);
  background: rgba(24, 29, 39, 0.64);
}

@media (max-width: 768px) {
  .navbar-content,
  .post-detail,
  .comments-section {
    max-width: 100%;
  }

  .post-detail {
    padding: 76px 0.8rem 2rem;
  }

  .post-header {
    padding: 2.4rem 1.25rem 1.7rem;
  }

  .post-title {
    font-size: 1.8rem;
  }

  .post-body {
    padding: 2rem 1.1rem 0.6rem;
  }

  .comments-section {
    padding: 0;
  }

  .comment-content,
  .comment-interactions,
  .comment-actions,
  .edit-comment-form,
  .reply-form,
  .replies-list {
    margin-left: 0;
  }

  .comment-form :deep(.el-card__body),
  .comment-card :deep(.el-card__body) {
    padding: 1rem;
  }

  .reply-header {
    flex-wrap: wrap;
  }

  .reply-time {
    width: 100%;
    margin-left: 2.3rem;
  }
}
</style>
