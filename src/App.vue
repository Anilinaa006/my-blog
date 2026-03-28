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
  background-color: #f8f9fa;
  color: #333;
  line-height: 1.6;
  transition: all 0.3s ease;
  scroll-behavior: smooth;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-attachment: fixed;
}

.dark body {
  background-color: #1a1a1a;
  color: #e0e0e0;
  background-image: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
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
  padding-top: 80px;
}
</style>
