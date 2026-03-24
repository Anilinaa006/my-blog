---
title: Vue 2 和 Vue 3 生命周期函数详解
date: 2026-02-26
categories: Vue
---

# Vue 2 和 Vue 3 生命周期函数详解

## 什么是生命周期函数？

生命周期函数是 Vue 实例在不同阶段自动执行的函数，它们允许我们在组件的不同生命周期阶段执行特定的操作。了解生命周期函数对于掌握 Vue 的工作原理和编写高效的组件至关重要。

## Vue 2 生命周期函数

Vue 2 的生命周期分为以下几个阶段：

### 1. 初始化阶段

- **beforeCreate**：实例创建前
  - 此时 Vue 实例还未初始化，data 和 methods 等属性尚未挂载
  - 无法访问到 data、computed、watch、methods 等属性
  - 可以在这里进行一些初始化前的准备工作

- **created**：实例创建完成
  - Vue 实例已经初始化，data 和 methods 等属性已经挂载
  - 可以访问到 data、computed、watch、methods 等属性
  - 可以在这里进行数据请求、初始化数据等操作

### 2. 挂载阶段

- **beforeMount**：挂载前
  - 模板编译完成，但尚未挂载到 DOM 上
  - 可以在这里进行最后一次数据修改

- **mounted**：挂载完成
  - 模板已经挂载到 DOM 上
  - 可以在这里进行 DOM 操作、第三方库初始化等操作

### 3. 更新阶段

- **beforeUpdate**：更新前
  - 数据发生变化，DOM 尚未更新
  - 可以在这里获取更新前的 DOM 状态

- **updated**：更新完成
  - 数据发生变化，DOM 已经更新
  - 可以在这里进行 DOM 操作，但要注意避免无限循环更新

### 4. 销毁阶段

- **beforeDestroy**：销毁前
  - 实例即将被销毁，所有的属性和方法仍然可用
  - 可以在这里进行清理工作，如清除定时器、取消事件监听器等

- **destroyed**：销毁完成
  - 实例已经被销毁，所有的属性和方法都不可用
  - 可以在这里进行最后的清理工作

## Vue 3 生命周期函数

Vue 3 在组合式 API 中对生命周期函数进行了调整，主要是将原来的生命周期函数改为了以 `on` 开头的函数形式。

### 1. 初始化阶段

- **setup**：组合式 API 的入口
  - 在组件创建之前执行，替代了 Vue 2 中的 beforeCreate 和 created
  - 可以在这里进行数据初始化、方法定义等操作
  - 返回的对象会被暴露给模板和其他选项

### 2. 挂载阶段

- **onBeforeMount**：挂载前
  - 对应 Vue 2 中的 beforeMount
  - 模板编译完成，但尚未挂载到 DOM 上

- **onMounted**：挂载完成
  - 对应 Vue 2 中的 mounted
  - 模板已经挂载到 DOM 上

### 3. 更新阶段

- **onBeforeUpdate**：更新前
  - 对应 Vue 2 中的 beforeUpdate
  - 数据发生变化，DOM 尚未更新

- **onUpdated**：更新完成
  - 对应 Vue 2 中的 updated
  - 数据发生变化，DOM 已经更新

### 4. 卸载阶段

- **onBeforeUnmount**：卸载前
  - 对应 Vue 2 中的 beforeDestroy
  - 组件即将被卸载，所有的属性和方法仍然可用

- **onUnmounted**：卸载完成
  - 对应 Vue 2 中的 destroyed
  - 组件已经被卸载，所有的属性和方法都不可用

### 5. 新增的生命周期函数

- **onErrorCaptured**：捕获错误
  - 捕获子组件抛出的错误
  - 可以在这里进行错误处理

- **onRenderTracked**：渲染跟踪
  - 当组件的响应式依赖被跟踪时调用
  - 可以在这里进行性能分析

- **onRenderTriggered**：渲染触发
  - 当组件的响应式依赖被触发时调用
  - 可以在这里进行性能分析

- **onActivated**：激活
  - 当组件被 keep-alive 缓存激活时调用
  - 可以在这里进行激活后的操作

- **onDeactivated**：失活
  - 当组件被 keep-alive 缓存失活时调用
  - 可以在这里进行失活前的操作

## Vue 2 和 Vue 3 生命周期函数对比

