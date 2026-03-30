var e=`---\r
title: 深入理解节流（Throttle）\r
date: 2026-02-16\r
categories: JavaScript\r
---\r
\r
# 深入理解节流（Throttle）\r
\r
## 前言\r
\r
在前端开发中，我们经常会遇到一些需要频繁触发的事件，比如滚动事件、鼠标移动事件、游戏中的动画事件等。如果直接处理这些事件，可能会导致性能问题。节流（Throttle）就是一种常用的性能优化技术，它可以有效地限制事件的触发频率，提高应用的性能。\r
\r
## 什么是节流？\r
\r
**节流**是一种函数优化技术，它的核心思想是：**限制函数在一定时间内只能执行一次，无论事件触发多少次**。\r
\r
简单来说，节流就是让函数按照固定的时间间隔执行，避免过于频繁的执行导致性能问题。\r
\r
## 节流的实现\r
\r
### 1. 时间戳实现\r
\r
\`\`\`javascript\r
function throttle(func, wait) {\r
  let previous = 0; // 记录上一次执行的时间戳\r
  return function (...args) {\r
    const now = Date.now(); // 当前时间戳\r
    const context = this;\r
\r
    // 如果当前时间与上一次执行时间的差大于等于等待时间，则执行函数\r
    if (now - previous >= wait) {\r
      func.apply(context, args);\r
      previous = now; // 更新上一次执行的时间戳\r
    }\r
  };\r
}\r
\`\`\`\r
\r
### 2. 定时器实现\r
\r
\`\`\`javascript\r
function throttle(func, wait) {\r
  let timer = null; // 存储定时器\r
  return function (...args) {\r
    const context = this;\r
\r
    // 如果没有定时器，则设置定时器\r
    if (!timer) {\r
      timer = setTimeout(() => {\r
        func.apply(context, args);\r
        timer = null; // 执行后清除定时器\r
      }, wait);\r
    }\r
  };\r
}\r
\`\`\`\r
\r
### 3. 综合实现（推荐）\r
\r
结合时间戳和定时器的优点，实现一个更加完善的节流函数：\r
\r
\`\`\`javascript\r
function throttle(func, wait, options = {}) {\r
  let timer = null;\r
  let previous = 0;\r
\r
  // 默认配置\r
  const { leading = true, trailing = true } = options;\r
\r
  return function (...args) {\r
    const now = Date.now();\r
    const context = this;\r
\r
    // 如果是第一次执行且不允许立即执行，则设置 previous 为当前时间\r
    if (!previous && !leading) {\r
      previous = now;\r
    }\r
\r
    // 计算剩余时间\r
    const remaining = wait - (now - previous);\r
\r
    // 如果剩余时间小于等于0，执行函数\r
    if (remaining <= 0 || remaining > wait) {\r
      if (timer) {\r
        clearTimeout(timer);\r
        timer = null;\r
      }\r
      func.apply(context, args);\r
      previous = now;\r
    } else if (!timer && trailing) {\r
      // 如果没有定时器且允许 trailing 执行，则设置定时器\r
      timer = setTimeout(() => {\r
        previous = leading ? Date.now() : 0;\r
        timer = null;\r
        func.apply(context, args);\r
      }, remaining);\r
    }\r
  };\r
}\r
\`\`\`\r
\r
### 代码解析\r
\r
1. **参数说明**：\r
   - \`func\`：需要节流的函数\r
   - \`wait\`：时间间隔，单位为毫秒\r
   - \`options\`：配置选项\r
     - \`leading\`：是否在开始时立即执行，默认为 true\r
     - \`trailing\`：是否在结束时执行，默认为 true\r
\r
2. **核心逻辑**：\r
   - 使用时间戳记录上一次执行的时间\r
   - 计算当前时间与上一次执行时间的差\r
   - 如果时间差大于等于等待时间，则执行函数\r
   - 结合定时器实现 trailing 执行\r
\r
## 节流的应用场景\r
\r
### 1. 滚动事件\r
\r
滚动事件会频繁触发，使用节流可以限制处理函数的执行频率。\r
\r
\`\`\`javascript\r
function handleScroll() {\r
  console.log("滚动位置:", window.scrollY);\r
  // 处理滚动逻辑，如懒加载、滚动动画等\r
}\r
\r
// 使用节流优化滚动处理\r
const throttledScroll = throttle(handleScroll, 100);\r
\r
window.addEventListener("scroll", throttledScroll);\r
\`\`\`\r
\r
### 2. 游戏中的移动检测\r
\r
在游戏开发中，需要频繁检测玩家的移动，但不需要每帧都处理。\r
\r
\`\`\`javascript\r
function handleMovement() {\r
  // 处理玩家移动逻辑\r
  console.log("处理移动");\r
}\r
\r
// 使用节流限制移动检测频率\r
const throttledMovement = throttle(handleMovement, 16); // 约60fps\r
\r
// 游戏主循环\r
function gameLoop() {\r
  throttledMovement();\r
  requestAnimationFrame(gameLoop);\r
}\r
\r
gameLoop();\r
\`\`\`\r
\r
### 3. 鼠标移动事件\r
\r
鼠标移动事件会非常频繁地触发，使用节流可以优化性能。\r
\r
\`\`\`javascript\r
function handleMouseMove(e) {\r
  console.log("鼠标位置:", e.clientX, e.clientY);\r
  // 处理鼠标移动逻辑，如跟随效果等\r
}\r
\r
// 使用节流优化鼠标移动处理\r
const throttledMouseMove = throttle(handleMouseMove, 50);\r
\r
window.addEventListener("mousemove", throttledMouseMove);\r
\`\`\`\r
\r
### 4. 高频点击事件\r
\r
对于需要限制点击频率的场景，如按钮点击、游戏中的攻击等。\r
\r
\`\`\`javascript\r
const attackBtn = document.getElementById("attack");\r
\r
function handleAttack() {\r
  console.log("攻击");\r
  // 处理攻击逻辑\r
}\r
\r
// 使用节流限制攻击频率\r
const throttledAttack = throttle(handleAttack, 1000);\r
\r
attackBtn.addEventListener("click", throttledAttack);\r
\`\`\`\r
\r
## 节流与防抖的对比\r
\r
| 特性         | 节流（Throttle）                             | 防抖（Debounce）                                     |\r
| ------------ | -------------------------------------------- | ---------------------------------------------------- |\r
| **触发方式** | 事件触发后立即执行，然后在一定时间内不再执行 | 事件触发后延迟执行，如果在延迟期间再次触发则重新计时 |\r
| **执行频率** | 每隔一定时间执行一次                         | 最后一次触发后的等待时间结束后执行一次               |\r
| **应用场景** | 滚动事件、游戏中的移动检测、鼠标移动事件     | 输入搜索、表单提交、窗口 resize 事件                 |\r
| **核心思想** | 限制执行频率，固定时间执行一次               | 合并多次操作，只执行最后一次                         |\r
\r
## 节流的高级实现\r
\r
### 带取消功能的节流\r
\r
\`\`\`javascript\r
function throttle(func, wait, options = {}) {\r
  let timer = null;\r
  let previous = 0;\r
\r
  const { leading = true, trailing = true } = options;\r
\r
  const throttled = function (...args) {\r
    const now = Date.now();\r
    const context = this;\r
\r
    if (!previous && !leading) {\r
      previous = now;\r
    }\r
\r
    const remaining = wait - (now - previous);\r
\r
    if (remaining <= 0 || remaining > wait) {\r
      if (timer) {\r
        clearTimeout(timer);\r
        timer = null;\r
      }\r
      func.apply(context, args);\r
      previous = now;\r
    } else if (!timer && trailing) {\r
      timer = setTimeout(() => {\r
        previous = leading ? Date.now() : 0;\r
        timer = null;\r
        func.apply(context, args);\r
      }, remaining);\r
    }\r
  };\r
\r
  // 添加取消方法\r
  throttled.cancel = function () {\r
    if (timer) {\r
      clearTimeout(timer);\r
      timer = null;\r
    }\r
    previous = 0;\r
  };\r
\r
  return throttled;\r
}\r
\`\`\`\r
\r
### 使用示例\r
\r
\`\`\`javascript\r
const throttledFunction = throttle(() => {\r
  console.log("执行");\r
}, 1000);\r
\r
// 触发节流函数\r
throttledFunction();\r
\r
// 取消节流\r
setTimeout(() => {\r
  throttledFunction.cancel();\r
}, 500);\r
\`\`\`\r
\r
## 节流在框架中的应用\r
\r
### Vue 中使用节流\r
\r
\`\`\`vue\r
<template>\r
  <div>\r
    <div class="scroll-container" @scroll="handleScroll">\r
      <!-- 滚动内容 -->\r
    </div>\r
  </div>\r
</template>\r
\r
<script>\r
export default {\r
  methods: {\r
    // 使用节流处理滚动\r
    handleScroll: throttle(function () {\r
      console.log("滚动位置:", this.$refs.container.scrollTop);\r
      // 处理滚动逻辑\r
    }, 100),\r
  },\r
};\r
<\/script>\r
\`\`\`\r
\r
### React 中使用节流\r
\r
\`\`\`jsx\r
import React, { useCallback } from "react";\r
\r
function ScrollComponent() {\r
  // 使用 useCallback 和节流\r
  const handleScroll = useCallback(\r
    throttle((e) => {\r
      console.log("滚动位置:", e.target.scrollTop);\r
      // 处理滚动逻辑\r
    }, 100),\r
    [],\r
  );\r
\r
  return (\r
    <div\r
      className="scroll-container"\r
      onScroll={handleScroll}\r
      style={{ height: "400px", overflow: "auto" }}\r
    >\r
      {/* 滚动内容 */}\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
## 性能优化建议\r
\r
1. **合理设置时间间隔**：根据具体场景设置合适的时间间隔，太短起不到节流效果，太长会影响用户体验。\r
\r
2. **选择合适的实现方式**：根据具体需求选择时间戳实现、定时器实现或综合实现。\r
\r
3. **合理使用 leading 和 trailing**：\r
   - \`leading: true\`：适合需要立即反馈的场景\r
   - \`trailing: true\`：适合需要处理最终状态的场景\r
\r
4. **注意上下文绑定**：使用 \`apply\` 或 \`call\` 确保函数执行时的上下文正确。\r
\r
5. **添加取消功能**：在需要的时候可以取消节流，提高灵活性。\r
\r
6. **结合防抖使用**：在某些场景下，节流和防抖可以结合使用，达到更好的性能优化效果。\r
\r
## 总结\r
\r
节流是一种非常实用的性能优化技术，它可以有效地限制事件的触发频率，提高应用的性能。通过本文的介绍，我们了解了：\r
\r
1. 节流的基本概念和实现原理\r
2. 节流的不同实现方式（时间戳、定时器、综合实现）\r
3. 节流的应用场景\r
4. 节流与防抖的区别\r
5. 节流的高级实现和框架中的应用\r
6. 性能优化建议\r
\r
合理使用节流技术，可以让我们的应用更加流畅，提升用户体验，特别是在处理高频触发的事件时。\r
`;export{e as default};