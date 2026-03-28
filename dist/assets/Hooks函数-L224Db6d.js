var e=`---\r
title: React Hooks 函数详解\r
date: 2026-03-08\r
categories: React\r
---\r
\r
# React Hooks 函数详解\r
\r
## 什么是 React Hooks？\r
\r
React Hooks 是 React 16.8 引入的新特性，它允许我们在函数组件中使用状态（state）和其他 React 特性，而无需编写类组件。Hooks 让我们可以在不改变组件结构的情况下复用状态逻辑，使代码更加简洁、可维护。\r
\r
### Hooks 的优势\r
\r
- **代码复用**：可以将状态逻辑提取到自定义 Hooks 中，在多个组件之间复用\r
- **逻辑分离**：可以将相关的逻辑组织在一起，而不是分散在不同的生命周期方法中\r
- **函数组件**：可以在函数组件中使用状态和其他 React 特性，无需编写类组件\r
- **更简洁的代码**：减少了模板代码，使代码更加简洁、易读\r
\r
## 常用的 React Hooks\r
\r
### 1. useState\r
\r
\`useState\` 是最基本的 Hook，用于在函数组件中添加状态。\r
\r
\`\`\`javascript\r
import React, { useState } from "react";\r
\r
function Counter() {\r
  // 声明一个名为 count 的状态变量，初始值为 0\r
  const [count, setCount] = useState(0);\r
\r
  return (\r
    <div>\r
      <p>You clicked {count} times</p>\r
      <button onClick={() => setCount(count + 1)}>Click me</button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### 2. useEffect\r
\r
\`useEffect\` 用于在组件渲染后执行副作用操作，如数据获取、订阅或手动修改 DOM。\r
\r
\`\`\`javascript\r
import React, { useState, useEffect } from "react";\r
\r
function Example() {\r
  const [count, setCount] = useState(0);\r
\r
  // 类似于 componentDidMount 和 componentDidUpdate\r
  useEffect(() => {\r
    // 更新文档标题\r
    document.title = \`You clicked \${count} times\`;\r
\r
    // 清理函数，类似于 componentWillUnmount\r
    return () => {\r
      // 执行清理操作\r
    };\r
  });\r
\r
  return (\r
    <div>\r
      <p>You clicked {count} times</p>\r
      <button onClick={() => setCount(count + 1)}>Click me</button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### 3. useContext\r
\r
\`useContext\` 用于访问 React 的 Context API，在组件树中共享状态。\r
\r
\`\`\`javascript\r
import React, { useContext } from "react";\r
\r
// 创建 Context\r
const ThemeContext = React.createContext("light");\r
\r
function ThemedButton() {\r
  // 使用 useContext 访问 Context 值\r
  const theme = useContext(ThemeContext);\r
\r
  return (\r
    <button\r
      style={{\r
        background: theme === "dark" ? "#333" : "#fff",\r
        color: theme === "dark" ? "#fff" : "#333",\r
      }}\r
    >\r
      I am styled by theme context\r
    </button>\r
  );\r
}\r
\r
function App() {\r
  return (\r
    <ThemeContext.Provider value="dark">\r
      <ThemedButton />\r
    </ThemeContext.Provider>\r
  );\r
}\r
\`\`\`\r
\r
### 4. useReducer\r
\r
\`useReducer\` 是 \`useState\` 的替代方案，用于处理复杂的状态逻辑。\r
\r
\`\`\`javascript\r
import React, { useReducer } from "react";\r
\r
// 定义 reducer 函数\r
function counterReducer(state, action) {\r
  switch (action.type) {\r
    case "increment":\r
      return { count: state.count + 1 };\r
    case "decrement":\r
      return { count: state.count - 1 };\r
    case "reset":\r
      return { count: 0 };\r
    default:\r
      return state;\r
  }\r
}\r
\r
function Counter() {\r
  // 使用 useReducer\r
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });\r
\r
  return (\r
    <div>\r
      <p>Count: {state.count}</p>\r
      <button onClick={() => dispatch({ type: "increment" })}>+</button>\r
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>\r
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### 5. useCallback\r
\r
\`useCallback\` 用于缓存函数，避免在每次渲染时创建新的函数实例。\r
\r
\`\`\`javascript\r
import React, { useState, useCallback } from "react";\r
\r
function Button({ onClick, children }) {\r
  return <button onClick={onClick}>{children}</button>;\r
}\r
\r
function App() {\r
  const [count, setCount] = useState(0);\r
\r
  // 缓存 handleClick 函数\r
  const handleClick = useCallback(() => {\r
    setCount(count + 1);\r
  }, [count]); // 依赖项数组\r
\r
  return (\r
    <div>\r
      <p>Count: {count}</p>\r
      <Button onClick={handleClick}>Increment</Button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### 6. useMemo\r
\r
\`useMemo\` 用于缓存计算结果，避免在每次渲染时重复计算。\r
\r
\`\`\`javascript\r
import React, { useState, useMemo } from "react";\r
\r
function App() {\r
  const [count, setCount] = useState(0);\r
  const [text, setText] = useState("");\r
\r
  // 缓存计算结果\r
  const expensiveValue = useMemo(() => {\r
    console.log("Computing expensive value...");\r
    let result = 0;\r
    for (let i = 0; i < 100000000; i++) {\r
      result += i;\r
    }\r
    return result;\r
  }, []); // 空依赖数组，只计算一次\r
\r
  return (\r
    <div>\r
      <p>Count: {count}</p>\r
      <p>Expensive value: {expensiveValue}</p>\r
      <input\r
        value={text}\r
        onChange={(e) => setText(e.target.value)}\r
        placeholder="Type something"\r
      />\r
      <button onClick={() => setCount(count + 1)}>Increment</button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### 7. useRef\r
\r
\`useRef\` 用于创建一个可变的 ref 对象，在组件的整个生命周期中保持不变。\r
\r
\`\`\`javascript\r
import React, { useRef, useEffect } from "react";\r
\r
function App() {\r
  const inputRef = useRef(null);\r
\r
  useEffect(() => {\r
    // 聚焦输入框\r
    inputRef.current.focus();\r
  }, []);\r
\r
  return (\r
    <div>\r
      <input ref={inputRef} type="text" placeholder="Focused input" />\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### 8. useLayoutEffect\r
\r
\`useLayoutEffect\` 与 \`useEffect\` 类似，但它在所有 DOM 变更后同步执行，而不是在浏览器完成绘制后异步执行。\r
\r
\`\`\`javascript\r
import React, { useState, useLayoutEffect, useRef } from "react";\r
\r
function App() {\r
  const [count, setCount] = useState(0);\r
  const divRef = useRef(null);\r
\r
  useLayoutEffect(() => {\r
    // 同步执行，确保在浏览器绘制前完成\r
    if (divRef.current) {\r
      divRef.current.style.backgroundColor = count % 2 === 0 ? "red" : "blue";\r
    }\r
  }, [count]);\r
\r
  return (\r
    <div>\r
      <div ref={divRef} style={{ width: "100px", height: "100px" }}></div>\r
      <button onClick={() => setCount(count + 1)}>Change color</button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### 9. useImperativeHandle\r
\r
\`useImperativeHandle\` 用于自定义暴露给父组件的 ref 方法。\r
\r
\`\`\`javascript\r
import React, { useRef, useImperativeHandle, forwardRef } from "react";\r
\r
const FancyInput = forwardRef((props, ref) => {\r
  const inputRef = useRef(null);\r
\r
  // 自定义暴露给父组件的方法\r
  useImperativeHandle(ref, () => ({\r
    focus: () => {\r
      inputRef.current.focus();\r
    },\r
    clear: () => {\r
      inputRef.current.value = "";\r
    },\r
  }));\r
\r
  return <input ref={inputRef} {...props} />;\r
});\r
\r
function App() {\r
  const fancyInputRef = useRef(null);\r
\r
  const handleClick = () => {\r
    // 调用子组件暴露的方法\r
    fancyInputRef.current.focus();\r
  };\r
\r
  const handleClear = () => {\r
    // 调用子组件暴露的方法\r
    fancyInputRef.current.clear();\r
  };\r
\r
  return (\r
    <div>\r
      <FancyInput ref={fancyInputRef} placeholder="Fancy input" />\r
      <button onClick={handleClick}>Focus</button>\r
      <button onClick={handleClear}>Clear</button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### 10. useDebugValue\r
\r
\`useDebugValue\` 用于在 React DevTools 中显示自定义 Hook 的调试信息。\r
\r
\`\`\`javascript\r
import React, { useState, useDebugValue } from "react";\r
\r
function useCounter(initialValue = 0) {\r
  const [count, setCount] = useState(initialValue);\r
\r
  // 在 React DevTools 中显示调试信息\r
  useDebugValue(\`Count: \${count}\`);\r
\r
  const increment = () => setCount(count + 1);\r
  const decrement = () => setCount(count - 1);\r
\r
  return { count, increment, decrement };\r
}\r
\r
function App() {\r
  const { count, increment, decrement } = useCounter(0);\r
\r
  return (\r
    <div>\r
      <p>Count: {count}</p>\r
      <button onClick={increment}>+</button>\r
      <button onClick={decrement}>-</button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
## 自定义 Hooks\r
\r
自定义 Hooks 是一种复用状态逻辑的方式，它允许我们将组件逻辑提取到可重用的函数中。\r
\r
### 创建自定义 Hook\r
\r
\`\`\`javascript\r
import { useState, useEffect } from "react";\r
\r
// 自定义 Hook：使用本地存储保存状态\r
function useLocalStorage(key, initialValue) {\r
  // 从本地存储中获取初始值\r
  const [storedValue, setStoredValue] = useState(() => {\r
    try {\r
      const item = window.localStorage.getItem(key);\r
      return item ? JSON.parse(item) : initialValue;\r
    } catch (error) {\r
      console.error(error);\r
      return initialValue;\r
    }\r
  });\r
\r
  // 当值变化时，更新本地存储\r
  useEffect(() => {\r
    try {\r
      window.localStorage.setItem(key, JSON.stringify(storedValue));\r
    } catch (error) {\r
      console.error(error);\r
    }\r
  }, [key, storedValue]);\r
\r
  return [storedValue, setStoredValue];\r
}\r
\r
// 使用自定义 Hook\r
function App() {\r
  const [name, setName] = useLocalStorage("name", "");\r
\r
  return (\r
    <div>\r
      <input\r
        value={name}\r
        onChange={(e) => setName(e.target.value)}\r
        placeholder="Enter your name"\r
      />\r
      <p>Hello, {name}!</p>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### 自定义 Hook 的命名规则\r
\r
- 自定义 Hook 必须以 \`use\` 开头，这样 React 才能识别它是一个 Hook\r
- 自定义 Hook 可以调用其他 Hook\r
- 自定义 Hook 可以返回任意值，如状态、方法、对象等\r
\r
## Hooks 的使用规则\r
\r
1. **只在最顶层调用 Hook**：不要在循环、条件或嵌套函数中调用 Hook\r
2. **只在 React 函数中调用 Hook**：不要在普通的 JavaScript 函数中调用 Hook\r
3. **遵循 Hook 的命名约定**：自定义 Hook 必须以 \`use\` 开头\r
\r
### ESLint 规则\r
\r
React 提供了一个 ESLint 插件 \`eslint-plugin-react-hooks\`，用于检查 Hook 的使用规则：\r
\r
\`\`\`json\r
{\r
  "plugins": ["react-hooks"],\r
  "rules": {\r
    "react-hooks/rules-of-hooks": "error",\r
    "react-hooks/exhaustive-deps": "warn"\r
  }\r
}\r
\`\`\`\r
\r
## Hooks 的最佳实践\r
\r
### 1. 保持 Hook 依赖项的正确性\r
\r
\`\`\`javascript\r
// 错误：缺少依赖项\r
useEffect(() => {\r
  document.title = \`You clicked \${count} times\`;\r
}); // 缺少 count 依赖项\r
\r
// 正确：包含所有依赖项\r
useEffect(() => {\r
  document.title = \`You clicked \${count} times\`;\r
}, [count]); // 包含 count 依赖项\r
\`\`\`\r
\r
### 2. 优化性能\r
\r
- 使用 \`useCallback\` 缓存函数\r
- 使用 \`useMemo\` 缓存计算结果\r
- 合理设置依赖项数组，避免不必要的重新渲染\r
\r
### 3. 组织相关逻辑\r
\r
将相关的状态和副作用组织在一起，提高代码的可读性和可维护性。\r
\r
### 4. 使用自定义 Hook 复用逻辑\r
\r
将重复的状态逻辑提取到自定义 Hook 中，提高代码的复用性。\r
\r
### 5. 避免在 useEffect 中修改状态\r
\r
在 \`useEffect\` 中修改状态可能会导致无限循环，应该使用 \`useReducer\` 或其他方式处理复杂的状态逻辑。\r
\r
## 常见问题和解决方案\r
\r
### 1. 无限循环\r
\r
**问题**：在 \`useEffect\` 中修改状态，导致无限循环。\r
\r
**解决方案**：\r
\r
- 正确设置依赖项数组\r
- 使用 \`useReducer\` 处理复杂的状态逻辑\r
- 避免在 \`useEffect\` 中修改状态\r
\r
### 2. 依赖项警告\r
\r
**问题**：ESLint 警告缺少依赖项。\r
\r
**解决方案**：\r
\r
- 检查是否真的需要该依赖项\r
- 如果不需要，可以使用 \`useRef\` 或其他方式避免添加依赖项\r
- 如果需要，添加到依赖项数组中\r
\r
### 3. 状态更新不同步\r
\r
**问题**：使用旧的状态值更新状态。\r
\r
**解决方案**：\r
\r
- 使用函数式更新\r
- 使用 \`useReducer\` 处理复杂的状态逻辑\r
\r
\`\`\`javascript\r
// 错误：使用旧的状态值\r
setCount(count + 1);\r
setCount(count + 1); // 不会增加 2，因为两次使用的都是相同的 count 值\r
\r
// 正确：使用函数式更新\r
setCount((prevCount) => prevCount + 1);\r
setCount((prevCount) => prevCount + 1); // 会增加 2\r
\`\`\`\r
\r
### 4. 清理函数执行时机\r
\r
**问题**：\`useEffect\` 的清理函数执行时机不正确。\r
\r
**解决方案**：\r
\r
- 理解 \`useEffect\` 的执行机制\r
- 确保清理函数能够正确清理副作用\r
\r
\`\`\`javascript\r
useEffect(() => {\r
  // 订阅事件\r
  const subscription = someEvent.subscribe();\r
\r
  // 清理函数\r
  return () => {\r
    // 取消订阅\r
    subscription.unsubscribe();\r
  };\r
}, []);\r
\`\`\`\r
\r
## 总结\r
\r
React Hooks 是 React 16.8 引入的新特性，它允许我们在函数组件中使用状态和其他 React 特性，使代码更加简洁、可维护。通过合理使用 Hooks，我们可以：\r
\r
1. **复用状态逻辑**：通过自定义 Hook 复用状态逻辑\r
2. **组织相关逻辑**：将相关的状态和副作用组织在一起\r
3. **优化性能**：使用 \`useCallback\` 和 \`useMemo\` 优化性能\r
4. **简化代码**：减少模板代码，使代码更加简洁、易读\r
\r
掌握 React Hooks 对于编写现代 React 应用至关重要，它不仅可以提高开发效率，还可以使代码更加可维护。\r
\r
### 学习资源\r
\r
- [React 官方文档 - Hooks](https://react.dev/reference/react)\r
- [React Hooks 入门](https://react.dev/learn)\r
- [React Hooks 最佳实践](https://react.dev/blog/2020/05/22/react-hooks-best-practices)\r
\r
通过不断实践和学习，你会逐渐掌握 React Hooks 的使用技巧，编写出更加优雅、高效的 React 应用。\r
`;export{e as default};