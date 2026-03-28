---
title: React Hooks 函数详解
date: 2026-03-08
categories: React
---

# React Hooks 函数详解

## 什么是 React Hooks？

React Hooks 是 React 16.8 引入的新特性，它允许我们在函数组件中使用状态（state）和其他 React 特性，而无需编写类组件。Hooks 让我们可以在不改变组件结构的情况下复用状态逻辑，使代码更加简洁、可维护。

### Hooks 的优势

- **代码复用**：可以将状态逻辑提取到自定义 Hooks 中，在多个组件之间复用
- **逻辑分离**：可以将相关的逻辑组织在一起，而不是分散在不同的生命周期方法中
- **函数组件**：可以在函数组件中使用状态和其他 React 特性，无需编写类组件
- **更简洁的代码**：减少了模板代码，使代码更加简洁、易读

## 常用的 React Hooks

### 1. useState

`useState` 是最基本的 Hook，用于在函数组件中添加状态。

```javascript
import React, { useState } from "react";

function Counter() {
  // 声明一个名为 count 的状态变量，初始值为 0
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### 2. useEffect

`useEffect` 用于在组件渲染后执行副作用操作，如数据获取、订阅或手动修改 DOM。

```javascript
import React, { useState, useEffect } from "react";

function Example() {
  const [count, setCount] = useState(0);

  // 类似于 componentDidMount 和 componentDidUpdate
  useEffect(() => {
    // 更新文档标题
    document.title = `You clicked ${count} times`;

    // 清理函数，类似于 componentWillUnmount
    return () => {
      // 执行清理操作
    };
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### 3. useContext

`useContext` 用于访问 React 的 Context API，在组件树中共享状态。

```javascript
import React, { useContext } from "react";

// 创建 Context
const ThemeContext = React.createContext("light");

function ThemedButton() {
  // 使用 useContext 访问 Context 值
  const theme = useContext(ThemeContext);

  return (
    <button
      style={{
        background: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#fff" : "#333",
      }}
    >
      I am styled by theme context
    </button>
  );
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}
```

### 4. useReducer

`useReducer` 是 `useState` 的替代方案，用于处理复杂的状态逻辑。

```javascript
import React, { useReducer } from "react";

// 定义 reducer 函数
function counterReducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    default:
      return state;
  }
}

function Counter() {
  // 使用 useReducer
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
}
```

### 5. useCallback

`useCallback` 用于缓存函数，避免在每次渲染时创建新的函数实例。

```javascript
import React, { useState, useCallback } from "react";

function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}

function App() {
  const [count, setCount] = useState(0);

  // 缓存 handleClick 函数
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]); // 依赖项数组

  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={handleClick}>Increment</Button>
    </div>
  );
}
```

### 6. useMemo

`useMemo` 用于缓存计算结果，避免在每次渲染时重复计算。

```javascript
import React, { useState, useMemo } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // 缓存计算结果
  const expensiveValue = useMemo(() => {
    console.log("Computing expensive value...");
    let result = 0;
    for (let i = 0; i < 100000000; i++) {
      result += i;
    }
    return result;
  }, []); // 空依赖数组，只计算一次

  return (
    <div>
      <p>Count: {count}</p>
      <p>Expensive value: {expensiveValue}</p>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something"
      />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### 7. useRef

`useRef` 用于创建一个可变的 ref 对象，在组件的整个生命周期中保持不变。

```javascript
import React, { useRef, useEffect } from "react";

function App() {
  const inputRef = useRef(null);

  useEffect(() => {
    // 聚焦输入框
    inputRef.current.focus();
  }, []);

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Focused input" />
    </div>
  );
}
```

### 8. useLayoutEffect

`useLayoutEffect` 与 `useEffect` 类似，但它在所有 DOM 变更后同步执行，而不是在浏览器完成绘制后异步执行。

```javascript
import React, { useState, useLayoutEffect, useRef } from "react";

function App() {
  const [count, setCount] = useState(0);
  const divRef = useRef(null);

  useLayoutEffect(() => {
    // 同步执行，确保在浏览器绘制前完成
    if (divRef.current) {
      divRef.current.style.backgroundColor = count % 2 === 0 ? "red" : "blue";
    }
  }, [count]);

  return (
    <div>
      <div ref={divRef} style={{ width: "100px", height: "100px" }}></div>
      <button onClick={() => setCount(count + 1)}>Change color</button>
    </div>
  );
}
```

### 9. useImperativeHandle

`useImperativeHandle` 用于自定义暴露给父组件的 ref 方法。

```javascript
import React, { useRef, useImperativeHandle, forwardRef } from "react";

const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  // 自定义暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.value = "";
    },
  }));

  return <input ref={inputRef} {...props} />;
});

function App() {
  const fancyInputRef = useRef(null);

  const handleClick = () => {
    // 调用子组件暴露的方法
    fancyInputRef.current.focus();
  };

  const handleClear = () => {
    // 调用子组件暴露的方法
    fancyInputRef.current.clear();
  };

  return (
    <div>
      <FancyInput ref={fancyInputRef} placeholder="Fancy input" />
      <button onClick={handleClick}>Focus</button>
      <button onClick={handleClear}>Clear</button>
    </div>
  );
}
```

### 10. useDebugValue

`useDebugValue` 用于在 React DevTools 中显示自定义 Hook 的调试信息。

```javascript
import React, { useState, useDebugValue } from "react";

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  // 在 React DevTools 中显示调试信息
  useDebugValue(`Count: ${count}`);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return { count, increment, decrement };
}

