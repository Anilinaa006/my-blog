---
title: React学习Day5 - React高级Hooks详解
date: 2026-03-05
categories: React
---

# React学习Day5 - React高级Hooks详解

## 前言

今天学习了React的一些高级Hooks，包括useReducer、useMemo、react.memo、useCallback、forwardRef和useImperativeHandle。这些Hooks可以帮助我们更好地管理状态、优化性能和处理组件间的通信。本文将详细介绍这些Hooks的使用方法和最佳实践。

## 1. useReducer

`useReducer`是一个用于管理复杂状态逻辑的Hook，它是`useState`的替代方案，特别适合处理具有多个子值的状态对象或需要复杂状态转换的场景。

### 基本用法

```jsx
import { useReducer } from "react";

// 定义reducer函数
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
  // 使用useReducer
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <h1>Count: {state.count}</h1>
      <button onClick={() => dispatch({ type: "increment" })}>增加</button>
      <button onClick={() => dispatch({ type: "decrement" })}>减少</button>
      <button onClick={() => dispatch({ type: "reset" })}>重置</button>
    </div>
  );
}
```

### useReducer vs useState

- **useState**：适合简单的状态管理，如单个值或简单对象
- **useReducer**：适合复杂的状态逻辑，特别是当状态转换依赖于之前的状态或需要处理多个相关值时

## 2. useMemo

`useMemo`是一个用于性能优化的Hook，它可以缓存计算结果，避免在每次渲染时重复计算。

### 基本用法

```jsx
import { useMemo, useState } from "react";

function ExpensiveCalculation() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState("");

  // 使用useMemo缓存计算结果
  const expensiveValue = useMemo(() => {
    console.log("计算中...");
    let result = 0;
    for (let i = 0; i < 100000000; i++) {
      result += i;
    }
    return result;
  }, []); // 空依赖数组，只计算一次

  return (
    <div>
      <h1>Expensive Value: {expensiveValue}</h1>
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>增加</button>
      </div>
      <div>
        <p>Value: {value}</p>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
}
```

### useMemo vs useEffect

- **useMemo**：在渲染期间同步计算并缓存结果，用于优化渲染性能
- **useEffect**：在渲染后异步执行副作用，用于处理API调用、订阅等

## 3. react.memo

`react.memo`是一个高阶组件，它可以缓存组件的渲染结果，避免组件在props未改变时重新渲染。

### 基本用法

```jsx
import { memo, useState } from "react";

// 使用memo包装组件
const ExpensiveComponent = memo(({ value }) => {
  console.log("ExpensiveComponent 渲染");
  // 模拟昂贵的计算
  for (let i = 0; i < 1000000; i++) {
    // 一些计算
  }
  return <div>Value: {value}</div>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState("");

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <ExpensiveComponent value={value} />
    </div>
  );
}
```

### 注意事项

- `react.memo`使用`Object.is`方法比较props
- 对于引用类型的props，需要确保引用稳定，否则`react.memo`不会生效
- 可以使用`useMemo`来确保引用类型的props稳定

## 4. useCallback

`useCallback`是一个用于性能优化的Hook，它可以缓存函数，避免在每次渲染时重新创建函数。

### 基本用法

```jsx
import { useCallback, useState, memo } from "react";

const ChildComponent = memo(({ onButtonClick }) => {
  console.log("ChildComponent 渲染");
  return <button onClick={onButtonClick}>点击我</button>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState("");

  // 使用useCallback缓存函数
  const handleClick = useCallback(() => {
    console.log("按钮被点击");
    setCount(count + 1);
  }, [count]); // 依赖于count

  return (
    <div>
      <h1>Count: {count}</h1>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <ChildComponent onButtonClick={handleClick} />
    </div>
  );
}
```

### 最佳实践

- 当函数作为props传递给子组件时，使用`useCallback`缓存函数
- 当函数在`useEffect`的依赖数组中时，使用`useCallback`缓存函数
- 合理设置依赖数组，确保函数在需要时更新

## 5. forwardRef 和 useImperativeHandle

`forwardRef`和`useImperativeHandle`用于在父组件中访问子组件的DOM元素或方法。

### forwardRef 基本用法

```jsx
import { forwardRef, useRef } from "react";

// 使用forwardRef包装组件
const Input = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

function ParentComponent() {
  // 创建ref
  const inputRef = useRef(null);

  const focusInput = () => {
    // 访问子组件的DOM元素
    inputRef.current.focus();
  };

  return (
    <div>
      <Input ref={inputRef} placeholder="请输入内容" />
      <button onClick={focusInput}>聚焦输入框</button>
    </div>
  );
}
```

### useImperativeHandle 基本用法

