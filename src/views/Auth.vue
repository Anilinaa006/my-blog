<template>
  <el-container class="auth-container">
    <el-main class="auth-main">
      <section class="auth-shell">
        <div class="auth-showcase">
          <span class="auth-kicker">Frontend Diary</span>
          <h1 class="showcase-title">登录后即可发布评论</h1>
          <p class="showcase-description">
            登录后可以参与评论、管理自己的内容轨迹，也能让这份前端学习手记更有互动感。
          </p>

          <div class="showcase-points">
            <div class="point-card">
              <strong>继续阅读</strong>
              <span>保留你的浏览节奏，快速回到上次看到的内容。</span>
            </div>
            <div class="point-card">
              <strong>参与评论</strong>
              <span>对文章补充理解、记录问题，也能留下自己的思考。</span>
            </div>
            <div class="point-card">
              <strong>轻量体验</strong>
              <span>界面保持简洁，不打断阅读，只把需要的功能放在眼前。</span>
            </div>
          </div>
        </div>

        <div class="auth-panel">
          <div class="auth-card">
            <div class="auth-header">
              <div>
                <p class="auth-eyebrow">{{ isLogin ? "Welcome Back" : "Create Account" }}</p>
                <h2 class="auth-title">{{ isLogin ? "登录" : "注册" }}</h2>
                <p class="auth-subtitle">
                  {{
                    isLogin
                      ? "输入账号信息，继续你的博客阅读与互动。"
                      : "创建一个账号，开始发表评论和记录你的前端学习。"
                  }}
                </p>
              </div>
              <el-button type="primary" link class="toggle-button" @click="toggleMode">
                {{ isLogin ? "没有账号？去注册" : "已有账号？去登录" }}
              </el-button>
            </div>

            <el-form
              v-if="isLogin"
              :model="loginForm"
              :rules="loginRules"
              ref="loginFormRef"
              label-position="top"
              class="auth-form"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="loginForm.username" placeholder="请输入用户名" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  show-password
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  class="auth-button"
                  @click="handleLogin"
                  :loading="loading"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>

            <el-form
              v-else
              :model="registerForm"
              :rules="registerRules"
              ref="registerFormRef"
              label-position="top"
              class="auth-form"
            >
              <el-form-item label="用户名" prop="username">
                <el-input
                  v-model="registerForm.username"
                  placeholder="请输入用户名"
                />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="registerForm.password"
                  type="password"
                  placeholder="请输入密码"
                  show-password
                />
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="registerForm.confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  show-password
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  class="auth-button"
                  @click="handleRegister"
                  :loading="loading"
                >
                  注册
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </section>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { authAPI } from "../services/api";

const router = useRouter();
const isLogin = ref(true);
const loading = ref(false);
const loginFormRef = ref();
const registerFormRef = ref();

const loginForm = reactive({
  username: "",
  password: "",
});

const registerForm = reactive({
  username: "",
  password: "",
  confirmPassword: "",
});

const loginRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, message: "密码长度至少 8 个字符", trigger: "blur" },
  ],
};

const registerRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 3,
      max: 50,
      message: "用户名长度应为 3 到 50 个字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, message: "密码长度至少 8 个字符", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
        if (value !== registerForm.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
};

const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    await loginFormRef.value.validate();
    loading.value = true;

    const response = await authAPI.login({
      username: loginForm.username,
      password: loginForm.password,
    });

    authAPI.saveToken(response.token, response.user);

    loading.value = false;
    ElMessage.success("登录成功");
    router.push("/");
  } catch (error: any) {
    loading.value = false;
    ElMessage.error(error.message || "登录失败");
    console.error("登录失败:", error);
  }
};

const handleRegister = async () => {
  if (!registerFormRef.value) return;

  try {
    await registerFormRef.value.validate();
    loading.value = true;

    await authAPI.register({
      username: registerForm.username,
      password: registerForm.password,
    });

    loading.value = false;
    ElMessage.success("注册成功，请登录");
    isLogin.value = true;
  } catch (error: any) {
    loading.value = false;
    ElMessage.error(error.message || "注册失败");
    console.error("注册失败:", error);
  }
};
</script>

<style scoped>
.auth-container {
  min-height: calc(100vh - 60px);
}

.auth-main {
  display: flex;
  align-items: center;
}

.auth-shell {
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(420px, 0.95fr);
  gap: 2rem;
  align-items: stretch;
  padding: 2rem 1rem 3rem;
}

