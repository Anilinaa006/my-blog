---
title: React 前端实习生面试题目
date: 2026-06-23
categories: React
---

# React 前端实习生面试题目

## 一、React 基础知识

### 1. 什么是 React？它的核心特点是什么？

**答案：**
React 是由 Facebook 开发的用于构建用户界面的 JavaScript 库。它的核心特点包括：
- 组件化开发：将 UI 拆分为独立的、可复用的组件
- 虚拟 DOM：通过虚拟 DOM 减少实际 DOM 操作，提升性能
- 单向数据流：数据从父组件流向子组件，便于追踪数据变化
- JSX：允许在 JavaScript 中编写类似 HTML 的语法

### 2. JSX 是什么？为什么要用它？

**答案：**
JSX 是 JavaScript XML 的缩写，是一种在 React 中使用的语法扩展，允许在 JavaScript 代码中直接编写类似 HTML 的结构。

使用 JSX 的好处：
- 代码更加直观，类似 HTML 的结构更容易理解
- 可以在 JSX 中直接使用 JavaScript 表达式
- 提供了编译时的类型检查和语法提示

### 3. React 组件的两种形式是什么？它们有什么区别？

**答案：**
React 组件分为两种形式：

1. **函数组件**：使用函数定义，接收 props 作为参数，返回 JSX
2. **类组件**：使用 ES6 类定义，需要继承 React.Component，通过 render 方法返回 JSX

**区别：**
- 函数组件更简洁，代码量更少
- 类组件可以使用生命周期方法和 state
- Hooks 出现后，函数组件也可以使用 state 和副作用

## 二、组件与 Props

### 1. 什么是 Props？它的特点是什么？

**答案：**
Props（Properties 的缩写）是组件间传递数据的方式，是父组件传递给子组件的数据。

Props 的特点：
- 只读性：子组件不能修改 props，只能使用
- 单向流动：数据从父组件流向子组件
- 类型检查：可以通过 PropTypes 或 TypeScript 进行类型验证

### 2. 如何定义组件的默认 Props？

**答案：**
有两种方式可以定义默认 Props：

```jsx
// 方式一：使用 defaultProps
function MyComponent(props) {
  return <div>{props.name}</div>;
}
MyComponent.defaultProps = {
  name: '默认名称'
};

// 方式二：使用 ES6 默认参数
function MyComponent({ name = '默认名称' }) {
  return <div>{name}</div>;
}
```

### 3. Props 和 State 的区别是什么？

**答案：**
- **Props**：从父组件传递下来的数据，子组件只读，不可修改
- **State**：组件内部维护的数据，组件可以自行修改，修改后会触发重新渲染

## 三、状态管理

### 1. 什么是 State？如何在函数组件中使用 State？

**答案：**
State 是组件内部维护的可变数据，当 State 变化时，组件会重新渲染。

在函数组件中使用 `useState` Hook：

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

### 2. useState 的初始值可以是函数吗？什么时候使用函数作为初始值？

**答案：**
可以。当初始值的计算成本较高时，应该使用函数作为初始值，这样只会在组件首次渲染时执行一次。

```jsx
// 初始值计算成本较高时使用函数
const [data, setData] = useState(() => {
  return expensiveComputation();
});
```

### 3. 如何在组件间共享状态？

**答案：**
- **提升状态**：将共享状态提升到共同的父组件中
- **Context API**：使用 React Context 在组件树中共享数据
- **状态管理库**：如 Redux、Zustand 等

## 四、生命周期

### 1. 函数组件中的生命周期对应哪些 Hooks？

**答案：**
函数组件使用 Hooks 来模拟类组件的生命周期：

| 类组件生命周期 | Hooks 对应 |
|--------------|-----------|
| componentDidMount | useEffect(() => {}, []) |
| componentDidUpdate | useEffect(() => {}, [dependencies]) |
| componentWillUnmount | useEffect(() => { return cleanup }, []) |

### 2. useEffect 的依赖数组有什么作用？

**答案：**
依赖数组控制 useEffect 的执行时机：

- **空数组 []**：只在组件挂载时执行一次
- **包含依赖项**：当依赖项发生变化时执行
- **没有依赖数组**：每次组件渲染都执行

### 3. 使用 useEffect 时需要注意什么？

**答案：**
- 清理副作用：如果 useEffect 中订阅了事件或定时器，需要在返回函数中清理
- 依赖数组要完整：确保所有在 useEffect 中使用的变量都在依赖数组中
- 避免无限循环：注意 setState 在 useEffect 中的使用

## 五、Hooks

### 1. 常用的 React Hooks 有哪些？

**答案：**
- `useState`：管理组件状态
- `useEffect`：处理副作用
- `useContext`：获取 Context 中的数据
- `useReducer`：复杂状态管理
- `useCallback`：缓存函数引用
- `useMemo`：缓存计算结果
- `useRef`：获取 DOM 元素或保存跨渲染的值

### 2. useCallback 和 useMemo 的区别是什么？

**答案：**
- `useCallback`：缓存函数的引用，避免不必要的函数重新创建
- `useMemo`：缓存计算结果，避免不必要的重复计算

