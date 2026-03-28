var e=`---\r
title: React学习Day6 - 类组件与Zustand状态管理\r
date: 2026-03-06\r
categories: React\r
---\r
\r
# React学习Day6 - 类组件与Zustand状态管理\r
\r
## 前言\r
\r
今天学习了React的类组件和Zustand状态管理库。虽然现在函数组件和Hooks是React的主流，但了解类组件仍然很重要，因为很多 legacy 代码库可能还在使用。同时，Zustand是一个轻量级的状态管理库，提供了一种简洁的方式来管理全局状态。本文将详细介绍React类组件的使用、生命周期函数、组件通信以及Zustand状态管理库的使用方法。\r
\r
## 1. React类组件\r
\r
React类组件是使用ES6类语法定义的组件，它继承自\`React.Component\`。\r
\r
### 基本用法\r
\r
\`\`\`jsx\r
import React from "react";\r
\r
class Counter extends React.Component {\r
  constructor(props) {\r
    super(props);\r
    this.state = {\r
      count: 0,\r
    };\r
    // 绑定方法\r
    this.handleIncrement = this.handleIncrement.bind(this);\r
  }\r
\r
  handleIncrement() {\r
    this.setState({ count: this.state.count + 1 });\r
  }\r
\r
  render() {\r
    return (\r
      <div>\r
        <h1>Count: {this.state.count}</h1>\r
        <button onClick={this.handleIncrement}>增加</button>\r
      </div>\r
    );\r
  }\r
}\r
\r
export default Counter;\r
\`\`\`\r
\r
### 类组件 vs 函数组件\r
\r
- **类组件**：使用ES6类语法，有自己的this上下文，需要手动绑定方法，使用setState管理状态\r
- **函数组件**：使用函数语法，无this上下文，使用Hooks管理状态和副作用\r
\r
## 2. React类组件的生命周期函数\r
\r
React类组件的生命周期分为三个阶段：挂载、更新和卸载。\r
\r
### 挂载阶段\r
\r
1. **constructor**：构造函数，初始化状态和绑定方法\r
2. **getDerivedStateFromProps**：根据props更新state\r
3. **render**：渲染组件\r
4. **componentDidMount**：组件挂载后执行，适合进行API调用等副作用操作\r
\r
### 更新阶段\r
\r
1. **getDerivedStateFromProps**：根据props更新state\r
2. **shouldComponentUpdate**：决定是否重新渲染组件\r
3. **render**：渲染组件\r
4. **getSnapshotBeforeUpdate**：在DOM更新前获取快照\r
5. **componentDidUpdate**：组件更新后执行，适合处理更新后的副作用\r
\r
### 卸载阶段\r
\r
1. **componentWillUnmount**：组件卸载前执行，适合清理资源\r
\r
### 生命周期函数示例\r
\r
\`\`\`jsx\r
import React from "react";\r
\r
class LifecycleDemo extends React.Component {\r
  constructor(props) {\r
    super(props);\r
    this.state = { count: 0 };\r
    console.log("1. constructor");\r
  }\r
\r
  static getDerivedStateFromProps(props, state) {\r
    console.log("2. getDerivedStateFromProps");\r
    return null;\r
  }\r
\r
  componentDidMount() {\r
    console.log("4. componentDidMount");\r
    // 适合进行API调用\r
  }\r
\r
  shouldComponentUpdate(nextProps, nextState) {\r
    console.log("shouldComponentUpdate");\r
    return true;\r
  }\r
\r
  getSnapshotBeforeUpdate(prevProps, prevState) {\r
    console.log("getSnapshotBeforeUpdate");\r
    return null;\r
  }\r
\r
  componentDidUpdate(prevProps, prevState, snapshot) {\r
    console.log("componentDidUpdate");\r
  }\r
\r
  componentWillUnmount() {\r
    console.log("componentWillUnmount");\r
    // 清理资源\r
  }\r
\r
  handleIncrement = () => {\r
    this.setState({ count: this.state.count + 1 });\r
  };\r
\r
  render() {\r
    console.log("3. render");\r
    return (\r
      <div>\r
        <h1>Count: {this.state.count}</h1>\r
        <button onClick={this.handleIncrement}>增加</button>\r
      </div>\r
    );\r
  }\r
}\r
\r
export default LifecycleDemo;\r
\`\`\`\r
\r
## 3. React类组件的通信说明\r
\r
### 3.1 父组件向子组件传递数据\r
\r
通过props传递数据：\r
\r
\`\`\`jsx\r
// 父组件\r
class ParentComponent extends React.Component {\r
  state = {\r
    message: "Hello from parent",\r
  };\r
\r
  render() {\r
    return (\r
      <div>\r
        <ChildComponent message={this.state.message} />\r
      </div>\r
    );\r
  }\r
}\r
\r
// 子组件\r
class ChildComponent extends React.Component {\r
  render() {\r
    return <div>{this.props.message}</div>;\r
  }\r
}\r
\`\`\`\r
\r
### 3.2 子组件向父组件传递数据\r
\r
通过回调函数传递数据：\r
\r
\`\`\`jsx\r
// 父组件\r
class ParentComponent extends React.Component {\r
  state = {\r
    childMessage: "",\r
  };\r
\r
  handleChildMessage = (message) => {\r
    this.setState({ childMessage: message });\r
  };\r
\r
  render() {\r
    return (\r
      <div>\r
        <ChildComponent onMessage={this.handleChildMessage} />\r
        <p>From child: {this.state.childMessage}</p>\r
      </div>\r
    );\r
  }\r
}\r
\r
// 子组件\r
class ChildComponent extends React.Component {\r
  handleClick = () => {\r
    this.props.onMessage("Hello from child");\r
  };\r
\r
  render() {\r
    return <button onClick={this.handleClick}>Send Message</button>;\r
  }\r
}\r
\`\`\`\r
\r
### 3.3 兄弟组件之间的通信\r
\r
通过父组件作为中介：\r
\r
\`\`\`jsx\r
// 父组件\r
class ParentComponent extends React.Component {\r
  state = {\r
    message: "",\r
  };\r
\r
  handleMessage = (message) => {\r
    this.setState({ message });\r
  };\r
\r
  render() {\r
    return (\r
      <div>\r
        <SenderComponent onSend={this.handleMessage} />\r
        <ReceiverComponent message={this.state.message} />\r
      </div>\r
    );\r
  }\r
}\r
\r
// 发送者组件\r
class SenderComponent extends React.Component {\r
  handleClick = () => {\r
    this.props.onSend("Hello from sender");\r
  };\r
\r
  render() {\r
    return <button onClick={this.handleClick}>Send Message</button>;\r
  }\r
}\r
\r
// 接收者组件\r
class ReceiverComponent extends React.Component {\r
  render() {\r
    return <div>{this.props.message}</div>;\r
  }\r
}\r
\`\`\`\r
\r
### 3.4 跨层级组件通信\r
\r
使用Context API：\r
\r
\`\`\`jsx\r
// 创建Context\r
const MyContext = React.createContext();\r
\r
// 父组件\r
class ParentComponent extends React.Component {\r
  state = {\r
    value: "Hello from context",\r
  };\r
\r
  render() {\r
    return (\r
      <MyContext.Provider value={this.state.value}>\r
        <ChildComponent />\r
      </MyContext.Provider>\r
    );\r
  }\r
}\r
\r
// 子组件\r
class ChildComponent extends React.Component {\r
  render() {\r
    return <GrandchildComponent />;\r
  }\r
}\r
\r
// 孙组件\r
class GrandchildComponent extends React.Component {\r
  static contextType = MyContext;\r
\r
  render() {\r
    return <div>{this.context}</div>;\r
  }\r
}\r
\`\`\`\r
\r
## 4. Zustand 状态管理\r
\r
Zustand是一个轻量级的状态管理库，它提供了一种简洁的方式来管理全局状态，无需像Redux那样编写大量的模板代码。\r
\r
### 4.1 安装Zustand\r
\r
\`\`\`bash\r
# 使用npm\r
npm install zustand\r
\r
# 使用yarn\r
yarn add zustand\r
\`\`\`\r
\r
### 4.2 基本用法\r
\r
\`\`\`jsx\r
import create from "zustand";\r
\r
// 创建store\r
const useStore = create((set) => ({\r
  count: 0,\r
  increment: () => set((state) => ({ count: state.count + 1 })),\r
  decrement: () => set((state) => ({ count: state.count - 1 })),\r
  reset: () => set({ count: 0 }),\r
}));\r
\r
// 使用store\r
function Counter() {\r
  const { count, increment, decrement, reset } = useStore();\r
\r
  return (\r
    <div>\r
      <h1>Count: {count}</h1>\r
      <button onClick={increment}>增加</button>\r
      <button onClick={decrement}>减少</button>\r
      <button onClick={reset}>重置</button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### 4.3 更复杂的Store\r
\r
\`\`\`jsx\r
import create from "zustand";\r
\r
const useTodoStore = create((set, get) => ({\r
  todos: [],\r
  filter: "all", // all, active, completed\r
\r
  // 添加待办事项\r
  addTodo: (text) =>\r
    set((state) => ({\r
      todos: [...state.todos, { id: Date.now(), text, completed: false }],\r
    })),\r
\r
  // 切换待办事项状态\r
  toggleTodo: (id) =>\r
    set((state) => ({\r
      todos: state.todos.map((todo) =>\r
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,\r
      ),\r
    })),\r
\r
  // 删除待办事项\r
  deleteTodo: (id) =>\r
    set((state) => ({\r
      todos: state.todos.filter((todo) => todo.id !== id),\r
    })),\r
\r
  // 设置过滤器\r
  setFilter: (filter) => set({ filter }),\r
\r
  // 获取过滤后的待办事项\r
  getFilteredTodos: () => {\r
    const { todos, filter } = get();\r
    switch (filter) {\r
      case "active":\r
        return todos.filter((todo) => !todo.completed);\r
      case "completed":\r
        return todos.filter((todo) => todo.completed);\r
      default:\r
        return todos;\r
    }\r
  },\r
}));\r
\r
// 使用store\r
function TodoList() {\r
  const todos = useTodoStore((state) => state.getFilteredTodos());\r
  const addTodo = useTodoStore((state) => state.addTodo);\r
  const toggleTodo = useTodoStore((state) => state.toggleTodo);\r
  const deleteTodo = useTodoStore((state) => state.deleteTodo);\r
  const setFilter = useTodoStore((state) => state.setFilter);\r
  const filter = useTodoStore((state) => state.filter);\r
\r
  const [inputText, setInputText] = React.useState("");\r
\r
  const handleAddTodo = () => {\r
    if (inputText.trim()) {\r
      addTodo(inputText);\r
      setInputText("");\r
    }\r
  };\r
\r
  return (\r
    <div>\r
      <input\r
        type="text"\r
        value={inputText}\r
        onChange={(e) => setInputText(e.target.value)}\r
        placeholder="输入待办事项"\r
      />\r
      <button onClick={handleAddTodo}>添加</button>\r
\r
      <div>\r
        <button onClick={() => setFilter("all")}>全部</button>\r
        <button onClick={() => setFilter("active")}>未完成</button>\r
        <button onClick={() => setFilter("completed")}>已完成</button>\r
      </div>\r
\r
      <ul>\r
        {todos.map((todo) => (\r
          <li key={todo.id}>\r
            <span\r
              style={{\r
                textDecoration: todo.completed ? "line-through" : "none",\r
              }}\r
              onClick={() => toggleTodo(todo.id)}\r
            >\r
              {todo.text}\r
            </span>\r
            <button onClick={() => deleteTodo(todo.id)}>删除</button>\r
          </li>\r
        ))}\r
      </ul>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### 4.4 Zustand的优势\r
\r
1. **简单易用**：API简洁，无需编写大量模板代码\r
2. **轻量级**：体积小，性能好\r
3. **灵活**：支持中间件和持久化\r
4. **与React Hooks集成**：使用方式与React Hooks一致\r
5. **无需Provider**：不需要在应用顶层包裹Provider组件\r
\r
### 4.5 Zustand中间件\r
\r
#### 持久化中间件\r
\r
\`\`\`jsx\r
import create from "zustand";\r
import { persist } from "zustand/middleware";\r
\r
const useStore = create(\r
  persist(\r
    (set) => ({\r
      count: 0,\r
      increment: () => set((state) => ({ count: state.count + 1 })),\r
    }),\r
    {\r
      name: "count-storage", // 存储的键名\r
    },\r
  ),\r
);\r
\`\`\`\r
\r
#### 日志中间件\r
\r
\`\`\`jsx\r
import create from "zustand";\r
import { devtools } from "zustand/middleware";\r
\r
const useStore = create(\r
  devtools((set) => ({\r
    count: 0,\r
    increment: () => set((state) => ({ count: state.count + 1 })),\r
  })),\r
);\r
\`\`\`\r
\r
## 5. 综合示例：类组件与Zustand结合\r
\r
\`\`\`jsx\r
import React from "react";\r
import create from "zustand";\r
\r
// 创建Zustand store\r
const useUserStore = create((set) => ({\r
  user: null,\r
  isLoading: false,\r
  error: null,\r
\r
  login: async (username, password) => {\r
    set({ isLoading: true, error: null });\r
    try {\r
      // 模拟API调用\r
      await new Promise((resolve) => setTimeout(resolve, 1000));\r
      set({\r
        user: { id: 1, username, name: "John Doe" },\r
        isLoading: false,\r
      });\r
    } catch (error) {\r
      set({\r
        error: "登录失败",\r
        isLoading: false,\r
      });\r
    }\r
  },\r
\r
  logout: () => set({ user: null }),\r
}));\r
\r
// 类组件使用Zustand\r
class LoginForm extends React.Component {\r
  state = {\r
    username: "",\r
    password: "",\r
  };\r
\r
  // 获取store中的状态和方法\r
  login = useUserStore.getState().login;\r
  isLoading = useUserStore((state) => state.isLoading);\r
  error = useUserStore((state) => state.error);\r
\r
  handleChange = (e) => {\r
    this.setState({ [e.target.name]: e.target.value });\r
  };\r
\r
  handleSubmit = (e) => {\r
    e.preventDefault();\r
    const { username, password } = this.state;\r
    this.login(username, password);\r
  };\r
\r
  render() {\r
    const { username, password } = this.state;\r
    const isLoading = useUserStore.getState().isLoading;\r
    const error = useUserStore.getState().error;\r
\r
    return (\r
      <form onSubmit={this.handleSubmit}>\r
        <div>\r
          <label>用户名:</label>\r
          <input\r
            type="text"\r
            name="username"\r
            value={username}\r
            onChange={this.handleChange}\r
          />\r
        </div>\r
        <div>\r
          <label>密码:</label>\r
          <input\r
            type="password"\r
            name="password"\r
            value={password}\r
            onChange={this.handleChange}\r
          />\r
        </div>\r
        {error && <p style={{ color: "red" }}>{error}</p>}\r
        <button type="submit" disabled={isLoading}>\r
          {isLoading ? "登录中..." : "登录"}\r
        </button>\r
      </form>\r
    );\r
  }\r
}\r
\r
// 函数组件使用Zustand\r
function UserProfile() {\r
  const user = useUserStore((state) => state.user);\r
  const logout = useUserStore((state) => state.logout);\r
\r
  if (!user) {\r
    return <LoginForm />;\r
  }\r
\r
  return (\r
    <div>\r
      <h1>\r
        欢迎, {user.name} ({user.username})\r
      </h1>\r
      <button onClick={logout}>退出登录</button>\r
    </div>\r
  );\r
}\r
\r
export default UserProfile;\r
\`\`\`\r
\r
## 6. 最佳实践\r
\r
### 6.1 类组件最佳实践\r
\r
1. **使用箭头函数**：避免手动绑定this\r
2. **合理使用生命周期函数**：根据不同阶段执行相应的操作\r
3. **避免在render中创建函数**：可能导致性能问题\r
4. **使用shouldComponentUpdate优化性能**：避免不必要的渲染\r
\r
### 6.2 Zustand最佳实践\r
\r
1. **合理组织store**：按功能模块划分store\r
2. **使用选择器**：只订阅需要的状态，避免不必要的渲染\r
3. **使用中间件**：根据需要使用持久化、日志等中间件\r
4. **保持store简洁**：避免在store中放入过多的业务逻辑\r
\r
## 总结\r
\r
通过今天的学习，我们掌握了：\r
\r
1. **React类组件**：基本用法、与函数组件的对比\r
2. **类组件生命周期**：挂载、更新、卸载三个阶段的生命周期函数\r
3. **组件通信**：父向子、子向父、兄弟组件、跨层级组件的通信方式\r
4. **Zustand状态管理**：基本用法、复杂store、中间件、与类组件的结合\r
\r
虽然现在函数组件和Hooks是React的主流，但了解类组件仍然很重要，特别是在维护旧项目时。而Zustand作为一个轻量级的状态管理库，提供了一种简洁、高效的方式来管理全局状态，是Redux的良好替代品。\r
\r
在实际开发中，我们应该根据具体场景选择合适的组件类型和状态管理方案，以提高代码的可维护性和性能。\r
`;export{e as default};