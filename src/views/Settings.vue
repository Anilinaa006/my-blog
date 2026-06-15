<template>
  <main class="settings-page">
    <section class="settings-shell">
      <div class="settings-hero">
        <div>
          <span class="eyebrow">Account Center</span>
          <h2>个人设置</h2>
          <p>管理头像、账号信息和登录密码，让资料保持最新。</p>
        </div>
      </div>

      <div v-if="loading" class="settings-loading">
        <el-skeleton :rows="6" animated />
      </div>

      <div v-else-if="!user" class="empty-panel">
        <el-empty description="请先登录后再进入个人设置" />
      </div>

      <div v-else class="settings-board">
        <section class="profile-panel">
          <div class="avatar-stage">
            <el-avatar :size="128" :src="avatarUrl || defaultAvatar">
              <User />
            </el-avatar>
          </div>

          <div class="profile-copy">
            <h3>{{ user.username }}</h3>
            <p class="profile-meta">注册于 {{ formatDate(user.createdAt) }}</p>
            <p class="avatar-tip">支持 JPEG、PNG、GIF、WebP，最大 5MB。</p>
          </div>

          <el-upload
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
            <el-button type="primary" class="upload-button">
              <el-icon><Upload /></el-icon>
              更换头像
            </el-button>
          </el-upload>
        </section>

        <section class="content-panel">
          <div class="panel-block">
            <div class="section-heading">
              <el-icon><User /></el-icon>
              <div>
                <h3>基本信息</h3>
                <p>当前账号的公开资料。</p>
              </div>
            </div>

            <div class="info-list">
              <div class="info-item">
                <span>用户名</span>
                <strong>{{ user.username }}</strong>
              </div>
              <div class="info-item">
                <span>注册时间</span>
                <strong>{{ formatDate(user.createdAt) }}</strong>
              </div>
            </div>
          </div>

          <div class="panel-block password-block">
            <div class="section-heading">
              <el-icon><Lock /></el-icon>
              <div>
                <h3>修改密码</h3>
                <p>新密码至少需要 8 个字符。</p>
              </div>
            </div>

            <el-form
              :model="passwordForm"
              class="password-form"
              label-position="top"
            >
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input
                  v-model="passwordForm.oldPassword"
                  type="password"
                  placeholder="请输入旧密码"
                  show-password
                />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  v-model="passwordForm.newPassword"
                  type="password"
                  placeholder="请输入新密码"
                  show-password
                />
              </el-form-item>
              <el-form-item label="确认新密码" prop="confirmPassword">
                <el-input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  placeholder="请再次输入新密码"
                  show-password
                />
              </el-form-item>

              <el-button
                type="primary"
                class="submit-button"
                :loading="changingPassword"
                @click="handleChangePassword"
              >
                保存新密码
              </el-button>
            </el-form>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { Lock, Upload, User } from "@element-plus/icons-vue";
import { authAPI } from "../services/api";

type UserInfo = {
  id: number;
  username: string;
  avatarUrl: string | null;
  createdAt: string;
};

const user = ref<UserInfo | null>(null);
const avatarUrl = ref("");
const loading = ref(false);
const changingPassword = ref(false);

const passwordForm = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const defaultAvatar = computed(() => {
  if (!user.value?.username) {
    return "";
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.value.username,
  )}&background=2f80ed&color=fff&size=128`;
});

const uploadUrl = computed(() => "/api/auth/avatar");

const uploadHeaders = computed(() => {
  const token = authAPI.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
});

const beforeUpload = (file: File) => {
  const isImage = ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
    file.type,
  );
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

  avatarUrl.value = `http://localhost:3001${response.avatarUrl}`;
  ElMessage.success("头像上传成功");

  const storedUser = authAPI.getUser();
  if (storedUser) {
    localStorage.setItem(
      "user",
      JSON.stringify({ ...storedUser, avatarUrl: avatarUrl.value }),
    );
  }
};