.auth-showcase {
  position: relative;
  overflow: hidden;
  padding: 3rem;
  border-radius: 30px;
  background:
    radial-gradient(circle at top right, rgba(64, 158, 255, 0.2), transparent 30%),
    radial-gradient(circle at left bottom, rgba(54, 207, 201, 0.14), transparent 26%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.86), rgba(242, 247, 255, 0.78));
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow: 0 24px 55px rgba(73, 95, 136, 0.14);
}

.auth-showcase::after {
  content: "";
  position: absolute;
  inset: auto -30px -60px auto;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(64, 158, 255, 0.22), transparent 68%);
}

.auth-kicker,
.showcase-title,
.showcase-description,
.showcase-points {
  position: relative;
  z-index: 1;
}

.auth-kicker {
  display: inline-flex;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: inset 0 0 0 1px rgba(64, 158, 255, 0.16);
  color: #1b63cb;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.showcase-title {
  margin: 1.2rem 0 1rem;
  color: #17233a;
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  line-height: 1.12;
  letter-spacing: -0.04em;
}

.showcase-description {
  max-width: 560px;
  color: #5e6d86;
  font-size: 1.02rem;
  line-height: 1.9;
}

.showcase-points {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 2rem;
}

.point-card {
  padding: 1.1rem 1.2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(213, 225, 242, 0.92);
  box-shadow: 0 12px 30px rgba(97, 120, 158, 0.08);
}

.point-card strong {
  display: block;
  margin-bottom: 0.45rem;
  color: #1b2942;
  font-size: 1rem;
}

.point-card span {
  color: #66758e;
  line-height: 1.75;
}

.auth-panel {
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  width: 100%;
  min-height: 100%;
  padding: 2.5rem;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(224, 232, 244, 0.95);
  box-shadow: 0 24px 55px rgba(70, 92, 128, 0.14);
  backdrop-filter: blur(10px);
}

.auth-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
}

.auth-eyebrow {
  margin-bottom: 0.5rem;
  color: #4f79c7;
  font-size: 0.82rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 700;
}

.auth-title {
  margin: 0;
  color: #1c2740;
  font-size: 2.3rem;
  font-weight: 800;
}

.auth-subtitle {
  margin-top: 0.75rem;
  color: #687892;
  line-height: 1.8;
}

.toggle-button {
  padding-top: 0.2rem;
  white-space: nowrap;
}

.auth-form :deep(.el-form-item) {
  margin-bottom: 1.25rem;
}

.auth-form :deep(.el-form-item__label) {
  padding-bottom: 0.45rem;
  color: #31415d;
  font-weight: 600;
}

.auth-form :deep(.el-input__wrapper) {
  min-height: 48px;
  border-radius: 14px;
  box-shadow: 0 0 0 1px rgba(208, 218, 234, 0.95) inset;
}

.auth-button {
  width: 100%;
  min-height: 48px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
}

.dark .auth-showcase {
  background:
    radial-gradient(circle at top right, rgba(64, 158, 255, 0.18), transparent 30%),
    radial-gradient(circle at left bottom, rgba(54, 207, 201, 0.1), transparent 25%),
    linear-gradient(145deg, rgba(23, 30, 43, 0.95), rgba(18, 23, 33, 0.92));
  border-color: rgba(71, 84, 104, 0.88);
  box-shadow: 0 24px 55px rgba(0, 0, 0, 0.28);
}

.dark .auth-kicker,
.dark .point-card {
  background: rgba(30, 37, 50, 0.8);
  border-color: rgba(83, 96, 117, 0.58);
}

.dark .showcase-title,
.dark .point-card strong,
.dark .auth-title {
  color: #eef3ff;
}

.dark .showcase-description,
.dark .point-card span,
.dark .auth-subtitle {
  color: #aeb9cc;
}

.dark .auth-card {
  background: rgba(21, 27, 38, 0.92);
  border-color: rgba(58, 69, 86, 0.95);
  box-shadow: 0 24px 55px rgba(0, 0, 0, 0.3);
}

.dark .auth-form :deep(.el-form-item__label) {
  color: #c8d2e4;
}

.dark .auth-form :deep(.el-input__wrapper) {
  background: rgba(30, 37, 50, 0.92);
  box-shadow: 0 0 0 1px rgba(67, 79, 99, 0.95) inset;
}

@media (max-width: 992px) {
  .auth-shell {
    grid-template-columns: 1fr;
  }

  .auth-showcase,
  .auth-card {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .auth-shell {
    padding: 1rem 0.5rem 2rem;
    gap: 1rem;
  }

  .auth-showcase,
  .auth-card {
    padding: 1.4rem;
    border-radius: 22px;
  }

  .auth-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .auth-title {
    font-size: 1.8rem;
  }

  .showcase-title {
    font-size: 2rem;
  }
}
</style>