function App() {
  const { count, increment, decrement } = useCounter(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

## 自定义 Hooks

自定义 Hooks 是一种复用状态逻辑的方式，它允许我们将组件逻辑提取到可重用的函数中。

### 创建自定义 Hook

```javascript
import { useState, useEffect } from "react";

// 自定义 Hook：使用本地存储保存状态
function useLocalStorage(key, initialValue) {
  // 从本地存储中获取初始值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // 当值变化时，更新本地存储
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// 使用自定义 Hook
function App() {
  const [name, setName] = useLocalStorage("name", "");

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name}!</p>
    </div>
  );
}
```

### 自定义 Hook 的命名规则

- 自定义 Hook 必须以 `use` 开头，这样 React 才能识别它是一个 Hook
- 自定义 Hook 可以调用其他 Hook
- 自定义 Hook 可以返回任意值，如状态、方法、对象等

## Hooks 的使用规则

1. **只在最顶层调用 Hook**：不要在循环、条件或嵌套函数中调用 Hook
2. **只在 React 函数中调用 Hook**：不要在普通的 JavaScript 函数中调用 Hook
3. **遵循 Hook 的命名约定**：自定义 Hook 必须以 `use` 开头

### ESLint 规则

React 提供了一个 ESLint 插件 `eslint-plugin-react-hooks`，用于检查 Hook 的使用规则：

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## Hooks 的最佳实践

### 1. 保持 Hook 依赖项的正确性

```javascript
// 错误：缺少依赖项
useEffect(() => {
  document.title = `You clicked ${count} times`;
}); // 缺少 count 依赖项

// 正确：包含所有依赖项
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 包含 count 依赖项
```

### 2. 优化性能

- 使用 `useCallback` 缓存函数
- 使用 `useMemo` 缓存计算结果
- 合理设置依赖项数组，避免不必要的重新渲染

### 3. 组织相关逻辑

将相关的状态和副作用组织在一起，提高代码的可读性和可维护性。

### 4. 使用自定义 Hook 复用逻辑

将重复的状态逻辑提取到自定义 Hook 中，提高代码的复用性。

### 5. 避免在 useEffect 中修改状态

在 `useEffect` 中修改状态可能会导致无限循环，应该使用 `useReducer` 或其他方式处理复杂的状态逻辑。

## 常见问题和解决方案

### 1. 无限循环

**问题**：在 `useEffect` 中修改状态，导致无限循环。

**解决方案**：

- 正确设置依赖项数组
- 使用 `useReducer` 处理复杂的状态逻辑
- 避免在 `useEffect` 中修改状态

### 2. 依赖项警告

**问题**：ESLint 警告缺少依赖项。

**解决方案**：

- 检查是否真的需要该依赖项
- 如果不需要，可以使用 `useRef` 或其他方式避免添加依赖项
- 如果需要，添加到依赖项数组中

### 3. 状态更新不同步

**问题**：使用旧的状态值更新状态。

**解决方案**：

- 使用函数式更新
- 使用 `useReducer` 处理复杂的状态逻辑

```javascript
// 错误：使用旧的状态值
setCount(count + 1);
setCount(count + 1); // 不会增加 2，因为两次使用的都是相同的 count 值

// 正确：使用函数式更新
setCount((prevCount) => prevCount + 1);
setCount((prevCount) => prevCount + 1); // 会增加 2
```

### 4. 清理函数执行时机

**问题**：`useEffect` 的清理函数执行时机不正确。

**解决方案**：

- 理解 `useEffect` 的执行机制
- 确保清理函数能够正确清理副作用

```javascript
useEffect(() => {
  // 订阅事件
  const subscription = someEvent.subscribe();

  // 清理函数
  return () => {
    // 取消订阅
    subscription.unsubscribe();
  };
}, []);
```

## 总结

React Hooks 是 React 16.8 引入的新特性，它允许我们在函数组件中使用状态和其他 React 特性，使代码更加简洁、可维护。通过合理使用 Hooks，我们可以：

1. **复用状态逻辑**：通过自定义 Hook 复用状态逻辑
2. **组织相关逻辑**：将相关的状态和副作用组织在一起
3. **优化性能**：使用 `useCallback` 和 `useMemo` 优化性能
4. **简化代码**：减少模板代码，使代码更加简洁、易读

掌握 React Hooks 对于编写现代 React 应用至关重要，它不仅可以提高开发效率，还可以使代码更加可维护。

### 学习资源

- [React 官方文档 - Hooks](https://react.dev/reference/react)
- [React Hooks 入门](https://react.dev/learn)
- [React Hooks 最佳实践](https://react.dev/blog/2020/05/22/react-hooks-best-practices)

通过不断实践和学习，你会逐渐掌握 React Hooks 的使用技巧，编写出更加优雅、高效的 React 应用。
