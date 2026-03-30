---
title: Vue 3 常用指令详解
date: 2026-03-30
categories: Vue
---

# Vue 3 常用指令详解

## 前言

Vue 3 提供了一系列内置指令，这些指令是带有 `v-` 前缀的特殊属性，用于在模板中实现各种功能。本文将详细介绍 Vue 3 中最常用的指令及其用法。

## 1. v-model - 双向数据绑定

### 基本用法

`v-model` 指令用于在表单元素和组件之间创建双向数据绑定。

```vue
<template>
  <div>
    <input v-model="message" placeholder="请输入消息" />
    <p>您输入的消息: {{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const message = ref("");
</script>
```

### 修饰符

- **.lazy**: 只在输入框失去焦点或按下回车键时更新数据
- **.number**: 自动将输入值转换为数字
- **.trim**: 自动去除输入值的首尾空格

```vue
<input v-model.lazy="message" />
<input v-model.number="age" type="number" />
<input v-model.trim="username" />
```

## 2. v-for - 列表渲染

### 基本用法

`v-for` 指令用于基于数组渲染列表。

```vue
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from "vue";

const items = ref([
  { id: 1, name: "苹果" },
  { id: 2, name: "香蕉" },
  { id: 3, name: "橙子" },
]);
</script>
```

### 带索引的用法

```vue
<li v-for="(item, index) in items" :key="item.id">
  {{ index + 1 }}. {{ item.name }}
</li>
```

### 遍历对象

```vue
<div v-for="(value, key) in object" :key="key">
  {{ key }}: {{ value }}
</div>
```

## 3. v-if / v-else-if / v-else - 条件渲染

### 基本用法

`v-if` 指令用于根据条件渲染元素。

```vue
<template>
  <div>
    <p v-if="isLoggedIn">欢迎回来！</p>
    <p v-else>请登录</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isLoggedIn = ref(false);
</script>
```

### 多条件判断

```vue
<template>
  <div>
    <p v-if="score >= 90">优秀</p>
    <p v-else-if="score >= 80">良好</p>
    <p v-else-if="score >= 60">及格</p>
    <p v-else>不及格</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const score = ref(85);
</script>
```

## 4. v-show - 条件显示

`v-show` 指令用于根据条件显示或隐藏元素，与 `v-if` 不同，`v-show` 只是通过 CSS `display` 属性控制元素的显示和隐藏。

```vue
<template>
  <div>
    <p v-show="isVisible">这是一个可显示/隐藏的元素</p>
    <button @click="isVisible = !isVisible">
      {{ isVisible ? "隐藏" : "显示" }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isVisible = ref(true);
</script>
```

## 5. v-on - 事件监听

### 基本用法

`v-on` 指令用于监听 DOM 事件。

```vue
<template>
  <div>
    <button v-on:click="handleClick">点击我</button>
    <button @click="handleClick">点击我（简写）</button>
  </div>
</template>

<script setup>
const handleClick = () => {
  alert("按钮被点击了！");
};
</script>
```

### 事件修饰符

- **.stop**: 阻止事件冒泡
- **.prevent**: 阻止默认行为
- **.capture**: 事件捕获模式
- **.self**: 只当事件在元素本身触发时才执行
- **.once**: 事件只触发一次

```vue
<button @click.stop="handleClick">阻止冒泡</button>
<a @click.prevent="handleClick" href="#">阻止默认行为</a>
<button @click.once="handleClick">只触发一次</button>
```

### 按键修饰符

```vue
<input @keyup.enter="handleEnter" />
<input @keyup.esc="handleEsc" />
```

## 6. v-bind - 属性绑定

### 基本用法

`v-bind` 指令用于动态绑定 HTML 属性。

```vue
<template>
  <div>
    <img v-bind:src="imageUrl" alt="图片" />
    <img :src="imageUrl" alt="图片" />
  </div>
</template>

<script setup>
import { ref } from "vue";

const imageUrl = ref("https://example.com/image.jpg");
</script>
```

