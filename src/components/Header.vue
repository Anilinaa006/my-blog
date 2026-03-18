<template>
  <header class="header">
    <div class="container">
      <h1 class="logo">
        <router-link to="/">My Blog</router-link>
      </h1>
      <div class="header-actions">
        <nav class="nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/about" class="nav-link">关于</router-link>
        </nav>
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup>
import ThemeToggle from "./ThemeToggle.vue";
</script>

<style scoped>
.header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 0;
}

.dark .header {
  background-color: #1f2329;
  border-bottom: 1px solid #303030;
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
  color: #007bff;
  font-weight: bold;
}

.dark .nav-link.router-link-active {
  color: #409eff;
}
</style>
