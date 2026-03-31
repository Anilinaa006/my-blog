<template>
  <div class="app">
    <Header />
    <main class="main">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  background-color: #eef4ff;
  color: #243047;
  line-height: 1.6;
  transition: all 0.3s ease;
  scroll-behavior: smooth;
  background-image:
    radial-gradient(circle at top left, rgba(64, 158, 255, 0.16), transparent 28%),
    radial-gradient(circle at right 20%, rgba(54, 207, 201, 0.12), transparent 24%),
    linear-gradient(180deg, #f7faff 0%, #edf3ff 46%, #f8fbff 100%);
  background-attachment: fixed;
}

.dark body {
  background-color: #0f141d;
  color: #e5edf9;
  background-image:
    radial-gradient(circle at top left, rgba(64, 158, 255, 0.14), transparent 24%),
    radial-gradient(circle at right 15%, rgba(54, 207, 201, 0.08), transparent 20%),
    linear-gradient(180deg, #0f141d 0%, #131a25 48%, #0e131b 100%);
}

/* 优化滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.dark ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding-top: 88px;
  position: relative;
}

.main::before {
  content: "";
  position: fixed;
  inset: auto auto 6% 4%;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(64, 158, 255, 0.12), transparent 70%);
  filter: blur(12px);
  pointer-events: none;
}

.dark .main::before {
  background: radial-gradient(circle, rgba(64, 158, 255, 0.08), transparent 70%);
}
</style>
