var e=`---\r
title: React学习Day5 - React高级Hooks详解\r
date: 2026-03-05\r
categories: React\r
---\r
\r
# React学习Day5 - React高级Hooks详解\r
\r
## 前言\r
\r
今天学习了React的一些高级Hooks，包括useReducer、useMemo、react.memo、useCallback、forwardRef和useImperativeHandle。这些Hooks可以帮助我们更好地管理状态、优化性能和处理组件间的通信。本文将详细介绍这些Hooks的使用方法和最佳实践。\r
\r
## 1. useReducer\r
\r
\`useReducer\`是一个用于管理复杂状态逻辑的Hook，它是\`useState\`的替代方案，特别适合处理具有多个子值的状态对象或需要复杂状态转换的场景。\r
\r
### 基本用法\r
\r
\`\`\`jsx\r
import { useReducer } from "react";\r
\r
// 定义reducer函数\r
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
  // 使用useReducer\r
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });\r
\r
  return (\r
    <div>\r
      <h1>Count: {state.count}</h1>\r
      <button onClick={() => dispatch({ type: "increment" })}>增加</button>\r
      <button onClick={() => dispatch({ type: "decrement" })}>减少</button>\r
      <button onClick={() => dispatch({ type: "reset" })}>重置</button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### useReducer vs useState\r
\r
- **useState**：适合简单的状态管理，如单个值或简单对象\r
- **useReducer**：适合复杂的状态逻辑，特别是当状态转换依赖于之前的状态或需要处理多个相关值时\r
\r
## 2. useMemo\r
\r
\`useMemo\`是一个用于性能优化的Hook，它可以缓存计算结果，避免在每次渲染时重复计算。\r
\r
### 基本用法\r
\r
\`\`\`jsx\r
import { useMemo, useState } from "react";\r
\r
function ExpensiveCalculation() {\r
  const [count, setCount] = useState(0);\r
  const [value, setValue] = useState("");\r
\r
  // 使用useMemo缓存计算结果\r
  const expensiveValue = useMemo(() => {\r
    console.log("计算中...");\r
    let result = 0;\r
    for (let i = 0; i < 100000000; i++) {\r
      result += i;\r
    }\r
    return result;\r
  }, []); // 空依赖数组，只计算一次\r
\r
  return (\r
    <div>\r
      <h1>Expensive Value: {expensiveValue}</h1>\r
      <div>\r
        <p>Count: {count}</p>\r
        <button onClick={() => setCount(count + 1)}>增加</button>\r
      </div>\r
      <div>\r
        <p>Value: {value}</p>\r
        <input\r
          type="text"\r
          value={value}\r
          onChange={(e) => setValue(e.target.value)}\r
        />\r
      </div>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### useMemo vs useEffect\r
\r
- **useMemo**：在渲染期间同步计算并缓存结果，用于优化渲染性能\r
- **useEffect**：在渲染后异步执行副作用，用于处理API调用、订阅等\r
\r
## 3. react.memo\r
\r
\`react.memo\`是一个高阶组件，它可以缓存组件的渲染结果，避免组件在props未改变时重新渲染。\r
\r
### 基本用法\r
\r
\`\`\`jsx\r
import { memo, useState } from "react";\r
\r
// 使用memo包装组件\r
const ExpensiveComponent = memo(({ value }) => {\r
  console.log("ExpensiveComponent 渲染");\r
  // 模拟昂贵的计算\r
  for (let i = 0; i < 1000000; i++) {\r
    // 一些计算\r
  }\r
  return <div>Value: {value}</div>;\r
});\r
\r
function ParentComponent() {\r
  const [count, setCount] = useState(0);\r
  const [value, setValue] = useState("");\r
\r
  return (\r
    <div>\r
      <h1>Count: {count}</h1>\r
      <button onClick={() => setCount(count + 1)}>增加</button>\r
      <input\r
        type="text"\r
        value={value}\r
        onChange={(e) => setValue(e.target.value)}\r
      />\r
      <ExpensiveComponent value={value} />\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### 注意事项\r
\r
- \`react.memo\`使用\`Object.is\`方法比较props\r
- 对于引用类型的props，需要确保引用稳定，否则\`react.memo\`不会生效\r
- 可以使用\`useMemo\`来确保引用类型的props稳定\r
\r
## 4. useCallback\r
\r
\`useCallback\`是一个用于性能优化的Hook，它可以缓存函数，避免在每次渲染时重新创建函数。\r
\r
### 基本用法\r
\r
\`\`\`jsx\r
import { useCallback, useState, memo } from "react";\r
\r
const ChildComponent = memo(({ onButtonClick }) => {\r
  console.log("ChildComponent 渲染");\r
  return <button onClick={onButtonClick}>点击我</button>;\r
});\r
\r
function ParentComponent() {\r
  const [count, setCount] = useState(0);\r
  const [value, setValue] = useState("");\r
\r
  // 使用useCallback缓存函数\r
  const handleClick = useCallback(() => {\r
    console.log("按钮被点击");\r
    setCount(count + 1);\r
  }, [count]); // 依赖于count\r
\r
  return (\r
    <div>\r
      <h1>Count: {count}</h1>\r
      <input\r
        type="text"\r
        value={value}\r
        onChange={(e) => setValue(e.target.value)}\r
      />\r
      <ChildComponent onButtonClick={handleClick} />\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### 最佳实践\r
\r
- 当函数作为props传递给子组件时，使用\`useCallback\`缓存函数\r
- 当函数在\`useEffect\`的依赖数组中时，使用\`useCallback\`缓存函数\r
- 合理设置依赖数组，确保函数在需要时更新\r
\r
## 5. forwardRef 和 useImperativeHandle\r
\r
\`forwardRef\`和\`useImperativeHandle\`用于在父组件中访问子组件的DOM元素或方法。\r
\r
### forwardRef 基本用法\r
\r
\`\`\`jsx\r
import { forwardRef, useRef } from "react";\r
\r
// 使用forwardRef包装组件\r
const Input = forwardRef((props, ref) => {\r
  return <input ref={ref} {...props} />;\r
});\r
\r
function ParentComponent() {\r
  // 创建ref\r
  const inputRef = useRef(null);\r
\r
  const focusInput = () => {\r
    // 访问子组件的DOM元素\r
    inputRef.current.focus();\r
  };\r
\r
  return (\r
    <div>\r
      <Input ref={inputRef} placeholder="请输入内容" />\r
      <button onClick={focusInput}>聚焦输入框</button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### useImperativeHandle 基本用法\r
\r
\`\`\`jsx\r
import { forwardRef, useRef, useImperativeHandle } from "react";\r
\r
const Counter = forwardRef((props, ref) => {\r
  const [count, setCount] = useState(0);\r
\r
  // 使用useImperativeHandle暴露方法\r
  useImperativeHandle(ref, () => ({\r
    increment: () => setCount(count + 1),\r
    decrement: () => setCount(count - 1),\r
    reset: () => setCount(0),\r
    getCount: () => count,\r
  }));\r
\r
  return <div>Count: {count}</div>;\r
});\r
\r
function ParentComponent() {\r
  const counterRef = useRef(null);\r
\r
  return (\r
    <div>\r
      <Counter ref={counterRef} />\r
      <button onClick={() => counterRef.current.increment()}>增加</button>\r
      <button onClick={() => counterRef.current.decrement()}>减少</button>\r
      <button onClick={() => counterRef.current.reset()}>重置</button>\r
      <button\r
        onClick={() => console.log("当前值:", counterRef.current.getCount())}\r
      >\r
        获取值\r
      </button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### forwardRef vs useRef\r
\r
- **useRef**：在组件内部获取DOM元素或保存 mutable 值\r
- **forwardRef**：将ref从父组件传递到子组件，允许父组件访问子组件的DOM元素或方法\r
\r
### 与Vue的比较\r
\r
在Vue中，可以使用\`ref\`获取子组件的引用，并通过\`defineExpose\`暴露子组件的属性和方法，类似于React中的\`forwardRef\`和\`useImperativeHandle\`。\r
\r
## 6. 综合示例\r
\r
下面是一个综合使用这些Hooks的示例：\r
\r
\`\`\`jsx\r
import {\r
  useReducer,\r
  useMemo,\r
  useCallback,\r
  memo,\r
  forwardRef,\r
  useImperativeHandle,\r
  useRef,\r
  useState,\r
} from "react";\r
\r
// 1. 使用useReducer管理复杂状态\r
function todoReducer(state, action) {\r
  switch (action.type) {\r
    case "add":\r
      return [\r
        ...state,\r
        { id: Date.now(), text: action.text, completed: false },\r
      ];\r
    case "toggle":\r
      return state.map((todo) =>\r
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo,\r
      );\r
    case "delete":\r
      return state.filter((todo) => todo.id !== action.id);\r
    default:\r
      return state;\r
  }\r
}\r
\r
// 2. 使用memo优化子组件\r
const TodoItem = memo(({ todo, onToggle, onDelete }) => {\r
  console.log("TodoItem 渲染:", todo.id);\r
  return (\r
    <div style={{ textDecoration: todo.completed ? "line-through" : "none" }}>\r
      <span onClick={() => onToggle(todo.id)}>{todo.text}</span>\r
      <button onClick={() => onDelete(todo.id)}>删除</button>\r
    </div>\r
  );\r
});\r
\r
// 3. 使用forwardRef和useImperativeHandle暴露方法\r
const TodoList = forwardRef((props, ref) => {\r
  const [todos, dispatch] = useReducer(todoReducer, []);\r
  const [inputText, setInputText] = useState("");\r
\r
  // 4. 使用useCallback缓存函数\r
  const handleAddTodo = useCallback(() => {\r
    if (inputText.trim()) {\r
      dispatch({ type: "add", text: inputText });\r
      setInputText("");\r
    }\r
  }, [inputText]);\r
\r
  const handleToggleTodo = useCallback((id) => {\r
    dispatch({ type: "toggle", id });\r
  }, []);\r
\r
  const handleDeleteTodo = useCallback((id) => {\r
    dispatch({ type: "delete", id });\r
  }, []);\r
\r
  // 5. 使用useMemo缓存计算结果\r
  const completedCount = useMemo(() => {\r
    return todos.filter((todo) => todo.completed).length;\r
  }, [todos]);\r
\r
  // 6. 使用useImperativeHandle暴露方法\r
  useImperativeHandle(ref, () => ({\r
    addTodo: (text) => {\r
      dispatch({ type: "add", text });\r
    },\r
    clearCompleted: () => {\r
      todos.forEach((todo) => {\r
        if (todo.completed) {\r
          dispatch({ type: "delete", id: todo.id });\r
        }\r
      });\r
    },\r
    getTodos: () => todos,\r
  }));\r
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
      <div>\r
        {todos.map((todo) => (\r
          <TodoItem\r
            key={todo.id}\r
            todo={todo}\r
            onToggle={handleToggleTodo}\r
            onDelete={handleDeleteTodo}\r
          />\r
        ))}\r
      </div>\r
      <p>\r
        已完成: {completedCount} / 总计: {todos.length}\r
      </p>\r
    </div>\r
  );\r
});\r
\r
function App() {\r
  const todoListRef = useRef(null);\r
\r
  const handleAddSampleTodo = () => {\r
    todoListRef.current.addTodo("示例待办事项");\r
  };\r
\r
  const handleClearCompleted = () => {\r
    todoListRef.current.clearCompleted();\r
  };\r
\r
  const handleGetTodos = () => {\r
    console.log("当前待办事项:", todoListRef.current.getTodos());\r
  };\r
\r
  return (\r
    <div>\r
      <h1>待办事项列表</h1>\r
      <TodoList ref={todoListRef} />\r
      <div>\r
        <button onClick={handleAddSampleTodo}>添加示例</button>\r
        <button onClick={handleClearCompleted}>清除已完成</button>\r
        <button onClick={handleGetTodos}>获取所有待办</button>\r
      </div>\r
    </div>\r
  );\r
}\r
\r
export default App;\r
\`\`\`\r
\r
## 7. 最佳实践\r
\r
1. **合理使用useReducer**：对于复杂状态逻辑，使用useReducer可以使代码更清晰\r
2. **谨慎使用useMemo**：只对昂贵的计算使用useMemo，避免过度优化\r
3. **正确使用react.memo**：确保props的引用稳定，否则memo不会生效\r
4. **合理使用useCallback**：当函数作为props传递或在依赖数组中时使用\r
5. **谨慎使用forwardRef和useImperativeHandle**：优先使用props和回调函数进行组件通信，只在必要时使用ref\r
\r
## 总结\r
\r
通过今天的学习，我们掌握了React的一些高级Hooks：\r
\r
- **useReducer**：用于管理复杂状态逻辑\r
- **useMemo**：用于缓存计算结果，优化性能\r
- **react.memo**：用于缓存组件渲染结果，避免不必要的渲染\r
- **useCallback**：用于缓存函数，确保引用稳定\r
- **forwardRef**：用于将ref从父组件传递到子组件\r
- **useImperativeHandle**：用于暴露子组件的方法和属性\r
\r
这些Hooks可以帮助我们编写更高效、更可维护的React代码，特别是在处理复杂状态和优化性能方面。在实际开发中，我们应该根据具体场景选择合适的Hooks，避免过度使用或使用不当。\r
`;export{e as default};