### 绑定对象

```vue
<template>
  <div :class="classObject">动态类名</div>
</template>

<script setup>
import { ref, computed } from "vue";

const isActive = ref(true);
const hasError = ref(false);

const classObject = computed(() => ({
  active: isActive.value,
  error: hasError.value,
}));
</script>
```

## 7. v-html - 原始 HTML

`v-html` 指令用于将字符串作为 HTML 插入到元素中。

```vue
<template>
  <div v-html="rawHtml"></div>
</template>

<script setup>
import { ref } from "vue";

const rawHtml = ref("<h1>Hello World</h1><p>This is raw HTML</p>");
</script>
```

> **注意**：使用 `v-html` 时要注意 XSS 攻击的风险，不要直接插入用户输入的内容。

## 8. v-text - 文本内容

`v-text` 指令用于设置元素的文本内容，相当于 `{{ }}` 插值表达式。

```vue
<template>
  <div v-text="message"></div>
  <div>{{ message }}</div>
  <!-- 等价写法 -->
</template>

<script setup>
import { ref } from "vue";

const message = ref("Hello Vue 3");
</script>
```

## 9. v-pre - 跳过编译

`v-pre` 指令用于跳过该元素及其子元素的编译过程。

```vue
<template>
  <div v-pre>
    {{ 这里的内容不会被编译 }}
  </div>
</template>
```

## 10. v-cloak - 防止闪烁

`v-cloak` 指令用于在 Vue 实例编译完成前隐藏元素，防止未编译的模板闪烁。

```vue
<template>
  <div v-cloak>{{ message }}</div>
</template>

<style>
[v-cloak] {
  display: none;
}
</style>

<script setup>
import { ref } from "vue";

const message = ref("Hello Vue 3");
</script>
```

## 11. v-once - 只渲染一次

`v-once` 指令用于只渲染元素或组件一次，之后即使数据变化也不会重新渲染。

```vue
<template>
  <div v-once>
    {{ message }}
    <!-- 即使 message 变化，这里也不会更新 -->
  </div>
  <div>
    {{ message }}
    <!-- 这里会随着 message 变化而更新 -->
  </div>
</template>

<script setup>
import { ref } from "vue";

const message = ref("Hello Vue 3");

// 一段时间后改变 message
setTimeout(() => {
  message.value = "Hello World";
}, 2000);
</script>
```

## 12. 自定义指令

Vue 3 允许我们创建自定义指令。

### 全局自定义指令

```javascript
// main.js
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

// 注册全局自定义指令
app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});

app.mount("#app");
```

### 局部自定义指令

```vue
<template>
  <input v-focus type="text" placeholder="自动获得焦点" />
</template>

<script setup>
// 注册局部自定义指令
const vFocus = {
  mounted(el) {
    el.focus();
  },
};
</script>
```

## 13. 指令的生命周期钩子

自定义指令可以定义以下生命周期钩子：

- **created**: 指令绑定到元素时调用
- **beforeMount**: 元素被插入到 DOM 前调用
- **mounted**: 元素被插入到 DOM 后调用
- **beforeUpdate**: 元素更新前调用
- **updated**: 元素更新后调用
- **beforeUnmount**: 元素被卸载前调用
- **unmounted**: 元素被卸载后调用

```javascript
app.directive("example", {
  created(el, binding) {
    console.log("指令绑定到元素");
  },
  mounted(el, binding) {
    console.log("元素被插入到 DOM");
  },
  updated(el, binding) {
    console.log("元素更新");
  },
  unmounted(el) {
    console.log("元素被卸载");
  },
});
```

## 14. 指令参数和修饰符

自定义指令可以接受参数和修饰符。

```vue
<template>
  <div v-mydirective:arg.modifier="value"></div>
</template>

<script setup>
const vMydirective = {
  mounted(el, binding) {
    console.log(binding.arg); // 输出: arg
    console.log(binding.modifier); // 输出: { modifier: true }
    console.log(binding.value); // 输出: value 的值
  },
};
</script>
```

