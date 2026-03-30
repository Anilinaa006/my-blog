var e=`---\r
title: 深入理解防抖（Debounce）\r
date: 2026-02-15\r
categories: JavaScript\r
---\r
\r
# 深入理解防抖（Debounce）\r
\r
## 前言\r
\r
在前端开发中，我们经常会遇到一些需要频繁触发的事件，比如滚动事件、输入框输入事件、 resize 事件等。如果直接处理这些事件，可能会导致性能问题。防抖（Debounce）就是一种常用的性能优化技术，它可以有效地减少事件的触发频率，提高应用的性能。\r
\r
## 什么是防抖？\r
\r
**防抖**是一种函数优化技术，它的核心思想是：**当事件被触发后，延迟一段时间再执行回调函数，如果在这段时间内事件再次被触发，则重新计时**。\r
\r
简单来说，防抖就是让函数在一定时间内只执行一次，避免频繁执行导致的性能问题。\r
\r
## 防抖的实现\r
\r
### 基础实现\r
\r
\`\`\`javascript\r
function debounce(func, wait, immediate = false) {\r
  let timer = null; // 存储定时器\r
  return function (...args) {\r
    //保存上下文参数\r
    const context = this;\r
    // 如果有定时器，清除定时器\r
    if (timer) clearTimeout(timer);\r
\r
    //立即执行的逻辑\r
    if (immediate) {\r
      //判断是否是第一次触发\r
      const callNow = !timer;\r
      timer = setTimeout(() => {\r
        timer = null;\r
      }, wait);\r
      //首次触发时立即执行\r
      if (callNow) func.apply(context, args);\r
    } else {\r
      //非立即执行：重新设置定时器，wait时间后执行函数\r
      timer = setTimeout(() => {\r
        func.apply(context, args);\r
      }, wait);\r
    }\r
  };\r
}\r
\`\`\`\r
\r
### 代码解析\r
\r
1. **参数说明**：\r
   - \`func\`：需要防抖的函数\r
   - \`wait\`：等待时间，单位为毫秒\r
   - \`immediate\`：是否立即执行，默认为 false\r
\r
2. **核心逻辑**：\r
   - 使用闭包保存定时器 \`timer\`\r
   - 每次触发事件时，清除之前的定时器\r
   - 如果 \`immediate\` 为 true，则在首次触发时立即执行函数\r
   - 如果 \`immediate\` 为 false，则在等待时间后执行函数\r
\r
## 防抖的应用场景\r
\r
### 1. 输入框搜索\r
\r
当用户在输入框中输入内容时，我们通常会希望在用户停止输入后再发送搜索请求，而不是每次输入都发送请求。\r
\r
\`\`\`javascript\r
const searchInput = document.getElementById("search");\r
\r
function handleSearch(query) {\r
  console.log("搜索:", query);\r
  // 发送搜索请求\r
}\r
\r
// 使用防抖优化搜索\r
const debouncedSearch = debounce(handleSearch, 300);\r
\r
searchInput.addEventListener("input", (e) => {\r
  debouncedSearch(e.target.value);\r
});\r
\`\`\`\r
\r
### 2. 滚动事件处理\r
\r
滚动事件会频繁触发，使用防抖可以减少处理函数的执行次数。\r
\r
\`\`\`javascript\r
function handleScroll() {\r
  console.log("滚动位置:", window.scrollY);\r
  // 处理滚动逻辑\r
}\r
\r
// 使用防抖优化滚动处理\r
const debouncedScroll = debounce(handleScroll, 200);\r
\r
window.addEventListener("scroll", debouncedScroll);\r
\`\`\`\r
\r
### 3. 窗口 resize 事件\r
\r
窗口大小改变时，resize 事件会频繁触发，使用防抖可以优化性能。\r
\r
\`\`\`javascript\r
function handleResize() {\r
  console.log("窗口大小:", window.innerWidth, window.innerHeight);\r
  // 处理窗口大小改变的逻辑\r
}\r
\r
// 使用防抖优化 resize 处理\r
const debouncedResize = debounce(handleResize, 200);\r
\r
window.addEventListener("resize", debouncedResize);\r
\`\`\`\r
\r
### 4. 按钮点击防重复提交\r
\r
防止用户快速点击按钮导致的重复提交。\r
\r
\`\`\`javascript\r
const submitBtn = document.getElementById("submit");\r
\r
function handleSubmit() {\r
  console.log("提交表单");\r
  // 提交表单逻辑\r
}\r
\r
// 使用防抖防止重复提交\r
const debouncedSubmit = debounce(handleSubmit, 1000, true);\r
\r
submitBtn.addEventListener("click", debouncedSubmit);\r
\`\`\`\r
\r
## 防抖与节流的对比\r
\r
| 特性         | 防抖（Debounce）                                     | 节流（Throttle）                             |\r
| ------------ | ---------------------------------------------------- | -------------------------------------------- |\r
| **触发方式** | 事件触发后延迟执行，如果在延迟期间再次触发则重新计时 | 事件触发后立即执行，然后在一定时间内不再执行 |\r
| **执行频率** | 最后一次触发后的等待时间结束后执行一次               | 每隔一定时间执行一次                         |\r
| **应用场景** | 输入搜索、表单提交                                   | 滚动事件、游戏中的移动检测                   |\r
| **核心思想** | 合并多次操作，只执行最后一次                         | 限制执行频率，固定时间执行一次               |\r
\r
## 防抖的高级实现\r
\r
### 带取消功能的防抖\r
\r
\`\`\`javascript\r
function debounce(func, wait, immediate = false) {\r
  let timer = null;\r
\r
  const debounced = function (...args) {\r
    const context = this;\r
\r
    if (timer) clearTimeout(timer);\r
\r
    if (immediate) {\r
      const callNow = !timer;\r
      timer = setTimeout(() => {\r
        timer = null;\r
      }, wait);\r
      if (callNow) func.apply(context, args);\r
    } else {\r
      timer = setTimeout(() => {\r
        func.apply(context, args);\r
      }, wait);\r
    }\r
  };\r
\r
  // 添加取消方法\r
  debounced.cancel = function () {\r
    if (timer) {\r
      clearTimeout(timer);\r
      timer = null;\r
    }\r
  };\r
\r
  return debounced;\r
}\r
\`\`\`\r
\r
### 使用示例\r
\r
\`\`\`javascript\r
const debouncedFunction = debounce(() => {\r
  console.log("执行");\r
}, 1000);\r
\r
// 触发防抖函数\r
debouncedFunction();\r
\r
// 取消防抖\r
setTimeout(() => {\r
  debouncedFunction.cancel();\r
}, 500);\r
\`\`\`\r
\r
## 防抖在框架中的应用\r
\r
### Vue 中使用防抖\r
\r
\`\`\`vue\r
<template>\r
  <div>\r
    <input\r
      type="text"\r
      v-model="inputValue"\r
      @input="handleInput"\r
      placeholder="搜索..."\r
    />\r
  </div>\r
</template>\r
\r
<script>\r
export default {\r
  data() {\r
    return {\r
      inputValue: "",\r
    };\r
  },\r
  methods: {\r
    // 使用防抖处理输入\r
    handleInput: debounce(function () {\r
      console.log("搜索:", this.inputValue);\r
      // 发送搜索请求\r
    }, 300),\r
  },\r
};\r
<\/script>\r
\`\`\`\r
\r
### React 中使用防抖\r
\r
\`\`\`jsx\r
import React, { useState, useCallback } from "react";\r
\r
function SearchInput() {\r
  const [inputValue, setInputValue] = useState("");\r
\r
  // 使用 useCallback 和防抖\r
  const handleSearch = useCallback(\r
    debounce((query) => {\r
      console.log("搜索:", query);\r
      // 发送搜索请求\r
    }, 300),\r
    [],\r
  );\r
\r
  const handleInput = (e) => {\r
    const value = e.target.value;\r
    setInputValue(value);\r
    handleSearch(value);\r
  };\r
\r
  return (\r
    <input\r
      type="text"\r
      value={inputValue}\r
      onChange={handleInput}\r
      placeholder="搜索..."\r
    />\r
  );\r
}\r
\`\`\`\r
\r
## 性能优化建议\r
\r
1. **合理设置等待时间**：根据具体场景设置合适的等待时间，太短起不到防抖效果，太长会影响用户体验。\r
\r
2. **使用立即执行模式**：对于需要立即反馈的场景，使用 \`immediate: true\`。\r
\r
3. **结合节流使用**：在某些场景下，防抖和节流可以结合使用，达到更好的性能优化效果。\r
\r
4. **注意上下文绑定**：使用 \`apply\` 或 \`call\` 确保函数执行时的上下文正确。\r
\r
5. **添加取消功能**：在需要的时候可以取消防抖，提高灵活性。\r
\r
## 总结\r
\r
防抖是一种非常实用的性能优化技术，它可以有效地减少事件的触发频率，提高应用的性能。通过本文的介绍，我们了解了：\r
\r
1. 防抖的基本概念和实现原理\r
2. 防抖的应用场景\r
3. 防抖与节流的区别\r
4. 防抖的高级实现和框架中的应用\r
5. 性能优化建议\r
\r
合理使用防抖技术，可以让我们的应用更加流畅，提升用户体验。\r
`;export{e as default};