```jsx
// useCallback：缓存函数
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);

// useMemo：缓存计算结果
const sum = useMemo(() => {
  return a + b;
}, [a, b]);
```

### 3. useRef 的用途有哪些？

**答案：**
- 获取 DOM 元素的引用
- 保存跨渲染周期不变的值
- 存储定时器 ID 等

```jsx
function MyComponent() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  return <input ref={inputRef} />;
}
```

## 六、性能优化

### 1. React 中的性能优化策略有哪些？

**答案：**
- 使用 React.memo 避免组件不必要的重渲染
- 使用 useCallback 和 useMemo 缓存函数和计算结果
- 使用虚拟列表处理大量数据（如 react-window）
- 避免在渲染中创建新对象或函数
- 使用 useRef 保存不变的引用

### 2. React.memo 和 useMemo 的区别是什么？

**答案：**
- `React.memo`：高阶组件，用于缓存组件的渲染结果，避免父组件更新时子组件不必要的重渲染
- `useMemo`：Hook，用于缓存计算结果，避免每次渲染都重复计算

### 3. 什么是虚拟列表？为什么需要它？

**答案：**
虚拟列表是一种只渲染可见区域数据的技术，当列表数据量很大时，只渲染当前视口内的元素，从而提升性能。

使用虚拟列表的原因：
- 减少 DOM 节点数量
- 降低内存占用
- 提升页面滚动流畅度

## 七、路由

### 1. React Router 的基本使用方法是什么？

**答案：**
```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 2. 如何在组件中获取路由参数？

**答案：**
使用 `useParams` Hook：

```jsx
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { userId } = useParams();
  return <div>用户 ID: {userId}</div>;
}
```

### 3. 编程式导航如何实现？

**答案：**
使用 `useNavigate` Hook：

```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/about');
    // 或带状态
    navigate('/about', { state: { from: 'home' } });
    // 返回上一页
    navigate(-1);
  };
  
  return <button onClick={handleClick}>跳转</button>;
}
```

## 八、综合问题

### 1. 如何处理异步请求？

**答案：**
在 useEffect 中进行异步请求：

```jsx
import { useState, useEffect } from 'react';

function DataFetching() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.example.com/data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

### 2. 什么是受控组件和非受控组件？

**答案：**
- **受控组件**：表单数据由 React 组件的 state 控制，每次值变化都会触发 onChange 事件更新 state
- **非受控组件**：表单数据由 DOM 自身管理，使用 ref 来获取表单值

```jsx
// 受控组件
function ControlledInput() {
  const [value, setValue] = useState('');
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

// 非受控组件
function UncontrolledInput() {
  const inputRef = useRef(null);
  const handleSubmit = () => {
    console.log(inputRef.current?.value);
  };
  return <input ref={inputRef} />;
}
```

### 3. React 中的 key 有什么作用？

**答案：**
key 帮助 React 识别列表中哪些元素改变了、添加了或删除了，提高渲染性能。

注意事项：
- key 应该是唯一的，且稳定不变
- 不要使用数组索引作为 key
- key 只在兄弟节点间需要唯一

### 4. 如何实现组件的通信？

**答案：**
- **父子组件**：通过 props 和回调函数
- **兄弟组件**：通过共同的父组件或状态管理库
- **跨层级组件**：通过 Context API 或状态管理库

### 5. 你了解哪些状态管理方案？

**答案：**
- **React Context**：适合简单的全局状态共享
- **Redux**：适合复杂的大型应用，有严格的单向数据流
- **Zustand**：轻量级状态管理，API 简洁
- **Jotai**：基于原子的状态管理
- **MobX**：响应式状态管理

## 九、算法与逻辑

### 1. 实现一个简单的防抖函数

**答案：**
```jsx
function debounce(func, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// 使用
const handleSearch = debounce((keyword) => {
  console.log('搜索:', keyword);
}, 300);
```

### 2. 实现一个简单的节流函数

**答案：**
```jsx
function throttle(func, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// 使用
const handleScroll = throttle(() => {
  console.log('滚动');
}, 100);
```

### 3. 实现一个深拷贝函数

**答案：**
```jsx
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  
  if (hash.has(obj)) return hash.get(obj);
  
  const clone = Array.isArray(obj) ? [] : {};
  hash.set(obj, clone);
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], hash);
    }
  }
  
  return clone;
}
```

## 十、项目经验

### 1. 你做过的最有挑战性的项目是什么？你是如何解决问题的？

**答案：**
（根据个人经历回答，重点描述遇到的挑战、解决思路和最终成果）

### 2. 在团队开发中，你如何保证代码质量？

**答案：**
- 使用 ESLint 和 Prettier 规范代码风格
- 编写单元测试和集成测试
- 进行代码审查（Code Review）
- 遵循团队的代码规范和最佳实践

### 3. 你学习新技术的方法是什么？

**答案：**
- 阅读官方文档
- 跟随教程进行实践
- 参与开源项目
- 写博客总结学习心得

## 总结

以上是 React 前端实习生面试中常见的题目，涵盖了 React 的核心概念、Hooks、性能优化、路由等方面。准备面试时，建议不仅要记住答案，更要理解背后的原理，并能够通过实际代码来展示你的理解。