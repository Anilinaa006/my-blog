<template>
  <header class="header" :class="{ 'header-scrolled': isScrolled }">
    <div class="container">
      <h1 class="logo">
        <router-link to="/">FrontendDiary</router-link>
      </h1>
      <div class="header-actions">
        <nav
          class="nav"
          :class="{ 'nav-mobile': isMobile, 'nav-open': isNavOpen }"
        >
          <router-link to="/" class="nav-link" @click="closeNav"
            >首页</router-link
          >
          <router-link to="/about" class="nav-link" @click="closeNav"
            >关于我</router-link
          >
          <router-link to="/blog-intro" class="nav-link" @click="closeNav"
            >博客介绍</router-link
          >
          <template v-if="isLoggedIn">
            <span class="nav-user">
              <el-icon><User /></el-icon>
              {{ user?.username }}
            </span>
            <button class="nav-link logout-btn" @click="handleLogout">
              退出登录
            </button>
          </template>
          <router-link v-else to="/auth" class="nav-link" @click="closeNav"
            >去登录</router-link
          >
        </nav>
        <button class="mobile-menu-btn" @click="toggleNav" v-if="isMobile">
          <span class="menu-icon"></span>
        </button>
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElIcon, ElMessageBox } from "element-plus";
import { User } from "@element-plus/icons-vue";
import ThemeToggle from "./ThemeToggle.vue";
import { authAPI } from "../services/api";

const router = useRouter();
const route = useRoute();
const isMobile = ref(false);
const isNavOpen = ref(false);
const isScrolled = ref(false);

// 登录状态
const isLoggedIn = ref(authAPI.isLoggedIn());

// 用户信息
const user = ref(authAPI.getUser());

// 检查登录状态
const checkLoginStatus = () => {
  isLoggedIn.value = authAPI.isLoggedIn();
  user.value = authAPI.getUser();
};

// 监听localStorage变化
const handleStorageChange = (event: StorageEvent) => {
  if (event.key === "auth_token" || event.key === "user") {
    checkLoginStatus();
  }
};

// 监听路由变化，检查登录状态
watch(
  () => route.path,
  () => {
    checkLoginStatus();
  },
);

const toggleNav = (): void => {
  isNavOpen.value = !isNavOpen.value;
};

const closeNav = (): void => {
  if (isMobile.value) {
    isNavOpen.value = false;
  }
};

const checkMobile = (): void => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    isNavOpen.value = false;
  }
};

const handleScroll = (): void => {
  isScrolled.value = window.scrollY > 100;
};

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm("确定要退出登录吗？", "退出登录", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      authAPI.removeToken();
      checkLoginStatus();
      ElMessage.success("退出登录成功");
      router.push("/");
    })
    .catch(() => {
      // 取消退出登录，不做任何操作
    });
};

onMounted(() => {
  checkMobile();
  checkLoginStatus();
  window.addEventListener("resize", checkMobile);
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("storage", handleStorageChange);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("storage", handleStorageChange);
});
</script>

<style scoped>
.header {
  background-color: rgba(248, 249, 250, 0.95);
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 0;
  transition: all 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  backdrop-filter: blur(10px);
}

.dark .header {
  background-color: rgba(31, 35, 41, 0.95);
  border-bottom: 1px solid #303030;
}

/* 吸附效果 */
.header-scrolled {
  padding: 0.8rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: rgba(248, 249, 250, 0.98);
}

.dark .header-scrolled {
  background-color: rgba(31, 35, 41, 0.98);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.logo a {
  color: #333;
  text-decoration: none;
}

.dark .logo a {
  color: #fff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav {
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: #666;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #007bff;
  background-color: #e9ecef;
}

.dark .nav-link {
  color: #c0c4cc;
}

.dark .nav-link:hover {
  color: #409eff;
  background-color: #303030;
}

.nav-link.router-link-active {
  color: #409eff;
  font-weight: bold;
}

.dark .nav-link.router-link-active {
  color: #409eff;
}

.nav-user {
  display: inline-block;
  padding: 0.5rem 1rem;
  color: #333;
  font-weight: 500;
}

.dark .nav-user {
  color: #e0e0e0;
}

.logout-btn {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  color: #666;
  border-radius: 4px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.logout-btn:hover {
  color: #409eff;
  background-color: #e9ecef;
}

.dark .logout-btn {
  color: #909399;
}

.dark .logout-btn:hover {
  color: #409eff;
  background-color: #303030;
}

/* Mobile menu button */
.mobile-menu-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  display: block;
  width: 24px;
  height: 2px;
  background-color: #333;
  position: relative;
  transition: all 0.3s ease;
}

.dark .menu-icon {
  background-color: #fff;
}

.menu-icon::before,
.menu-icon::after {
  content: "";
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: #333;
  transition: all 0.3s ease;
}

.dark .menu-icon::before,
.dark .menu-icon::after {
  background-color: #fff;
}

.menu-icon::before {
  top: -8px;
}

.menu-icon::after {
  bottom: -8px;
}

/* Mobile navigation */
.nav-mobile {
  position: fixed;
  top: 0;
  right: -100%;
  width: 70%;
  max-width: 280px;
  height: 100vh;
  background-color: #f8f9fa;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem 1rem;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.15);
  transition: right 0.3s ease;
  z-index: 1000;
}

.dark .nav-mobile {
  background-color: #1f2329;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
}

.nav-open {
  right: 0;
}

.nav-mobile .nav-link {
  width: 100%;
  padding: 1rem;
  border-radius: 0;
  border-bottom: 1px solid #e9ecef;
}

.dark .nav-mobile .nav-link {
  border-bottom: 1px solid #303030;
}

@media (max-width: 767px) {
  .header {
    padding: 0.8rem 0;
  }

  .logo {
    font-size: 1.2rem;
  }

  .header-actions {
    gap: 0.5rem;
  }
}
</style>