const handleUploadError = () => {
  ElMessage.error("头像上传失败，请重试");
};

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) {
    return "暂无记录";
  }

  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const loadUserInfo = async () => {
  loading.value = true;

  try {
    const userInfo = await authAPI.getUserInfo();
    user.value = userInfo;
    avatarUrl.value = userInfo.avatarUrl
      ? `http://localhost:3001${userInfo.avatarUrl}`
      : "";
  } catch (error: any) {
    console.error("获取用户信息失败:", error);
    ElMessage.error(error.message || "获取用户信息失败");
  } finally {
    loading.value = false;
  }
};

const handleChangePassword = async () => {
  const { oldPassword, newPassword, confirmPassword } = passwordForm.value;

  if (!oldPassword) {
    ElMessage.warning("请输入旧密码");
    return;
  }

  if (!newPassword) {
    ElMessage.warning("请输入新密码");
    return;
  }

  if (newPassword.length < 8) {
    ElMessage.warning("新密码至少需要 8 个字符");
    return;
  }

  if (!confirmPassword) {
    ElMessage.warning("请确认新密码");
    return;
  }

  if (newPassword !== confirmPassword) {
    ElMessage.warning("两次输入的新密码不一致");
    return;
  }

  changingPassword.value = true;

  try {
    await authAPI.changePassword(oldPassword, newPassword);
    ElMessage.success("密码修改成功，请重新登录");
    authAPI.removeToken();
    passwordForm.value = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    window.location.href = "/#/";
  } catch (error: any) {
    console.error("修改密码失败:", error);
    ElMessage.error(error.message || "修改密码失败");
  } finally {
    changingPassword.value = false;
  }
};

onMounted(() => {
  if (!authAPI.isLoggedIn()) {
    ElMessage.warning("请先登录");
    return;
  }

  loadUserInfo();
});
</script>

<style scoped>
.settings-page {
  min-height: calc(100vh - 80px);
  padding: 70px 20px 40px;
  background:
    linear-gradient(135deg, rgba(47, 128, 237, 0.08), transparent 34%),
    linear-gradient(315deg, rgba(48, 211, 191, 0.11), transparent 30%),
    #f7f9fc;
}

.settings-shell {
  width: min(880px, 100%);
  margin: 0 auto;
  text-align: left;
}

.settings-hero {
  display: grid;
  place-items: center;
  margin-bottom: 22px;
  padding: 22px 30px;
  border: 1px solid rgba(211, 222, 238, 0.9);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 18px 45px rgba(76, 92, 124, 0.12);
  backdrop-filter: blur(16px);
  text-align: center;
}

.eyebrow {
  display: inline-flex;
  margin-bottom: 10px;
  color: #2f80ed;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.settings-hero h2 {
  margin: 0 0 8px;
  color: #172033;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.1;
}

.settings-hero p {
  max-width: 520px;
  color: #607086;
  font-size: 0.98rem;
}

.settings-loading,
.empty-panel,
.profile-panel,
.content-panel {
  border: 1px solid rgba(211, 222, 238, 0.92);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 18px 45px rgba(76, 92, 124, 0.1);
}

.settings-loading,
.empty-panel {
  padding: 36px;
}

.settings-board {
  display: grid;
  gap: 22px;
}

.profile-panel {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 24px;
  padding: 28px 30px;
  text-align: left;
}

.profile-copy {
  min-width: 0;
}

.avatar-uploader {
  justify-self: end;
}

/* Keep the account summary centered as one composed panel, not a sidebar. */
@media (min-width: 821px) {
  .profile-panel {
    width: min(760px, 100%);
    margin: 0 auto;
  }
}

