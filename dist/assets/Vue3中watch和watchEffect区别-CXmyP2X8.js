var e=`---\r
title: Vue3中watch和watchEffect的区别\r
date: 2026-02-24\r
categories: Vue\r
---\r
\r
# Vue3中watch和watchEffect的区别\r
\r
## 前言\r
\r
在Vue3的Composition API中，\`watch\`和\`watchEffect\`是两个用于响应式数据监听的重要函数。它们都可以用来监听数据变化并执行相应的副作用，但在使用方式和行为上有一些重要的区别。本文将详细介绍这两个函数的区别、用法以及最佳实践。\r
\r
## 1. watch 函数\r
\r
\`watch\`函数是Vue2中watch选项的Composition API版本，它允许我们精确地监听特定的响应式数据，并在数据变化时执行回调函数。\r
\r
### 1.1 基本用法\r
\r
\`\`\`js\r
import { ref, watch } from "vue";\r
\r
const count = ref(0);\r
\r
// 监听单个数据源\r
watch(count, (newValue, oldValue) => {\r
  console.log(\`count变化了: \${oldValue} -> \${newValue}\`);\r
});\r
\r
// 监听多个数据源\r
const name = ref("Alice");\r
const age = ref(20);\r
\r
watch([name, age], ([newName, newAge], [oldName, oldAge]) => {\r
  console.log(\`name变化了: \${oldName} -> \${newName}\`);\r
  console.log(\`age变化了: \${oldAge} -> \${newAge}\`);\r
});\r
\`\`\`\r
\r
### 1.2 监听对象\r
\r
\`\`\`js\r
import { reactive, watch } from "vue";\r
\r
const person = reactive({\r
  name: "Alice",\r
  age: 20,\r
});\r
\r
// 监听整个对象\r
watch(\r
  person,\r
  (newValue, oldValue) => {\r
    console.log("person变化了:", newValue);\r
  },\r
  { deep: true },\r
); // 需要设置deep: true来深度监听\r
\r
// 监听对象的特定属性\r
watch(\r
  () => person.name,\r
  (newValue, oldValue) => {\r
    console.log(\`name变化了: \${oldValue} -> \${newValue}\`);\r
  },\r
);\r
\`\`\`\r
\r
### 1.3 配置选项\r
\r
\`\`\`js\r
watch(\r
  count,\r
  (newValue, oldValue) => {\r
    console.log(\`count变化了: \${oldValue} -> \${newValue}\`);\r
  },\r
  {\r
    immediate: true, // 立即执行一次\r
    deep: true, // 深度监听\r
    flush: "post", // 回调在DOM更新后执行\r
  },\r
);\r
\`\`\`\r
\r
## 2. watchEffect 函数\r
\r
\`watchEffect\`是Vue3新增的函数，它会自动追踪函数内部使用的所有响应式数据，并在任何依赖变化时重新执行。\r
\r
### 2.1 基本用法\r
\r
\`\`\`js\r
import { ref, watchEffect } from "vue";\r
\r
const count = ref(0);\r
const name = ref("Alice");\r
\r
// 自动追踪所有依赖\r
watchEffect(() => {\r
  console.log(\`count: \${count.value}, name: \${name.value}\`);\r
});\r
\r
// 当count或name变化时，回调会重新执行\r
count.value++; // 触发回调\r
name.value = "Bob"; // 触发回调\r
\`\`\`\r
\r
### 2.2 停止监听\r
\r
\`\`\`js\r
import { ref, watchEffect } from "vue";\r
\r
const count = ref(0);\r
\r
// watchEffect返回一个停止函数\r
const stop = watchEffect(() => {\r
  console.log(\`count: \${count.value}\`);\r
});\r
\r
// 停止监听\r
setTimeout(() => {\r
  stop();\r
  count.value++; // 不会触发回调\r
}, 1000);\r
\`\`\`\r
\r
### 2.3 清理副作用\r
\r
\`\`\`js\r
import { ref, watchEffect } from "vue";\r
\r
const id = ref(1);\r
\r
watchEffect((onCleanup) => {\r
  // 执行副作用\r
  const timer = setTimeout(() => {\r
    console.log(\`ID: \${id.value}\`);\r
  }, 1000);\r
\r
  // 清理函数\r
  onCleanup(() => {\r
    clearTimeout(timer);\r
  });\r
});\r
\r
// 当id变化时，会先执行清理函数，再执行新的副作用\r
id.value = 2;\r
\`\`\`\r
\r
## 3. 主要区别\r
\r
| 特性               | watch                            | watchEffect                              |\r
| ------------------ | -------------------------------- | ---------------------------------------- |\r
| **响应式依赖追踪** | 手动指定监听源                   | 自动追踪函数内使用的所有响应式数据       |\r
| **执行时机**       | 仅在数据源变化时执行             | 立即执行一次，然后在依赖变化时执行       |\r
| **参数**           | 接收新值和旧值                   | 不接收参数，只执行副作用函数             |\r
| **配置选项**       | 支持immediate、deep等选项        | 支持flush选项，控制执行时机              |\r
| **适用场景**       | 需要访问新旧值、需要控制监听时机 | 只需在依赖变化时执行副作用，无需访问旧值 |\r
\r
## 4. 详细对比\r
\r
### 4.1 依赖追踪方式\r
\r
**watch**：需要手动指定要监听的数据源，只有指定的数据源变化时才会触发回调。\r
\r
**watchEffect**：自动追踪函数内部使用的所有响应式数据，任何依赖变化都会触发重新执行。\r
\r
### 4.2 执行时机\r
\r
**watch**：默认情况下，只在数据源变化时执行回调，不会立即执行。可以通过\`immediate: true\`配置使其立即执行。\r
\r
**watchEffect**：总是立即执行一次，然后在依赖变化时重新执行。\r
\r
### 4.3 参数获取\r
\r
**watch**：回调函数接收两个参数，分别是新值和旧值，可以比较数据变化前后的状态。\r
\r
**watchEffect**：回调函数不接收参数，无法直接获取数据的旧值。\r
\r
### 4.4 配置选项\r
\r
**watch**：支持更多的配置选项，如\`immediate\`、\`deep\`、\`flush\`等。\r
\r
**watchEffect**：主要支持\`flush\`选项，控制回调的执行时机。\r
\r
## 5. 最佳实践\r
\r
### 5.1 何时使用 watch\r
\r
1. **需要访问旧值**：当你需要比较数据变化前后的状态时\r
2. **需要控制监听时机**：当你不需要立即执行，只在数据变化时执行\r
3. **需要深度监听**：当你需要监听对象的深层变化\r
4. **需要监听特定属性**：当你只需要监听对象的某个特定属性\r
\r
### 5.2 何时使用 watchEffect\r
\r
1. **自动追踪依赖**：当你希望自动追踪所有使用的响应式数据\r
2. **副作用清理**：当你需要在依赖变化时清理之前的副作用\r
3. **初始化和更新**：当你需要在初始化和依赖变化时都执行副作用\r
4. **简单的副作用**：当你只需要执行副作用，不需要访问旧值\r
\r
## 6. 代码示例\r
\r
### 6.1 使用 watch 的场景\r
\r
\`\`\`js\r
// 场景1: 需要比较新旧值\r
watch(\r
  () => user.value.name,\r
  (newName, oldName) => {\r
    if (newName !== oldName) {\r
      console.log(\`用户名从 \${oldName} 改为 \${newName}\`);\r
      // 发送API请求更新用户名\r
    }\r
  },\r
);\r
\r
// 场景2: 深度监听对象\r
watch(\r
  user,\r
  (newUser) => {\r
    console.log("用户信息变化:", newUser);\r
  },\r
  { deep: true },\r
);\r
\r
// 场景3: 延迟执行\r
watch(searchQuery, (newQuery) => {\r
  // 防抖处理\r
  clearTimeout(timer);\r
  timer = setTimeout(() => {\r
    fetchData(newQuery);\r
  }, 300);\r
});\r
\`\`\`\r
\r
### 6.2 使用 watchEffect 的场景\r
\r
\`\`\`js\r
// 场景1: 自动追踪依赖\r
watchEffect(() => {\r
  document.title = \`Count: \${count.value}\`;\r
});\r
\r
// 场景2: 副作用清理\r
watchEffect((onCleanup) => {\r
  const subscription = eventBus.subscribe("update", handleUpdate);\r
  onCleanup(() => {\r
    subscription.unsubscribe();\r
  });\r
});\r
\r
// 场景3: 组合多个依赖\r
watchEffect(() => {\r
  const { page, pageSize, sortBy } = filters.value;\r
  fetchData(page, pageSize, sortBy);\r
});\r
\`\`\`\r
\r
## 7. 注意事项\r
\r
### 7.1 watch 的注意事项\r
\r
1. **深度监听的性能问题**：深度监听可能会影响性能，特别是对于大型对象\r
2. **监听引用类型**：直接监听引用类型时，需要使用函数形式或设置deep: true\r
3. **回调执行时机**：默认在DOM更新前执行，可以通过flush: 'post'调整\r
\r
### 7.2 watchEffect 的注意事项\r
\r
1. **自动依赖追踪**：确保函数内部只使用需要追踪的响应式数据\r
2. **执行时机**：总是立即执行，可能会导致初始化时的副作用\r
3. **清理函数**：对于异步操作，一定要使用onCleanup清理副作用\r
\r
## 8. 总结\r
\r
\`watch\`和\`watchEffect\`都是Vue3中用于响应式数据监听的重要工具，它们各有优缺点和适用场景：\r
\r
- **watch**：更加精确和灵活，适合需要控制监听时机、访问旧值或深度监听的场景\r
- **watchEffect**：更加简洁和自动，适合需要自动追踪依赖、执行副作用并清理的场景\r
\r
在实际开发中，我们应该根据具体需求选择合适的函数：\r
\r
- 当需要比较新旧值或控制监听时机时，使用\`watch\`\r
- 当只需要在依赖变化时执行副作用，且不需要访问旧值时，使用\`watchEffect\`\r
\r
合理使用这两个函数，可以让我们的代码更加简洁、高效，同时避免不必要的性能开销。`;export{e as default};