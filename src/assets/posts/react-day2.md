---
title: 从Vue到React，React学习Day2
date: 2026-03-19
tags: [React, 前端, 学习笔记, 组件通信, Redux]
categories: React
---

# React学习日记 - 第二天（组件通信与状态管理）

今天是学习React的第二天，主要学习了组件通信、自定义hooks、组件封装，以及比较了Vue和React的通信方式，还了解了Redux状态管理库。

## 组件通信

组件通信是React开发中的重要部分，今天学习了几种常见的组件通信方式：

### 1. 父子通信

**父组件向子组件传递数据**：通过props传递

```jsx
// 父组件
function Parent() {
  const [message, setMessage] = useState('Hello from parent');
  
  return (
    <div>
      <Child message={message} />
    </div>
  );
}

// 子组件
function Child(props) {
  return <div>{props.message}</div>;
}
```

**子组件向父组件传递数据**：通过回调函数

```jsx
// 父组件
function Parent() {
  const [count, setCount] = useState(0);
  
  const handleIncrement = (value) => {
    setCount(prevCount => prevCount + value);
  };
  
  return (
    <div>
      <Child onIncrement={handleIncrement} />
      <p>Count: {count}</p>
    </div>
  );
}

// 子组件
function Child(props) {
  return (
    <button onClick={() => props.onIncrement(1)}>
      Increment
    </button>
  );
}
```

### 2. 兄弟通信

**通过父组件作为中间层**：

```jsx
function Parent() {
  const [sharedData, setSharedData] = useState('');
  
  return (
    <div>
      <BrotherA onDataChange={setSharedData} />
      <BrotherB data={sharedData} />
    </div>
  );
}

function BrotherA(props) {
  const handleChange = (e) => {
    props.onDataChange(e.target.value);
  };
  
  return (
    <input type="text" onChange={handleChange} placeholder="Enter data" />
  );
}

function BrotherB(props) {
  return <p>Received data: {props.data}</p>;
}
```

### 3. 跨层通信

**使用Context API**：

```jsx
// 创建Context
const MyContext = createContext();

// 提供者组件
function Provider({ children }) {
  const [value, setValue] = useState('Context value');
  
  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
}

// 深层子组件
function DeepChild() {
  const { value, setValue } = useContext(MyContext);
  
  return (
    <div>
      <p>Context value: {value}</p>
      <button onClick={() => setValue('New value')}>
        Change value
      </button>
    </div>
  );
}

// 使用
function App() {
  return (
    <Provider>
      <DeepChild />
    </Provider>
  );
}
```

## 自定义Hooks

自定义Hooks允许我们复用逻辑，今天学习了如何创建和使用自定义Hooks：

```jsx
// 自定义Hook
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}

// 使用自定义Hook
function Counter() {
  const { count, increment, decrement, reset } = useCounter(10);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

## 组件封装

组件封装是提高代码复用性的重要方式，今天学习了如何封装一个可复用的Button组件：

```jsx
function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  onClick 
}) {
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };
  
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded-md
        transition-colors
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// 使用
function App() {
  return (
    <div>
      <Button>Primary Button</Button>
      <Button variant="secondary" size="small">
        Secondary Button
      </Button>
      <Button variant="danger" size="large" disabled>
        Disabled Button
      </Button>
    </div>
  );
}
```

## Vue与React通信方式对比

| 通信方式 | Vue | React |
|---------|-----|-------|
| 父子通信 | props / emit | props / 回调函数 |
| 兄弟通信 | EventBus / 父组件转发 | 父组件转发 |
| 跨层通信 | provide / inject | Context API |
| 状态管理 | Vuex / Pinia | Redux / Context API + useReducer |

### 主要区别

1. **API设计**：Vue提供了更简洁的API，如`emit`和`provide/inject`，而React更依赖函数式编程和Hooks
2. **状态管理**：Vue有专门的Vuex/Pinia，React有Redux，但React也可以使用Context API实现轻量级状态管理
3. **响应式系统**：Vue的响应式系统自动追踪依赖，React需要手动使用useState和useEffect

## Redux状态管理库

Redux是React生态中最流行的状态管理库之一，今天学习了Redux的基本概念：

### 核心概念

- **Store**：存储应用状态
- **Actions**：描述发生的事件
- **Reducers**：根据Action更新状态

### 基本使用

```jsx
// 1. 定义Action Types
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

// 2. 定义Actions
function increment() {
  return { type: INCREMENT };
}

function decrement() {
  return { type: DECREMENT };
}

// 3. 定义Reducer
function counterReducer(state = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    case DECREMENT:
      return state - 1;
    default:
      return state;
  }
}

// 4. 创建Store
const store = createStore(counterReducer);

// 5. 订阅Store变化
store.subscribe(() => {
  console.log('Current state:', store.getState());
});

// 6. 分发Action
store.dispatch(increment()); // Current state: 1
store.dispatch(increment()); // Current state: 2
store.dispatch(decrement()); // Current state: 1
```

## 学习案例

今天完成了几个React案例，巩固了所学知识：

### 案例1：Todo List
- 使用组件通信实现添加、删除、标记完成功能
- 使用Context API管理全局状态

### 案例2：计数器应用
- 使用自定义Hook封装计数器逻辑
- 实现多种计数功能

### 案例3：用户信息管理
- 使用Redux管理用户数据
- 实现用户列表、添加、编辑功能

## 学习心得

今天的学习内容比较多，主要是关于组件通信和状态管理，这些都是React开发中的核心概念。通过比较Vue和React的通信方式，我更清楚地理解了两种框架的设计理念。

### 学习重点

1. **组件通信**：掌握了父子、兄弟、跨层通信的实现方式
2. **自定义Hooks**：学会了如何创建和使用自定义Hooks来复用逻辑
3. **组件封装**：理解了如何封装可复用的组件
4. **状态管理**：了解了Redux的基本概念和使用方法

### 遇到的问题

1. **Context API的使用**：一开始对Context API的使用不太熟悉，通过实践逐渐理解了其工作原理
2. **Redux的复杂性**：Redux的概念比较抽象，需要更多时间来掌握

### 下一步计划

1. 深入学习Redux Toolkit，简化Redux的使用
2. 学习React Router，实现路由管理
3. 学习React的性能优化技巧
4. 构建一个完整的React应用

## 总结

第二天的学习让我对React的组件通信和状态管理有了更深入的理解。虽然有些概念比较抽象，但通过实践案例，我逐渐掌握了这些知识点。React的函数式编程思想和Hooks系统让代码更加简洁和可维护，这是我比较喜欢的地方。

期待第三天的学习！