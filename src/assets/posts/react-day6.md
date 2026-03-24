---
title: React学习Day6 - 类组件与Zustand状态管理
date: 2026-03-06
categories: React
---

# React学习Day6 - 类组件与Zustand状态管理

## 前言

今天学习了React的类组件和Zustand状态管理库。虽然现在函数组件和Hooks是React的主流，但了解类组件仍然很重要，因为很多 legacy 代码库可能还在使用。同时，Zustand是一个轻量级的状态管理库，提供了一种简洁的方式来管理全局状态。本文将详细介绍React类组件的使用、生命周期函数、组件通信以及Zustand状态管理库的使用方法。

## 1. React类组件

React类组件是使用ES6类语法定义的组件，它继承自`React.Component`。

### 基本用法

```jsx
import React from "react";

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
    // 绑定方法
    this.handleIncrement = this.handleIncrement.bind(this);
  }

  handleIncrement() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <h1>Count: {this.state.count}</h1>
        <button onClick={this.handleIncrement}>增加</button>
      </div>
    );
  }
}

export default Counter;
```

### 类组件 vs 函数组件

- **类组件**：使用ES6类语法，有自己的this上下文，需要手动绑定方法，使用setState管理状态
- **函数组件**：使用函数语法，无this上下文，使用Hooks管理状态和副作用

## 2. React类组件的生命周期函数

React类组件的生命周期分为三个阶段：挂载、更新和卸载。

### 挂载阶段

1. **constructor**：构造函数，初始化状态和绑定方法
2. **getDerivedStateFromProps**：根据props更新state
3. **render**：渲染组件
4. **componentDidMount**：组件挂载后执行，适合进行API调用等副作用操作

### 更新阶段

1. **getDerivedStateFromProps**：根据props更新state
2. **shouldComponentUpdate**：决定是否重新渲染组件
3. **render**：渲染组件
4. **getSnapshotBeforeUpdate**：在DOM更新前获取快照
5. **componentDidUpdate**：组件更新后执行，适合处理更新后的副作用

### 卸载阶段

1. **componentWillUnmount**：组件卸载前执行，适合清理资源

### 生命周期函数示例

```jsx
import React from "react";

class LifecycleDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    console.log("1. constructor");
  }

  static getDerivedStateFromProps(props, state) {
    console.log("2. getDerivedStateFromProps");
    return null;
  }

  componentDidMount() {
    console.log("4. componentDidMount");
    // 适合进行API调用
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate");
    return true;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log("getSnapshotBeforeUpdate");
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("componentDidUpdate");
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
    // 清理资源
  }

  handleIncrement = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    console.log("3. render");
    return (
      <div>
        <h1>Count: {this.state.count}</h1>
        <button onClick={this.handleIncrement}>增加</button>
      </div>
    );
  }
}

export default LifecycleDemo;
```

## 3. React类组件的通信说明

### 3.1 父组件向子组件传递数据

通过props传递数据：

```jsx
// 父组件
class ParentComponent extends React.Component {
  state = {
    message: "Hello from parent",
  };

  render() {
    return (
      <div>
        <ChildComponent message={this.state.message} />
      </div>
    );
  }
}

// 子组件
class ChildComponent extends React.Component {
  render() {
    return <div>{this.props.message}</div>;
  }
}
```

### 3.2 子组件向父组件传递数据

通过回调函数传递数据：

```jsx
// 父组件
class ParentComponent extends React.Component {
  state = {
    childMessage: "",
  };

  handleChildMessage = (message) => {
    this.setState({ childMessage: message });
  };

  render() {
    return (
      <div>
        <ChildComponent onMessage={this.handleChildMessage} />
        <p>From child: {this.state.childMessage}</p>
      </div>
    );
  }
}

// 子组件
class ChildComponent extends React.Component {
  handleClick = () => {
    this.props.onMessage("Hello from child");
  };

  render() {
    return <button onClick={this.handleClick}>Send Message</button>;
  }
}
```

### 3.3 兄弟组件之间的通信

通过父组件作为中介：

```jsx
// 父组件
class ParentComponent extends React.Component {
  state = {
    message: "",
  };

  handleMessage = (message) => {
    this.setState({ message });
  };

  render() {
    return (
      <div>
        <SenderComponent onSend={this.handleMessage} />
        <ReceiverComponent message={this.state.message} />
      </div>
    );
  }
}

// 发送者组件
class SenderComponent extends React.Component {
  handleClick = () => {
    this.props.onSend("Hello from sender");
  };

  render() {
    return <button onClick={this.handleClick}>Send Message</button>;
  }
}

// 接收者组件
class ReceiverComponent extends React.Component {
  render() {
    return <div>{this.props.message}</div>;
  }
}
```

### 3.4 跨层级组件通信

使用Context API：

```jsx
// 创建Context
const MyContext = React.createContext();

// 父组件
class ParentComponent extends React.Component {
  state = {
    value: "Hello from context",
  };

  render() {
    return (
      <MyContext.Provider value={this.state.value}>
        <ChildComponent />
      </MyContext.Provider>
    );
  }
}

// 子组件
class ChildComponent extends React.Component {
  render() {
    return <GrandchildComponent />;
  }
}

// 孙组件
class GrandchildComponent extends React.Component {
  static contextType = MyContext;

  render() {
    return <div>{this.context}</div>;
  }
}
```