## 15. 指令的应用场景

### 表单验证

```javascript
app.directive("validate", {
  mounted(el, binding) {
    el.addEventListener("blur", () => {
      const value = el.value;
      const rule = binding.value;

      if (!value) {
        el.classList.add("error");
        el.nextElementSibling.textContent = rule.message || "此字段不能为空";
      } else {
        el.classList.remove("error");
        el.nextElementSibling.textContent = "";
      }
    });
  },
});
```

### 滚动到底部

```javascript
app.directive("scroll-bottom", {
  updated(el) {
    el.scrollTop = el.scrollHeight;
  },
});
```

## 16. 指令与组合式 API

在组合式 API 中，我们可以使用 `directive` 函数来定义局部指令。

```vue
<template>
  <div v-my-directive="value"></div>
</template>

<script setup>
import { directive } from "vue";

const vMyDirective = directive("my-directive", {
  mounted(el, binding) {
    // 指令逻辑
  },
});

const value = ref("Hello");
</script>
```

## 17. 最佳实践

1. **优先使用组合式 API**：对于复杂的逻辑，优先使用组合式 API 而不是指令
2. **保持指令简单**：指令应该专注于 DOM 操作，不要包含复杂的业务逻辑
3. **使用指令的场景**：
   - DOM 操作和动画
   - 表单验证
   - 事件处理
   - 权限控制
4. **避免过度使用**：不要用指令替代组件，组件更适合处理复杂的 UI 逻辑

## 18. 常见问题与解决方案

### v-for 和 v-if 一起使用

**问题**：在同一个元素上同时使用 `v-for` 和 `v-if` 会导致性能问题。

**解决方案**：使用计算属性过滤数据，或者将 `v-if` 移到父元素上。

```vue
<template>
  <!-- 不推荐 -->
  <li v-for="item in items" v-if="item.active" :key="item.id">
    {{ item.name }}
  </li>

  <!-- 推荐 -->
  <li v-for="item in activeItems" :key="item.id">
    {{ item.name }}
  </li>
</template>

<script setup>
import { ref, computed } from "vue";

const items = ref([
  { id: 1, name: "苹果", active: true },
  { id: 2, name: "香蕉", active: false },
  { id: 3, name: "橙子", active: true },
]);

const activeItems = computed(() => {
  return items.value.filter((item) => item.active);
});
</script>
```

### 指令的性能优化

**问题**：频繁的指令操作可能会影响性能。

**解决方案**：

- 使用 `v-memo` 缓存指令的计算结果
- 避免在指令中进行复杂的计算
- 合理使用指令的生命周期钩子

## 19. 总结

Vue 3 的指令系统为我们提供了一种简洁、强大的方式来操作 DOM 和处理用户交互。通过本文的介绍，你应该已经掌握了 Vue 3 中常用指令的用法和最佳实践。

| 指令    | 作用         | 示例                                         |
| ------- | ------------ | -------------------------------------------- |
| v-model | 双向数据绑定 | `<input v-model="message" />`                |
| v-for   | 列表渲染     | `<li v-for="item in items" :key="item.id">`  |
| v-if    | 条件渲染     | `<p v-if="isLoggedIn">欢迎回来</p>`          |
| v-show  | 条件显示     | `<p v-show="isVisible">显示/隐藏</p>`        |
| v-on    | 事件监听     | `<button @click="handleClick">点击</button>` |
| v-bind  | 属性绑定     | `<img :src="imageUrl" />`                    |
| v-html  | 原始 HTML    | `<div v-html="rawHtml"></div>`               |
| v-text  | 文本内容     | `<div v-text="message"></div>`               |
| v-pre   | 跳过编译     | `<div v-pre>{{ 不编译 }}</div>`              |
| v-cloak | 防止闪烁     | `<div v-cloak>{{ message }}</div>`           |
| v-once  | 只渲染一次   | `<div v-once>{{ message }}</div>`            |

希望本文对你理解和使用 Vue 3 的指令有所帮助！
