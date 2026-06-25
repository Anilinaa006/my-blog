<template>
  <el-container class="about-container">
    <el-main>
      <section class="about-page">
        <div class="profile-hero">
          <div class="avatar-panel">
            <div class="avatar-frame">
              <el-avatar :size="116" :src="authorAvatarUrl">
                <User />
              </el-avatar>
            </div>
            <div class="quick-card">
              <span>Front-end Learner</span>
              <strong>Vue / React / TypeScript</strong>
            </div>
            <el-upload
              v-if="isAuthorLoggedIn"
              class="avatar-uploader"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
              accept="image/jpeg,image/png,image/gif,image/webp"
              name="avatar"
            >
              <el-button type="primary" size="small" class="upload-button">
                <el-icon><Upload /></el-icon>
                更换头像
              </el-button>
            </el-upload>
          </div>

          <div class="hero-content">
            <span class="section-kicker">About Author</span>
            <h1>你好，我是涂乾安</h1>
            <p>
              软件工程专业学生，正在系统学习前端开发。这个博客记录我的学习路线、项目实践和问题复盘，
              也希望把每一次踩坑都变成下一次更清晰的理解。
            </p>
            <div class="hero-tags">
              <span>前端开发</span>
              <span>学习笔记</span>
              <span>项目复盘</span>
              <span>持续迭代</span>
            </div>
          </div>
        </div>

        <div class="content-grid">
          <article class="story-card">
            <div class="card-icon">
              <el-icon><User /></el-icon>
            </div>
            <span class="section-kicker">Profile</span>
            <h2>个人介绍</h2>
            <p>
              我来自东华理工大学软件工程专业，对页面交互、组件设计、状态管理和工程化工具链很感兴趣。
            </p>
            <p>
              目前主要围绕
              Vue、React、TypeScript、CSS、网络基础和前端工程化做学习整理，
              也会把日常开发中遇到的问题写成更容易复盘的文章。
            </p>
          </article>

          <article class="story-card accent-card">
            <div class="card-icon">
              <el-icon><Collection /></el-icon>
            </div>
            <span class="section-kicker">Blog</span>
            <h2>为什么写博客</h2>
            <p>
              写博客是为了把“看懂了”变成“讲清楚”。我会用文章记录知识点、代码实践和排错过程，
              让学习不只是收藏链接，而是留下可以反复回看的路径。
            </p>
            <a class="mail-link" href="mailto:2840668784@qq.com">
              <span>邮箱联系</span>
              <strong>2840668784@qq.com</strong>
            </a>
          </article>
        </div>

        <div class="focus-strip">
          <div class="focus-item">
            <strong>01</strong>
            <span>夯实基础</span>
          </div>
          <div class="focus-item">
            <strong>02</strong>
            <span>实践项目</span>
          </div>
          <div class="focus-item">
            <strong>03</strong>
            <span>复盘问题</span>
          </div>
          <div class="focus-item">
            <strong>04</strong>
            <span>持续输出</span>
          </div>
        </div>

        <div class="about-actions">
          <el-button type="primary" round @click="handleContact"
            >联系我</el-button
          >
        </div>
      </section>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { Collection, Upload, User } from "@element-plus/icons-vue";
import { authAPI } from "../services/api";

const authorInfo = ref<{
  id: number;
  username: string;
  avatarUrl: string | null;
  createdAt: string;
} | null>(null);

const isAuthorLoggedIn = computed(() => {
  const user = authAPI.getUser();
  return user?.role === "author";
});

const authorAvatarUrl = computed(() => {
  if (!authorInfo.value?.avatarUrl) {
    return "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar&image_size=square";
  }
  return `http://localhost:3001${authorInfo.value.avatarUrl}`;
});

const uploadUrl = computed(() => "/api/auth/avatar");

const uploadHeaders = computed(() => {
  const token = authAPI.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
});

const beforeUpload = (file: File) => {
  const isImage = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ].includes(file.type);
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error("只支持 JPEG、PNG、GIF、WebP 格式的图片");
    return false;
  }

  if (!isLt5M) {
    ElMessage.error("图片大小不能超过 5MB");
    return false;
  }

  return true;
};

const handleUploadSuccess = (response: { avatarUrl?: string }) => {
  if (!response.avatarUrl) {
    ElMessage.error("头像上传成功，但接口没有返回头像地址");
    return;
  }

  if (authorInfo.value) {
    authorInfo.value.avatarUrl = response.avatarUrl;
  }

  const storedUser = authAPI.getUser();
  if (storedUser) {
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...storedUser,
        avatarUrl: `http://localhost:3001${response.avatarUrl}`,
      }),
    );
  }

  ElMessage.success("头像上传成功");
};

const handleUploadError = () => {
  ElMessage.error("头像上传失败，请重试");
};

const handleContact = () => {
  window.location.href = "mailto:2840668784@qq.com";
};

const loadAuthorInfo = async () => {
  try {
    const info = await authAPI.getAuthorInfo();
    authorInfo.value = info;
  } catch (error: any) {
    console.error("获取作者信息失败:", error);
  }
};

onMounted(() => {
  loadAuthorInfo();
});
</script>

<style scoped>
.about-container {
  min-height: calc(100vh - 60px);
  background:
    linear-gradient(
      135deg,
      rgba(250, 252, 255, 0.98),
      rgba(239, 246, 255, 0.96)
    ),
    radial-gradient(
      circle at 8% 16%,
      rgba(255, 138, 101, 0.2),
      transparent 30%
    ),
    radial-gradient(circle at 90% 8%, rgba(54, 207, 201, 0.18), transparent 28%);
}

