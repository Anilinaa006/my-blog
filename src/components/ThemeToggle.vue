<template>
  <el-dropdown trigger="click" @command="handleThemeChange">
    <el-button circle>
      <el-icon v-if="!isDark">
        <Sunny />
      </el-icon>
      <el-icon v-else>
        <Moon />
      </el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="light">浅色模式</el-dropdown-item>
        <el-dropdown-item command="dark">暗黑模式</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Moon, Sunny } from "@element-plus/icons-vue";

const isDark = ref(false);

const handleThemeChange = (command: string): void => {
  if (command === "dark") {
    document.documentElement.classList.add("dark");
    isDark.value = true;
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    isDark.value = false;
    localStorage.setItem("theme", "light");
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    handleThemeChange("dark");
  }
});
</script>
