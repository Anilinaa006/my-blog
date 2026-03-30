var e=`---
title: 从Vue到React，React学习Day1
date: 2026-03-01
tags: [React, Vue, 前端, 实习, 学习笔记]
categories: React
---

# React学习日记 - 从Vue小白到React新手

## 今天开始学React

作为一个学习了一年多的前端小白，之前一直用的是Vue，今天终于开始学React了。

## 第一天的感受：

之前稍微的看过React的文档，看到JSX的时候有点懵，这是什么东西？直接在JavaScript里写HTML？感觉好神奇，又有点奇怪。不过看了几个例子后，好像慢慢有点明白了。
然后就去网上找了一些网课资源看，想了解的更透彻，这可以算是学习react的第一天

### 和Vue的相似点

因为之前用过Vue，所以发现很多概念其实是相通的：

- **组件化**：和Vue一样，都是把页面拆成一个个小零件
- **状态管理**：React的useState感觉和Vue的ref有点像
- **虚拟DOM**：这个概念两者都有，虽然我还不是很理解具体怎么工作的
- **单向数据流**：数据从父组件传给子组件，这点和Vue一样

### 不一样的地方

| 特性     | React                       | Vue                           |
| -------- | --------------------------- | ----------------------------- |
| 模板写法 | JSX（直接在JS里写HTML）     | 单独的template标签，更像HTML  |
| 状态更新 | 要用setState函数            | 直接修改.value就可以          |
| 副作用   | useEffect（需要写依赖数组） | watch/watchEffect（自动追踪） |
| 指令     | 没有，用JS逻辑实现          | v-if, v-for这些指令           |

## 第一次写JSX

\`\`\`jsx
// 这是我写的第一个React组件
function Greeting() {
  const [name, setName] = useState("");

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p>Hello, {name || "world"}!</p>
    </div>
  );
}
\`\`\`

刚开始写的时候，总是忘记把class写成className，导致报错。还有那个onChange事件，要写e.target.value，和Vue的写法有点不一样，不过多写几次就习惯了。

## 今天学了几个Hook

### useState - 管理状态

\`\`\`javascript
const [count, setCount] = useState(0);

// 点击按钮时更新状态
<button onClick={() => setCount(count + 1)}>点击</button>;
\`\`\`

这个感觉和Vue的ref差不多，只是更新方式不一样。Vue是直接count.value++，React要调用setCount函数。

### useEffect - 处理副作用

这个刚开始听有点难理解，我看了几个例子才发现，其实没有那么难。它可以在组件渲染后做一些事情，比如请求数据、修改DOM什么的。

\`\`\`javascript
useEffect(() => {
  // 组件挂载后执行
  console.log("组件挂载了");

  // 组件卸载时执行
  return () => {
    console.log("组件要卸载了");
  };
}, []); // 空数组表示只执行一次
\`\`\`

### useRef - 访问DOM

这个用来获取DOM元素，和Vue的ref一样：

\`\`\`javascript
const inputRef = useRef(null);

// 聚焦输入框
const focusInput = () => {
  inputRef.current.focus();
};

// 在JSX中使用
<input ref={inputRef} type="text" />;
\`\`\`

## 遇到的坑

1. **JSX语法错误**：总是忘记用className，写了class就报错
2. **依赖数组**：useEffect的依赖数组总是不知道该写什么，有时候会导致无限循环
3. **状态更新**：React的状态更新是异步的，有时候想在更新后立即使用新值，结果拿到的还是旧值

## 今天做了什么

1. 成功搭建了React项目（用Vite创建的，和Vue一样方便）
2. 写了第一个React组件
3. 理解了useState、useEffect、useRef的基本用法
4. 对比着Vue，慢慢理解了React的逻辑
`;export{e as default};