.about-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 3rem 1.25rem 4rem;
}

.profile-hero {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 1.4rem;
  align-items: stretch;
}

.avatar-panel,
.hero-content,
.story-card,
.focus-strip {
  border: 1px solid rgba(221, 230, 244, 0.92);
  box-shadow: 0 24px 70px rgba(69, 89, 126, 0.13);
  backdrop-filter: blur(14px);
}

.avatar-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 320px;
  padding: 1.4rem;
  border-radius: 28px;
  background: linear-gradient(160deg, #ff8a65 0%, #ffb36d 48%, #36cfc9 100%);
  color: #fff;
}

.avatar-frame {
  display: grid;
  place-items: center;
  width: 150px;
  height: 150px;
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.22);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.32);
}

.avatar-frame :deep(.el-avatar) {
  border: 5px solid rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 34px rgba(117, 73, 52, 0.24);
}

.quick-card {
  padding: 1rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.22);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28);
}

.quick-card span {
  display: block;
  margin-bottom: 0.35rem;
  opacity: 0.86;
  font-size: 0.86rem;
}

.quick-card strong {
  display: block;
  font-size: 1.05rem;
  line-height: 1.5;
}

.avatar-uploader {
  margin-top: auto;
}

.upload-button {
  width: 100%;
  margin-top: 0.5rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  color: #2f80ed;
  border: none;
  font-weight: 700;
  transition: all 0.3s ease;
}

.upload-button:hover {
  background: #fff;
  box-shadow: 0 8px 20px rgba(47, 128, 237, 0.25);
}

.hero-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2.4rem;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.86);
}

.section-kicker {
  color: #2e7bd8;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-content h1 {
  margin: 0.7rem 0 1rem;
  color: #162136;
  font-size: clamp(2.35rem, 5vw, 4rem);
  font-weight: 850;
  line-height: 1.08;
  letter-spacing: 0;
}

.hero-content p,
.story-card p {
  margin: 0;
  color: #5d6b84;
  line-height: 1.9;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1.45rem;
}

.hero-tags span {
  padding: 0.5rem 0.82rem;
  border: 1px solid #dbe7f6;
  border-radius: 999px;
  background: #f6f9ff;
  color: #48617f;
  font-size: 0.9rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.2rem;
  margin-top: 1.2rem;
}

.story-card {
  position: relative;
  overflow: hidden;
  padding: 1.6rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
}

.story-card::after {
  content: "";
  position: absolute;
  right: -54px;
  bottom: -54px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(64, 158, 255, 0.1);
}

.accent-card::after {
  background: rgba(54, 207, 201, 0.13);
}

.card-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-bottom: 1rem;
  border-radius: 14px;
  background: linear-gradient(135deg, #409eff, #36cfc9);
  color: #fff;
  font-size: 1.25rem;
}

.story-card h2 {
  margin: 0.55rem 0 0.9rem;
  color: #1d2a3f;
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: 0;
}

.story-card p + p {
  margin-top: 0.85rem;
}

.mail-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1.15rem;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  background: #f3f8ff;
  color: #65738b;
  text-decoration: none;
}

.mail-link strong {
  color: #2179d8;
}

.focus-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  overflow: hidden;
  margin-top: 1.2rem;
  border-radius: 22px;
  background: rgba(221, 230, 244, 0.92);
}

.focus-item {
  padding: 1.15rem;
  background: rgba(255, 255, 255, 0.9);
}

.focus-item strong {
  display: block;
  margin-bottom: 0.35rem;
  color: #36a3d6;
  font-size: 1.35rem;
}

.focus-item span {
  color: #4f5e75;
  font-weight: 700;
}

.about-actions {
  margin-top: 1.5rem;
  text-align: center;
}

.about-actions :deep(.el-button) {
  min-width: 128px;
  height: 42px;
  font-weight: 800;
  box-shadow: 0 14px 30px rgba(64, 158, 255, 0.28);
}

.dark .about-container {
  background:
    linear-gradient(135deg, #121722 0%, #151a24 52%, #10141c 100%),
    radial-gradient(
      circle at 8% 16%,
      rgba(255, 138, 101, 0.12),
      transparent 32%
    ),
    radial-gradient(circle at 90% 8%, rgba(54, 207, 201, 0.1), transparent 30%);
}

.dark .hero-content,
.dark .story-card,
.dark .focus-strip {
  border-color: rgba(70, 82, 104, 0.82);
  background: rgba(26, 32, 43, 0.88);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.34);
}

.dark .hero-content h1,
.dark .story-card h2 {
  color: #eef3fb;
}

.dark .hero-content p,
.dark .story-card p,
.dark .mail-link,
.dark .focus-item span {
  color: #aab5c7;
}

.dark .section-kicker {
  color: #79bbff;
}

.dark .hero-tags span,
.dark .mail-link,
.dark .focus-item {
  border-color: rgba(72, 84, 108, 0.86);
  background: rgba(38, 45, 60, 0.92);
}

.dark .hero-tags span {
  color: #c4cedd;
}

.dark .mail-link strong {
  color: #79bbff;
}

@media (max-width: 860px) {
  .profile-hero,
  .content-grid,
  .focus-strip {
    grid-template-columns: 1fr;
  }

  .avatar-panel {
    min-height: 250px;
  }
}

@media (max-width: 640px) {
  .about-page {
    padding: 2rem 0.9rem 3rem;
  }

  .hero-content,
  .story-card {
    padding: 1.35rem;
    border-radius: 22px;
  }

  .hero-content h1 {
    font-size: 2.1rem;
  }

  .mail-link {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