@media (max-width: 680px) {
  .profile-panel {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  .avatar-uploader {
    justify-self: center;
  }
}

.avatar-stage {
  display: grid;
  place-items: center;
  width: 164px;
  height: 164px;
  border-radius: 50%;
  background:
    linear-gradient(#fff, #fff) padding-box,
    linear-gradient(145deg, #2f80ed, #30d3bf) border-box;
  border: 8px solid transparent;
  box-shadow: 0 18px 34px rgba(47, 128, 237, 0.18);
}

.profile-panel h3 {
  margin: 0 0 6px;
  color: #1d2a3f;
  font-size: 1.55rem;
  font-weight: 800;
}

.profile-meta,
.avatar-tip {
  color: #64748b;
  font-size: 0.9rem;
}

.profile-meta {
  margin-bottom: 8px;
}

.avatar-tip {
  line-height: 1.6;
}

.upload-button,
.submit-button {
  min-height: 42px;
  border: none;
  border-radius: 6px;
  background: linear-gradient(135deg, #2f80ed, #20b8a9);
  box-shadow: 0 12px 24px rgba(47, 128, 237, 0.22);
  font-weight: 700;
}

.content-panel {
  overflow: hidden;
  width: min(760px, 100%);
  margin: 0 auto;
}

.panel-block {
  padding: 28px;
}

.panel-block + .panel-block {
  border-top: 1px solid #e7edf5;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
}

.section-heading .el-icon {
  width: 42px;
  height: 42px;
  border-radius: 6px;
  background: #eef6ff;
  color: #2f80ed;
  font-size: 1.25rem;
}

.section-heading h3 {
  margin: 0 0 4px;
  color: #1d2a3f;
  font-size: 1.15rem;
  font-weight: 800;
}

.section-heading p {
  color: #6b7a90;
  font-size: 0.9rem;
}

.info-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.info-item {
  padding: 18px;
  border: 1px solid #e7edf5;
  border-radius: 8px;
  background: #fbfdff;
}

.info-item span,
.info-item strong {
  display: block;
}

.info-item span {
  margin-bottom: 8px;
  color: #6b7a90;
  font-size: 0.85rem;
}

.info-item strong {
  color: #172033;
  font-size: 1rem;
}

.password-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2px 18px;
}

.password-form :deep(.el-form-item) {
  margin-bottom: 18px;
}

.password-form :deep(.el-form-item:nth-child(1)) {
  grid-column: 1 / -1;
}

.submit-button {
  justify-self: start;
  min-width: 132px;
}

.dark .settings-page {
  background:
    linear-gradient(135deg, rgba(47, 128, 237, 0.14), transparent 34%),
    linear-gradient(315deg, rgba(48, 211, 191, 0.12), transparent 30%),
    #111827;
}

.dark .settings-hero,
.dark .settings-loading,
.dark .empty-panel,
.dark .profile-panel,
.dark .content-panel {
  border-color: rgba(63, 76, 99, 0.9);
  background: rgba(22, 29, 42, 0.88);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.24);
}

.dark .settings-hero h2,
.dark .profile-panel h3,
.dark .section-heading h3,
.dark .info-item strong {
  color: #eef4ff;
}

.dark .settings-hero p,
.dark .profile-meta,
.dark .avatar-tip,
.dark .section-heading p,
.dark .info-item span {
  color: #9aa8bd;
}

.dark .avatar-stage {
  background:
    linear-gradient(#151c29, #151c29) padding-box,
    linear-gradient(145deg, #4f9cff, #30d3bf) border-box;
}

.dark .panel-block + .panel-block,
.dark .info-item {
  border-color: #2d384a;
}

.dark .info-item {
  background: rgba(14, 20, 31, 0.72);
}

.dark .section-heading .el-icon {
  background: rgba(47, 128, 237, 0.16);
  color: #7db6ff;
}

@media (max-width: 820px) {
  .settings-page {
    padding: 72px 14px 32px;
  }

  .settings-hero {
    padding: 24px 20px;
  }

  .settings-hero h2 {
    font-size: 1.65rem;
  }

  .info-list,
  .password-form {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .settings-hero,
  .panel-block,
  .profile-panel {
    padding: 22px 16px;
  }

  .section-heading {
    align-items: flex-start;
  }

  .submit-button {
    width: 100%;
  }
}
</style>
