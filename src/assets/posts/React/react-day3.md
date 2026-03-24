---
title: 从Vue到React，React学习Day3
date: 2026-03-03
categories: React
---

# 从Vue到React，React学习Day3

## 前言

今天继续学习React中的状态管理，主要聚焦于Redux在React中的应用。作为从Vue转过来的开发者，我会特别关注Redux与Vuex的对比，帮助自己更好地理解和掌握React的状态管理方案。
感觉Redux真的好麻烦，相较于pinia和vuex，Redux的API更加复杂，需要手动配置，但Redux的函数式编程风格更适合大型应用。
## 1. Redux-React中间件

### 什么是中间件？

中间件是Redux中非常重要的概念，它提供了一个第三方扩展点，允许我们在dispatch action和reducer处理action之间执行一些额外的逻辑。

### 常用的中间件

- **redux-thunk**：处理异步action
- **redux-saga**：更强大的异步处理方案
- **redux-logger**：记录action和state的变化
- **redux-persist**：持久化Redux状态

### 如何使用中间件

```javascript
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "./reducers";

const store = createStore(rootReducer, applyMiddleware(thunk, logger));
```

## 2. 同步状态操作

### useSelector - 从Redux中获取数据

`useSelector`是React-Redux提供的Hook，用于从Redux store中提取状态。

```javascript
import { useSelector } from "react-redux";

function Counter() {
  // 从store中获取count状态
  const count = useSelector((state) => state.counter.count);

  return (
    <div>
      <h1>Count: {count}</h1>
    </div>
  );
}
```

### useDispatch - 提交action对象

`useDispatch`是React-Redux提供的Hook，用于获取dispatch函数，以便提交action。

```javascript
import { useDispatch } from "react-redux";

function Counter() {
  const dispatch = useDispatch();

  const increment = () => {
    dispatch({ type: "INCREMENT" });
  };

  return (
    <div>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

## 3. 提交action传参

### action.payload

当我们需要向action传递参数时，可以使用`payload`属性。

```javascript
// action creator
const incrementBy = (value) => ({
  type: "INCREMENT_BY",
  payload: value,
});

// 使用
const dispatch = useDispatch();
dispatch(incrementBy(5));

// reducer
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "INCREMENT_BY":
      return {
        ...state,
        count: state.count + action.payload,
      };
    default:
      return state;
  }
}
```

## 4. 异步状态操作

### 使用redux-thunk处理异步

```javascript
// 异步action creator
const fetchUsers = () => {
  return async (dispatch) => {
    dispatch({ type: "FETCH_USERS_START" });

    try {
      const response = await fetch("https://api.example.com/users");
      const users = await response.json();
      dispatch({ type: "FETCH_USERS_SUCCESS", payload: users });
    } catch (error) {
      dispatch({ type: "FETCH_USERS_ERROR", payload: error.message });
    }
  };
};

// 使用
const dispatch = useDispatch();
dispatch(fetchUsers());
```

### 异步状态管理

```javascript
// reducer
function usersReducer(
  state = {
    loading: false,
    data: [],
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_USERS_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_USERS_SUCCESS":
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case "FETCH_USERS_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
```

## 5. 和Vuex的对比

### 相似点

1. **状态集中管理**：两者都将应用状态集中管理，便于维护和调试
2. **单向数据流**：都遵循单向数据流原则
3. **模块化**：都支持状态的模块化管理
4. **异步处理**：都支持异步状态操作

### 不同点

| 特性          | Redux                       | Vuex                          |
| ------------- | --------------------------- | ----------------------------- |
| **API**       | 更底层，需要手动配置        | 更高级，开箱即用              |
| **中间件**    | 需要单独安装和配置          | 内置支持                      |
| **mutations** | 无，直接在reducer中修改状态 | 有，必须通过mutations修改状态 |
| **actions**   | 支持异步，通过中间件实现    | 支持异步，内置实现            |
| **getters**   | 通过useSelector实现         | 内置getters                   |
| **代码风格**  | 函数式编程                  | 面向对象编程                  |
| **学习曲线**  | 较陡峭                      | 较平缓                        |

### 个人感受

作为从Vue转React的开发者，我发现Redux的学习曲线确实比Vuex更陡峭。Vuex的API更加直观和易用，而Redux需要更多的手动配置。不过，Redux的函数式编程风格也有其优势，特别是在大型应用中，它的可预测性和可测试性更好。

## 总结

今天学习了Redux在React中的应用，包括中间件、同步状态操作、异步状态操作以及与Vuex的对比。虽然Redux的学习曲线较陡，但它是React生态中非常重要的一部分，掌握它对于构建复杂的React应用至关重要。

作为Vue开发者，我会将Redux与Vuex的概念进行对比，帮助自己更好地理解和记忆。同时，我也会关注Redux Toolkit等工具，它们可以简化Redux的使用，提高开发效率。
