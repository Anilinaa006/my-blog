var e=`---\r
title: 从Vue到React，React学习Day2\r
date: 2026-03-02\r
tags: [React, 前端, 学习笔记, 组件通信, Redux]\r
categories: React\r
---\r
\r
# React学习日记 - 第二天（组件通信与状态管理）\r
\r
今天是学习React的第二天，主要学习了组件通信、自定义hooks、组件封装，以及比较了Vue和React的通信方式，还了解了Redux状态管理库。\r
\r
## 组件通信\r
\r
组件通信是React开发中的重要部分，今天学习了几种常见的组件通信方式：\r
\r
### 1. 父子通信\r
\r
**父组件向子组件传递数据**：通过props传递\r
\r
\`\`\`jsx\r
// 父组件\r
function Parent() {\r
  const [message, setMessage] = useState('Hello from parent');\r
  \r
  return (\r
    <div>\r
      <Child message={message} />\r
    </div>\r
  );\r
}\r
\r
// 子组件\r
function Child(props) {\r
  return <div>{props.message}</div>;\r
}\r
\`\`\`\r
\r
**子组件向父组件传递数据**：通过回调函数\r
\r
\`\`\`jsx\r
// 父组件\r
function Parent() {\r
  const [count, setCount] = useState(0);\r
  \r
  const handleIncrement = (value) => {\r
    setCount(prevCount => prevCount + value);\r
  };\r
  \r
  return (\r
    <div>\r
      <Child onIncrement={handleIncrement} />\r
      <p>Count: {count}</p>\r
    </div>\r
  );\r
}\r
\r
// 子组件\r
function Child(props) {\r
  return (\r
    <button onClick={() => props.onIncrement(1)}>\r
      Increment\r
    </button>\r
  );\r
}\r
\`\`\`\r
\r
### 2. 兄弟通信\r
\r
**通过父组件作为中间层**：\r
\r
\`\`\`jsx\r
function Parent() {\r
  const [sharedData, setSharedData] = useState('');\r
  \r
  return (\r
    <div>\r
      <BrotherA onDataChange={setSharedData} />\r
      <BrotherB data={sharedData} />\r
    </div>\r
  );\r
}\r
\r
function BrotherA(props) {\r
  const handleChange = (e) => {\r
    props.onDataChange(e.target.value);\r
  };\r
  \r
  return (\r
    <input type="text" onChange={handleChange} placeholder="Enter data" />\r
  );\r
}\r
\r
function BrotherB(props) {\r
  return <p>Received data: {props.data}</p>;\r
}\r
\`\`\`\r
\r
### 3. 跨层通信\r
\r
**使用Context API**：\r
\r
\`\`\`jsx\r
// 创建Context\r
const MyContext = createContext();\r
\r
// 提供者组件\r
function Provider({ children }) {\r
  const [value, setValue] = useState('Context value');\r
  \r
  return (\r
    <MyContext.Provider value={{ value, setValue }}>\r
      {children}\r
    </MyContext.Provider>\r
  );\r
}\r
\r
// 深层子组件\r
function DeepChild() {\r
  const { value, setValue } = useContext(MyContext);\r
  \r
  return (\r
    <div>\r
      <p>Context value: {value}</p>\r
      <button onClick={() => setValue('New value')}>\r
        Change value\r
      </button>\r
    </div>\r
  );\r
}\r
\r
// 使用\r
function App() {\r
  return (\r
    <Provider>\r
      <DeepChild />\r
    </Provider>\r
  );\r
}\r
\`\`\`\r
\r
## 自定义Hooks\r
\r
自定义Hooks允许我们复用逻辑，今天学习了如何创建和使用自定义Hooks：\r
\r
\`\`\`jsx\r
// 自定义Hook\r
function useCounter(initialValue = 0) {\r
  const [count, setCount] = useState(initialValue);\r
  \r
  const increment = () => setCount(prev => prev + 1);\r
  const decrement = () => setCount(prev => prev - 1);\r
  const reset = () => setCount(initialValue);\r
  \r
  return { count, increment, decrement, reset };\r
}\r
\r
// 使用自定义Hook\r
function Counter() {\r
  const { count, increment, decrement, reset } = useCounter(10);\r
  \r
  return (\r
    <div>\r
      <p>Count: {count}</p>\r
      <button onClick={increment}>Increment</button>\r
      <button onClick={decrement}>Decrement</button>\r
      <button onClick={reset}>Reset</button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
## 组件封装\r
\r
组件封装是提高代码复用性的重要方式，今天学习了如何封装一个可复用的Button组件：\r
\r
\`\`\`jsx\r
function Button({ \r
  children, \r
  variant = 'primary', \r
  size = 'medium', \r
  disabled = false, \r
  onClick \r
}) {\r
  const variantClasses = {\r
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',\r
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',\r
    danger: 'bg-red-500 hover:bg-red-600 text-white'\r
  };\r
  \r
  const sizeClasses = {\r
    small: 'px-2 py-1 text-sm',\r
    medium: 'px-4 py-2',\r
    large: 'px-6 py-3 text-lg'\r
  };\r
  \r
  return (\r
    <button\r
      className={\`\r
        \${variantClasses[variant]}\r
        \${sizeClasses[size]}\r
        rounded-md\r
        transition-colors\r
        \${disabled ? 'opacity-50 cursor-not-allowed' : ''}\r
      \`}\r
      disabled={disabled}\r
      onClick={onClick}\r
    >\r
      {children}\r
    </button>\r
  );\r
}\r
\r
// 使用\r
function App() {\r
  return (\r
    <div>\r
      <Button>Primary Button</Button>\r
      <Button variant="secondary" size="small">\r
        Secondary Button\r
      </Button>\r
      <Button variant="danger" size="large" disabled>\r
        Disabled Button\r
      </Button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
## Vue与React通信方式对比\r
\r
| 通信方式 | Vue | React |\r
|---------|-----|-------|\r
| 父子通信 | props / emit | props / 回调函数 |\r
| 兄弟通信 | EventBus / 父组件转发 | 父组件转发 |\r
| 跨层通信 | provide / inject | Context API |\r
| 状态管理 | Vuex / Pinia | Redux / Context API + useReducer |\r
\r
### 主要区别\r
\r
1. **API设计**：Vue提供了更简洁的API，如\`emit\`和\`provide/inject\`，而React更依赖函数式编程和Hooks\r
2. **状态管理**：Vue有专门的Vuex/Pinia，React有Redux，但React也可以使用Context API实现轻量级状态管理\r
3. **响应式系统**：Vue的响应式系统自动追踪依赖，React需要手动使用useState和useEffect\r
\r
## Redux状态管理库\r
\r
Redux是React生态中最流行的状态管理库之一，今天学习了Redux的基本概念：\r
\r
### 核心概念\r
\r
- **Store**：存储应用状态\r
- **Actions**：描述发生的事件\r
- **Reducers**：根据Action更新状态\r
\r
### 基本使用\r
\r
\`\`\`jsx\r
// 1. 定义Action Types\r
const INCREMENT = 'INCREMENT';\r
const DECREMENT = 'DECREMENT';\r
\r
// 2. 定义Actions\r
function increment() {\r
  return { type: INCREMENT };\r
}\r
\r
function decrement() {\r
  return { type: DECREMENT };\r
}\r
\r
// 3. 定义Reducer\r
function counterReducer(state = 0, action) {\r
  switch (action.type) {\r
    case INCREMENT:\r
      return state + 1;\r
    case DECREMENT:\r
      return state - 1;\r
    default:\r
      return state;\r
  }\r
}\r
\r
// 4. 创建Store\r
const store = createStore(counterReducer);\r
\r
// 5. 订阅Store变化\r
store.subscribe(() => {\r
  console.log('Current state:', store.getState());\r
});\r
\r
// 6. 分发Action\r
store.dispatch(increment()); // Current state: 1\r
store.dispatch(increment()); // Current state: 2\r
store.dispatch(decrement()); // Current state: 1\r
\`\`\`\r
\r
## 学习案例\r
\r
今天完成了几个React案例，巩固了所学知识：\r
\r
### 案例1：Todo List\r
- 使用组件通信实现添加、删除、标记完成功能\r
- 使用Context API管理全局状态\r
\r
### 案例2：计数器应用\r
- 使用自定义Hook封装计数器逻辑\r
- 实现多种计数功能\r
\r
### 案例3：用户信息管理\r
- 使用Redux管理用户数据\r
- 实现用户列表、添加、编辑功能\r
\r
## 学习心得\r
\r
今天的学习内容比较多，主要是关于组件通信和状态管理，这些都是React开发中的核心概念。通过比较Vue和React的通信方式，我更清楚地理解了两种框架的设计理念。\r
\r
### 学习重点\r
\r
1. **组件通信**：掌握了父子、兄弟、跨层通信的实现方式\r
2. **自定义Hooks**：学会了如何创建和使用自定义Hooks来复用逻辑\r
3. **组件封装**：理解了如何封装可复用的组件\r
4. **状态管理**：了解了Redux的基本概念和使用方法\r
\r
### 遇到的问题\r
\r
1. **Context API的使用**：一开始对Context API的使用不太熟悉，通过实践逐渐理解了其工作原理\r
2. **Redux的复杂性**：Redux的概念比较抽象，需要更多时间来掌握\r
\r
### 下一步计划\r
\r
1. 深入学习Redux Toolkit，简化Redux的使用\r
2. 学习React Router，实现路由管理\r
3. 学习React的性能优化技巧\r
4. 构建一个完整的React应用\r
\r
## 总结\r
\r
第二天的学习让我对React的组件通信和状态管理有了更深入的理解。虽然有些概念比较抽象，但通过实践案例，我逐渐掌握了这些知识点。React的函数式编程思想和Hooks系统让代码更加简洁和可维护，这是我比较喜欢的地方。\r
\r
期待第三天的学习！`;export{e as default};