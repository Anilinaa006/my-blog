<template>
  <header class="header" :class="{ 'header-scrolled': isScrolled }">
    <div class="container">
      <h1 class="logo">
        <router-link to="/">
          <span class="logo-mark">FD</span>
          <span class="logo-text">FrontendDiary</span>
        </router-link>
      </h1>

      <div class="header-actions">
        <nav
          class="nav"
          :class="{ 'nav-mobile': isMobile, 'nav-open': isNavOpen }"
        >
          <router-link to="/" class="nav-link" @click="closeNav">首页</router-link>
          <router-link to="/about" class="nav-link" @click="closeNav">关于我</router-link>
          <router-link to="/blog-intro" class="nav-link" @click="closeNav">
            博客介绍
          </router-link>

          <template v-if="isLoggedIn">
            <span class="nav-user">
              <el-icon><User /></el-icon>
              {{ user?.username }}
            </span>
            <button class="nav-link logout-btn" @click="handleLogout">退出登录</button>
          </template>

          <router-link v-else to="/auth" class="nav-link auth-link" @click="closeNav">
            去登录
          </router-link>
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
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { User } from "@element-plus/icons-vue";
import ThemeToggle from "./ThemeToggle.vue";
import { authAPI } from "../services/api";

const router = useRouter();
const route = useRoute();
const isMobile = ref(false);
const isNavOpen = ref(false);
const isScrolled = ref(false);
const isLoggedIn = ref(authAPI.isLoggedIn());
const user = ref(authAPI.getUser());

const checkLoginStatus = () => {
  isLoggedIn.value = authAPI.isLoggedIn();
  user.value = authAPI.getUser();
};

const handleStorageChange = (event: StorageEvent) => {
  if (event.key === "auth_token" || event.key === "user") {
    checkLoginStatus();
  }
};

watch(
  () => route.path,
  () => {
    checkLoginStatus();
    isNavOpen.value = false;
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

  if (!isMobile.value) {
    isNavOpen.value = false;
  }
};

const handleScroll = (): void => {
  isScrolled.value = window.scrollY > 40;
};

const handleLogout = () => {
  ElMessageBox.confirm("确定要退出登录吗？", "退出登录", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      authAPI.removeToken();
      checkLoginStatus();
      ElMessage.success("已退出登录");
      router.push("/");
    })
    .catch(() => {});
};

onMounted(() => {
  checkMobile();
  checkLoginStatus();
  handleScroll();
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
  position: fixed;
  inset: 0 0 auto;
  z-index: 999;
  padding: 1rem 0;
  background: rgba(248, 250, 255, 0.72);
  border-bottom: 1px solid rgba(219, 228, 243, 0.7);
  backdrop-filter: blur(18px);
  transition: all 0.35s ease;
}

.header-scrolled {
  padding: 0.75rem 0;
  background: rgba(248, 250, 255, 0.9);
  box-shadow: 0 10px 30px rgba(87, 107, 142, 0.12);
}

.dark .header {
  background: rgba(15, 20, 29, 0.72);
  border-bottom-color: rgba(62, 72, 89, 0.75);
}

.dark .header-scrolled {
  background: rgba(15, 20, 29, 0.92);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.logo {
  margin: 0;
  font-size: 1.45rem;
}

.logo a {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 14px;
  background: linear-gradient(135deg, #409eff, #36cfc9);
  color: #fff;
  font-size: 0.86rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  box-shadow: 0 10px 22px rgba(64, 158, 255, 0.28);
}

.logo-text {
  color: #18243a;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.dark .logo-text {
  color: #f0f4ff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.nav {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.66);
  box-shadow: inset 0 0 0 1px rgba(228, 235, 245, 0.9);
}

.dark .nav {
  background: rgba(26, 32, 45, 0.85);
  box-shadow: inset 0 0 0 1px rgba(63, 73, 90, 0.9);
}

.nav-link,
.logout-btn,
.nav-user {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: #5f6c82;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.25s ease;
  cursor: pointer;
}

.nav-link:hover,
.logout-btn:hover {
  color: #1f73df;
  background: rgba(64, 158, 255, 0.1);
}

.nav-link.router-link-active {
  color: #155fc8;
  background: rgba(64, 158, 255, 0.14);
  font-weight: 700;
}

.auth-link {
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.13), rgba(54, 207, 201, 0.13));
}

.nav-user {
  gap: 0.45rem;
  color: #1f2d44;
  font-weight: 600;
}

.dark .nav-link,
.dark .logout-btn {
  color: #c2cbe0;
}

.dark .nav-user {
  color: #eef3ff;
}

.dark .nav-link:hover,
.dark .logout-btn:hover,
.dark .nav-link.router-link-active {
  color: #8fc5ff;
  background: rgba(64, 158, 255, 0.12);
}

.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  height: 2.8rem;
  border: none;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: inset 0 0 0 1px rgba(228, 235, 245, 0.95);
  cursor: pointer;
}

.dark .mobile-menu-btn {
  background: rgba(25, 31, 43, 0.88);
  box-shadow: inset 0 0 0 1px rgba(63, 73, 90, 0.92);
}

.menu-icon,
.menu-icon::before,
.menu-icon::after {
  display: block;
  width: 20px;
  height: 2px;
  border-radius: 999px;
  background: #24334d;
  transition: all 0.25s ease;
}

.menu-icon {
  position: relative;
}

.menu-icon::before,
.menu-icon::after {
  content: "";
  position: absolute;
  left: 0;
}

.menu-icon::before {
  top: -6px;
}

.menu-icon::after {
  top: 6px;
}

.dark .menu-icon,
.dark .menu-icon::before,
.dark .menu-icon::after {
  background: #eef3ff;
}

.nav-mobile {
  position: fixed;
  top: 72px;
  right: 1rem;
  width: min(300px, calc(100vw - 2rem));
  height: auto;
  padding: 1rem;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
  border-radius: 24px;
  background: rgba(250, 252, 255, 0.96);
  box-shadow: 0 20px 45px rgba(33, 48, 77, 0.18);
  transform: translateY(-16px);
  opacity: 0;
  pointer-events: none;
}

.dark .nav-mobile {
  background: rgba(19, 24, 34, 0.98);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.32);
}

.nav-open {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}

.nav-mobile .nav-link,
.nav-mobile .logout-btn,
.nav-mobile .nav-user {
  width: 100%;
  justify-content: flex-start;
  border-radius: 16px;
}

@media (max-width: 767px) {
  .header {
    padding: 0.8rem 0;
  }

  .container {
    gap: 0.75rem;
  }

  .logo {
    font-size: 1.2rem;
  }

  .logo-mark {
    width: 2rem;
    height: 2rem;
    border-radius: 12px;
  }

  .logo-text {
    font-size: 1.1rem;
  }
}
</style>