| Vue 2 生命周期函数 | Vue 3 生命周期函数 | 说明 |
|------------------|------------------|------|
| beforeCreate     | setup (开始)      | 实例创建前 |
| created          | setup (结束)      | 实例创建完成 |
| beforeMount      | onBeforeMount    | 挂载前 |
| mounted          | onMounted        | 挂载完成 |
| beforeUpdate     | onBeforeUpdate   | 更新前 |
| updated          | onUpdated        | 更新完成 |
| beforeDestroy    | onBeforeUnmount  | 销毁/卸载前 |
| destroyed        | onUnmounted      | 销毁/卸载完成 |
| -                | onErrorCaptured  | 捕获错误 |
| -                | onRenderTracked  | 渲染跟踪 |
| -                | onRenderTriggered| 渲染触发 |
| -                | onActivated      | 激活（keep-alive） |
| -                | onDeactivated    | 失活（keep-alive） |

## 代码示例

### Vue 2 生命周期函数示例

```javascript
// Vue 2 组件
new Vue({
  el: '#app',
  data() {
    return {
      message: 'Hello Vue!'
    }
  },
  beforeCreate() {
    console.log('beforeCreate: 实例创建前');
    console.log('data:', this.message); // undefined
  },
  created() {
    console.log('created: 实例创建完成');
    console.log('data:', this.message); // Hello Vue!
    // 可以在这里进行数据请求
  },
  beforeMount() {
    console.log('beforeMount: 挂载前');
  },
  mounted() {
    console.log('mounted: 挂载完成');
    // 可以在这里进行 DOM 操作
  },
  beforeUpdate() {
    console.log('beforeUpdate: 更新前');
  },
  updated() {
    console.log('updated: 更新完成');
  },
  beforeDestroy() {
    console.log('beforeDestroy: 销毁前');
    // 可以在这里进行清理工作
  },
  destroyed() {
    console.log('destroyed: 销毁完成');
  }
});
```

### Vue 3 生命周期函数示例

```javascript
// Vue 3 组件（组合式 API）
<template>
  <div>{{ message }}</div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue';

const message = ref('Hello Vue 3!');

// setup 函数替代了 beforeCreate 和 created
console.log('setup: 组件创建前');
console.log('message:', message.value); // Hello Vue 3!

onBeforeMount(() => {
  console.log('onBeforeMount: 挂载前');
});

onMounted(() => {
  console.log('onMounted: 挂载完成');
  // 可以在这里进行 DOM 操作
});

onBeforeUpdate(() => {
  console.log('onBeforeUpdate: 更新前');
});

onUpdated(() => {
  console.log('onUpdated: 更新完成');
});

onBeforeUnmount(() => {
  console.log('onBeforeUnmount: 卸载前');
  // 可以在这里进行清理工作
});

onUnmounted(() => {
  console.log('onUnmounted: 卸载完成');
});
</script>
```

## 生命周期函数的最佳实践

1. **数据请求**：最好在 `created`（Vue 2）或 `setup`（Vue 3）中进行，因为此时实例已经初始化，可以访问到数据和方法。

2. **DOM 操作**：最好在 `mounted`（Vue 2）或 `onMounted`（Vue 3）中进行，因为此时模板已经挂载到 DOM 上。

3. **清理工作**：最好在 `beforeDestroy`（Vue 2）或 `onBeforeUnmount`（Vue 3）中进行，因为此时实例尚未销毁，可以访问到所有的属性和方法。

4. **避免在更新阶段修改数据**：在 `updated`（Vue 2）或 `onUpdated`（Vue 3）中修改数据可能会导致无限循环更新。

5. **使用 keep-alive**：当使用 keep-alive 缓存组件时，可以使用 `activated` 和 `deactivated`（Vue 3）生命周期函数来处理组件的激活和失活。

## 总结

Vue 2 和 Vue 3 的生命周期函数基本功能相似，但在组合式 API 中，Vue 3 对生命周期函数进行了调整，使其更加符合函数式编程的风格。了解生命周期函数的执行顺序和作用，对于编写高效、可维护的 Vue 应用至关重要。

通过合理使用生命周期函数，我们可以：
- 在适当的时机执行特定的操作
- 提高应用的性能
- 避免潜在的问题
- 使代码更加清晰、可维护