## 4. Zustand 状态管理

Zustand是一个轻量级的状态管理库，它提供了一种简洁的方式来管理全局状态，无需像Redux那样编写大量的模板代码。

### 4.1 安装Zustand

```bash
# 使用npm
npm install zustand

# 使用yarn
yarn add zustand
```

### 4.2 基本用法

```jsx
import create from "zustand";

// 创建store
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// 使用store
function Counter() {
  const { count, increment, decrement, reset } = useStore();

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>增加</button>
      <button onClick={decrement}>减少</button>
      <button onClick={reset}>重置</button>
    </div>
  );
}
```

### 4.3 更复杂的Store

```jsx
import create from "zustand";

const useTodoStore = create((set, get) => ({
  todos: [],
  filter: "all", // all, active, completed

  // 添加待办事项
  addTodo: (text) =>
    set((state) => ({
      todos: [...state.todos, { id: Date.now(), text, completed: false }],
    })),

  // 切换待办事项状态
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    })),

  // 删除待办事项
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),

  // 设置过滤器
  setFilter: (filter) => set({ filter }),

  // 获取过滤后的待办事项
  getFilteredTodos: () => {
    const { todos, filter } = get();
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  },
}));

// 使用store
function TodoList() {
  const todos = useTodoStore((state) => state.getFilteredTodos());
  const addTodo = useTodoStore((state) => state.addTodo);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const setFilter = useTodoStore((state) => state.setFilter);
  const filter = useTodoStore((state) => state.filter);

  const [inputText, setInputText] = React.useState("");

  const handleAddTodo = () => {
    if (inputText.trim()) {
      addTodo(inputText);
      setInputText("");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="输入待办事项"
      />
      <button onClick={handleAddTodo}>添加</button>

      <div>
        <button onClick={() => setFilter("all")}>全部</button>
        <button onClick={() => setFilter("active")}>未完成</button>
        <button onClick={() => setFilter("completed")}>已完成</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 4.4 Zustand的优势

1. **简单易用**：API简洁，无需编写大量模板代码
2. **轻量级**：体积小，性能好
3. **灵活**：支持中间件和持久化
4. **与React Hooks集成**：使用方式与React Hooks一致
5. **无需Provider**：不需要在应用顶层包裹Provider组件

### 4.5 Zustand中间件

#### 持久化中间件

```jsx
import create from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: "count-storage", // 存储的键名
    },
  ),
);
```

#### 日志中间件

```jsx
import create from "zustand";
import { devtools } from "zustand/middleware";

const useStore = create(
  devtools((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
  })),
);
```

## 5. 综合示例：类组件与Zustand结合

```jsx
import React from "react";
import create from "zustand";

// 创建Zustand store
const useUserStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({
        user: { id: 1, username, name: "John Doe" },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "登录失败",
        isLoading: false,
      });
    }
  },

  logout: () => set({ user: null }),
}));

// 类组件使用Zustand
class LoginForm extends React.Component {
  state = {
    username: "",
    password: "",
  };

  // 获取store中的状态和方法
  login = useUserStore.getState().login;
  isLoading = useUserStore((state) => state.isLoading);
  error = useUserStore((state) => state.error);

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    this.login(username, password);
  };

  render() {
    const { username, password } = this.state;
    const isLoading = useUserStore.getState().isLoading;
    const error = useUserStore.getState().error;

    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>用户名:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label>密码:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "登录中..." : "登录"}
        </button>
      </form>
    );
  }
}

// 函数组件使用Zustand
function UserProfile() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>
        欢迎, {user.name} ({user.username})
      </h1>
      <button onClick={logout}>退出登录</button>
    </div>
  );
}

export default UserProfile;
```

## 6. 最佳实践

### 6.1 类组件最佳实践

1. **使用箭头函数**：避免手动绑定this
2. **合理使用生命周期函数**：根据不同阶段执行相应的操作
3. **避免在render中创建函数**：可能导致性能问题
4. **使用shouldComponentUpdate优化性能**：避免不必要的渲染

### 6.2 Zustand最佳实践

1. **合理组织store**：按功能模块划分store
2. **使用选择器**：只订阅需要的状态，避免不必要的渲染
3. **使用中间件**：根据需要使用持久化、日志等中间件
4. **保持store简洁**：避免在store中放入过多的业务逻辑

## 总结

通过今天的学习，我们掌握了：

1. **React类组件**：基本用法、与函数组件的对比
2. **类组件生命周期**：挂载、更新、卸载三个阶段的生命周期函数
3. **组件通信**：父向子、子向父、兄弟组件、跨层级组件的通信方式
4. **Zustand状态管理**：基本用法、复杂store、中间件、与类组件的结合

虽然现在函数组件和Hooks是React的主流，但了解类组件仍然很重要，特别是在维护旧项目时。而Zustand作为一个轻量级的状态管理库，提供了一种简洁、高效的方式来管理全局状态，是Redux的良好替代品。

在实际开发中，我们应该根据具体场景选择合适的组件类型和状态管理方案，以提高代码的可维护性和性能。
