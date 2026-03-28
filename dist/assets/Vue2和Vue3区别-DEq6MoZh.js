var e=`---
title: Vue 2 和 Vue 3 区别详解
date: 2026-02-20
categories: Vue
---

# Vue 2 和 Vue 3 区别详解

## 前言

Vue.js 是目前最流行的前端框架之一，从 Vue 2 到 Vue 3 的升级带来了许多重要的变化和改进。作为前端开发者，了解这些区别对于我们选择合适的版本以及进行迁移都非常重要。本文将详细对比 Vue 2 和 Vue 3 的主要区别。

## 1. 响应式系统的变化

### Vue 2 的响应式系统

Vue 2 使用 \`Object.defineProperty()\` 来实现响应式系统：

\`\`\`javascript
// Vue 2 内部实现原理
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 依赖收集
      track(obj, key);
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        val = newVal;
        // 触发更新
        trigger(obj, key);
      }
    },
  });
}
\`\`\`

**局限性**：

- 无法检测对象属性的添加和删除
- 无法检测数组的索引和长度变化
- 需要深度遍历对象，性能开销较大

### Vue 3 的响应式系统

Vue 3 使用 \`Proxy\` 来实现响应式系统：

\`\`\`javascript
// Vue 3 内部实现原理
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      // 依赖收集
      track(target, key);
      // 递归处理嵌套对象
      if (typeof result === "object" && result !== null) {
        return reactive(result);
      }
      return result;
    },
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver);
      const result = Reflect.set(target, key, value, receiver);
      // 触发更新
      if (oldValue !== value) {
        trigger(target, key);
      }
      return result;
    },
    deleteProperty(target, key) {
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      const result = Reflect.deleteProperty(target, key);
      // 触发更新
      if (hadKey) {
        trigger(target, key);
      }
      return result;
    },
  });
}
\`\`\`

**优势**：

- 可以检测对象属性的添加和删除
- 可以检测数组的索引和长度变化
- 不需要深度遍历对象，性能更好
- 支持 Map、Set 等新的集合类型

## 2. 组合式 API (Composition API)

### Vue 2 的选项式 API (Options API)

Vue 2 使用选项式 API，将代码按照功能划分为不同的选项：

\`\`\`javascript
// Vue 2 组件
export default {
  data() {
    return {
      count: 0,
      message: "Hello",
    };
  },
  methods: {
    increment() {
      this.count++;
    },
  },
  computed: {
    doubleCount() {
      return this.count * 2;
    },
  },
  watch: {
    count(newVal, oldVal) {
      console.log(\`Count changed from \${oldVal} to \${newVal}\`);
    },
  },
  mounted() {
    console.log("Component mounted");
  },
};
\`\`\`

**局限性**：

- 逻辑分散在不同选项中，难以复用
- 大型组件代码难以维护
- TypeScript 支持不够友好

### Vue 3 的组合式 API (Composition API)

Vue 3 引入了组合式 API，允许我们按照逻辑关注点组织代码：

\`\`\`javascript
// Vue 3 组件
import { ref, computed, watch, onMounted } from "vue";

export default {
  setup() {
    // 响应式状态
    const count = ref(0);
    const message = ref("Hello");

    // 计算属性
    const doubleCount = computed(() => count.value * 2);

    // 方法
    const increment = () => {
      count.value++;
    };

    // 监听器
    watch(count, (newVal, oldVal) => {
      console.log(\`Count changed from \${oldVal} to \${newVal}\`);
    });

    // 生命周期
    onMounted(() => {
      console.log("Component mounted");
    });

    // 返回暴露给模板的内容
    return {
      count,
      message,
      doubleCount,
      increment,
    };
  },
};
\`\`\`

**优势**：

- 逻辑可以按功能组织，便于维护
- 更好的代码复用性
- 更好的 TypeScript 支持
- 更灵活的代码组织方式

## 3. 生命周期钩子的变化

### Vue 2 的生命周期钩子

\`\`\`javascript
export default {
  beforeCreate() {
    /* ... */
  },
  created() {
    /* ... */
  },
  beforeMount() {
    /* ... */
  },
  mounted() {
    /* ... */
  },
  beforeUpdate() {
    /* ... */
  },
  updated() {
    /* ... */
  },
  beforeDestroy() {
    /* ... */
  },
  destroyed() {
    /* ... */
  },
};
\`\`\`

### Vue 3 的生命周期钩子

Vue 3 保留了大部分生命周期钩子，但名称有所变化，并且需要从 Vue 中导入：

\`\`\`javascript
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
} from "vue";

export default {
  setup() {
    onBeforeMount(() => {
      /* ... */
    });
    onMounted(() => {
      /* ... */
    });
    onBeforeUpdate(() => {
      /* ... */
    });
    onUpdated(() => {
      /* ... */
    });
    onBeforeUnmount(() => {
      /* ... */
    });
    onUnmounted(() => {
      /* ... */
    });
    onErrorCaptured(() => {
      /* ... */
    });
  },
};
\`\`\`

**主要变化**：

- \`beforeDestroy\` 改为 \`onBeforeUnmount\`
- \`destroyed\` 改为 \`onUnmounted\`
- 新增了一些生命周期钩子，如 \`onRenderTracked\` 和 \`onRenderTriggered\`

## 4. 模板语法的改进

### Vue 3 新增的模板语法

#### 4.1 多根节点

Vue 3 支持组件有多个根节点：

\`\`\`vue
<!-- Vue 3 组件 -->
<template>
  <div>Hello</div>
  <div>World</div>
</template>
\`\`\`

#### 4.2 片段 (Fragments)

Vue 3 内置了片段功能，不需要额外的包装元素：

\`\`\`vue
<!-- Vue 3 组件 -->
<template>
  <table>
    <tr>
      <MyComponent />
    </tr>
  </table>
</template>

<!-- MyComponent.vue -->
<template>
  <td>Cell 1</td>
  <td>Cell 2</td>
</template>
\`\`\`

#### 4.3 teleport

Vue 3 新增了 \`teleport\` 组件，可以将内容渲染到指定的 DOM 位置：

\`\`\`vue
<template>
  <teleport to="#modal-container">
    <div class="modal">
      <h2>Modal</h2>
      <p>This is a modal</p>
    </div>
  </teleport>
</template>
\`\`\`

#### 4.4 Suspense

Vue 3 新增了 \`Suspense\` 组件，用于处理异步组件的加载状态：

\`\`\`vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
\`\`\`

## 5. 性能优化

### 5.1 编译优化

Vue 3 的编译器做了很多优化：

- 静态提升：将静态节点提升到渲染函数之外
- 预字符串化：将静态内容编译为字符串
- 缓存事件处理函数：避免每次渲染都创建新的函数
- 块树优化：只更新变化的块

### 5.2 运行时优化

- 响应式系统使用 Proxy，性能更好
- 虚拟 DOM 算法优化，减少了比较次数
- 内存使用优化，减少了内存占用

### 5.3 包体积优化

- Vue 3 的核心包体积比 Vue 2 小
- 支持 tree-shaking，只打包使用的功能

## 6. 其他新特性

### 6.1 全局 API 的变化

Vue 3 对全局 API 进行了重构，采用了模块化的方式：

\`\`\`javascript
// Vue 2
import Vue from "vue";
Vue.use(plugin);
Vue.mixin(mixin);

// Vue 3
import { createApp } from "vue";
const app = createApp({});
app.use(plugin);
app.mixin(mixin);
\`\`\`

### 6.2 自定义渲染器

Vue 3 提供了自定义渲染器 API，允许我们创建自定义的渲染器：

\`\`\`javascript
import { createRenderer } from "vue";

const renderer = createRenderer({
  patchProp,
  insert,
  remove,
  createElement,
});

const app = renderer.createApp({});
app.mount("#app");
\`\`\`

### 6.3 更好的 TypeScript 支持

Vue 3 是用 TypeScript 编写的，提供了更好的 TypeScript 支持：

- 完整的类型定义
- 更好的类型推断
- 支持泛型组件

## 7. 迁移指南

### 7.1 渐进式迁移

Vue 3 提供了兼容模式，可以渐进式迁移：

1. 安装 \`@vue/compat\` 包
2. 在构建工具中配置兼容模式
3. 逐步迁移组件

### 7.2 主要迁移步骤

1. 更新依赖
2. 检查并更新全局 API 的使用
3. 迁移组件到组合式 API（可选）
4. 检查并更新生命周期钩子
5. 检查并更新模板语法
6. 测试应用

## 8. 总结

| 特性                | Vue 2                 | Vue 3                         |
| ------------------- | --------------------- | ----------------------------- |
| **响应式系统**      | Object.defineProperty | Proxy                         |
| **API 风格**        | 选项式 API            | 选项式 API + 组合式 API       |
| **生命周期**        | 选项式钩子            | 组合式钩子                    |
| **模板语法**        | 单根节点              | 多根节点 + 片段               |
| **性能**            | 一般                  | 更好                          |
| **包体积**          | 较大                  | 较小                          |
| **TypeScript 支持** | 一般                  | 更好                          |
| **新特性**          | 较少                  | 较多（teleport, suspense 等） |

## 9. 如何选择

- **新项目**：推荐使用 Vue 3，享受其带来的性能提升和新特性
- **现有项目**：如果稳定运行，可暂时保持 Vue 2；如果需要新特性或性能优化，可考虑迁移
- **小型项目**：Vue 2 和 Vue 3 都可以，根据个人偏好选择
- **大型项目**：推荐使用 Vue 3，特别是使用 TypeScript 的项目
`;export{e as default};