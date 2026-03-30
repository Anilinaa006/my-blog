<template>
  <el-container class="auth-container">
    <el-main>
      <div class="auth-card">
        <div class="auth-header">
          <h2 class="auth-title">{{ isLogin ? '登录' : '注册' }}</h2>
          <el-button type="text" class="toggle-button" @click="toggleMode">
            {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
          </el-button>
        </div>
        
        <!-- 登录表单 -->
        <el-form v-if="isLogin" :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="auth-button" @click="handleLogin" :loading="loading">登录</el-button>
          </el-form-item>
        </el-form>
        
        <!-- 注册表单 -->
        <el-form v-else :model="registerForm" :rules="registerRules" ref="registerFormRef" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="registerForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请确认密码" show-password />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="auth-button" @click="handleRegister" :loading="loading">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isLogin = ref(true);
const loading = ref(false);
const loginFormRef = ref();
const registerFormRef = ref();

// 登录表单数据
const loginForm = reactive({
  username: "",
  password: ""
});

// 注册表单数据
const registerForm = reactive({
  username: "",
  password: "",
  confirmPassword: ""
});

// 登录表单验证规则
const loginRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" }
  ]
};

// 注册表单验证规则
const registerRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 50, message: "用户名长度在 3 到 50 个字符", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度至少 6 个字符", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== registerForm.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
};

// 切换登录/注册模式
const toggleMode = () => {
  isLogin.value = !isLogin.value;
};

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return;
  
  try {
    await loginFormRef.value.validate();
    loading.value = true;
    
    // 模拟登录请求
    setTimeout(() => {
      loading.value = false;
      // 这里应该调用后端API进行登录
      console.log("登录请求:", loginForm);
      // 登录成功后跳转到首页
      router.push("/");
    }, 1000);
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return;
  
  try {
    await registerFormRef.value.validate();
    loading.value = true;
    
    // 模拟注册请求
    setTimeout(() => {
      loading.value = false;
      // 这里应该调用后端API进行注册
      console.log("注册请求:", registerForm);
      // 注册成功后切换到登录模式
      isLogin.value = true;
    }, 1000);
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};
</script>

<style scoped>
.auth-container {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  transition: all 0.3s ease;
}

.dark .auth-card {
  background: #2a2a2a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.auth-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  width: 100%;
}

.auth-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  transition: color 0.3s ease;
  margin: 0;
}

.dark .auth-title {
  color: #e0e0e0;
}

.toggle-button {
  color: #409eff;
}

.auth-button {
  width: 100%;
}

@media (max-width: 768px) {
  .auth-card {
    margin: 0 1rem;
    padding: 1.5rem;
  }
  
  .auth-title {
    font-size: 1.5rem;
  }
}
</style>