```jsx
import { forwardRef, useRef, useImperativeHandle } from "react";

const Counter = forwardRef((props, ref) => {
  const [count, setCount] = useState(0);

  // 使用useImperativeHandle暴露方法
  useImperativeHandle(ref, () => ({
    increment: () => setCount(count + 1),
    decrement: () => setCount(count - 1),
    reset: () => setCount(0),
    getCount: () => count,
  }));

  return <div>Count: {count}</div>;
});

function ParentComponent() {
  const counterRef = useRef(null);

  return (
    <div>
      <Counter ref={counterRef} />
      <button onClick={() => counterRef.current.increment()}>增加</button>
      <button onClick={() => counterRef.current.decrement()}>减少</button>
      <button onClick={() => counterRef.current.reset()}>重置</button>
      <button
        onClick={() => console.log("当前值:", counterRef.current.getCount())}
      >
        获取值
      </button>
    </div>
  );
}
```

### forwardRef vs useRef

- **useRef**：在组件内部获取DOM元素或保存 mutable 值
- **forwardRef**：将ref从父组件传递到子组件，允许父组件访问子组件的DOM元素或方法

### 与Vue的比较

在Vue中，可以使用`ref`获取子组件的引用，并通过`defineExpose`暴露子组件的属性和方法，类似于React中的`forwardRef`和`useImperativeHandle`。

## 6. 综合示例

下面是一个综合使用这些Hooks的示例：

```jsx
import {
  useReducer,
  useMemo,
  useCallback,
  memo,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// 1. 使用useReducer管理复杂状态
function todoReducer(state, action) {
  switch (action.type) {
    case "add":
      return [
        ...state,
        { id: Date.now(), text: action.text, completed: false },
      ];
    case "toggle":
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo,
      );
    case "delete":
      return state.filter((todo) => todo.id !== action.id);
    default:
      return state;
  }
}

// 2. 使用memo优化子组件
const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  console.log("TodoItem 渲染:", todo.id);
  return (
    <div style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
      <span onClick={() => onToggle(todo.id)}>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>删除</button>
    </div>
  );
});

// 3. 使用forwardRef和useImperativeHandle暴露方法
const TodoList = forwardRef((props, ref) => {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [inputText, setInputText] = useState("");

  // 4. 使用useCallback缓存函数
  const handleAddTodo = useCallback(() => {
    if (inputText.trim()) {
      dispatch({ type: "add", text: inputText });
      setInputText("");
    }
  }, [inputText]);

  const handleToggleTodo = useCallback((id) => {
    dispatch({ type: "toggle", id });
  }, []);

  const handleDeleteTodo = useCallback((id) => {
    dispatch({ type: "delete", id });
  }, []);

  // 5. 使用useMemo缓存计算结果
  const completedCount = useMemo(() => {
    return todos.filter((todo) => todo.completed).length;
  }, [todos]);

  // 6. 使用useImperativeHandle暴露方法
  useImperativeHandle(ref, () => ({
    addTodo: (text) => {
      dispatch({ type: "add", text });
    },
    clearCompleted: () => {
      todos.forEach((todo) => {
        if (todo.completed) {
          dispatch({ type: "delete", id: todo.id });
        }
      });
    },
    getTodos: () => todos,
  }));

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
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
      </div>
      <p>
        已完成: {completedCount} / 总计: {todos.length}
      </p>
    </div>
  );
});

function App() {
  const todoListRef = useRef(null);

  const handleAddSampleTodo = () => {
    todoListRef.current.addTodo("示例待办事项");
  };

  const handleClearCompleted = () => {
    todoListRef.current.clearCompleted();
  };

  const handleGetTodos = () => {
    console.log("当前待办事项:", todoListRef.current.getTodos());
  };

  return (
    <div>
      <h1>待办事项列表</h1>
      <TodoList ref={todoListRef} />
      <div>
        <button onClick={handleAddSampleTodo}>添加示例</button>
        <button onClick={handleClearCompleted}>清除已完成</button>
        <button onClick={handleGetTodos}>获取所有待办</button>
      </div>
    </div>
  );
}

export default App;
```

## 7. 最佳实践

1. **合理使用useReducer**：对于复杂状态逻辑，使用useReducer可以使代码更清晰
2. **谨慎使用useMemo**：只对昂贵的计算使用useMemo，避免过度优化
3. **正确使用react.memo**：确保props的引用稳定，否则memo不会生效
4. **合理使用useCallback**：当函数作为props传递或在依赖数组中时使用
5. **谨慎使用forwardRef和useImperativeHandle**：优先使用props和回调函数进行组件通信，只在必要时使用ref

## 总结

通过今天的学习，我们掌握了React的一些高级Hooks：

- **useReducer**：用于管理复杂状态逻辑
- **useMemo**：用于缓存计算结果，优化性能
- **react.memo**：用于缓存组件渲染结果，避免不必要的渲染
- **useCallback**：用于缓存函数，确保引用稳定
- **forwardRef**：用于将ref从父组件传递到子组件
- **useImperativeHandle**：用于暴露子组件的方法和属性

这些Hooks可以帮助我们编写更高效、更可维护的React代码，特别是在处理复杂状态和优化性能方面。在实际开发中，我们应该根据具体场景选择合适的Hooks，避免过度使用或使用不当。
