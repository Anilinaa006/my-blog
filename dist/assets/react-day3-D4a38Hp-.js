var e=`---\r
title: 从Vue到React，React学习Day3\r
date: 2026-03-03\r
categories: React\r
---\r
\r
# 从Vue到React，React学习Day3\r
\r
## 前言\r
\r
今天继续学习React中的状态管理，主要聚焦于Redux在React中的应用。作为从Vue转过来的开发者，我会特别关注Redux与Vuex的对比，帮助自己更好地理解和掌握React的状态管理方案。\r
感觉Redux真的好麻烦，相较于pinia和vuex，Redux的API更加复杂，需要手动配置，但Redux的函数式编程风格更适合大型应用。\r
## 1. Redux-React中间件\r
\r
### 什么是中间件？\r
\r
中间件是Redux中非常重要的概念，它提供了一个第三方扩展点，允许我们在dispatch action和reducer处理action之间执行一些额外的逻辑。\r
\r
### 常用的中间件\r
\r
- **redux-thunk**：处理异步action\r
- **redux-saga**：更强大的异步处理方案\r
- **redux-logger**：记录action和state的变化\r
- **redux-persist**：持久化Redux状态\r
\r
### 如何使用中间件\r
\r
\`\`\`javascript\r
import { createStore, applyMiddleware } from "redux";\r
import thunk from "redux-thunk";\r
import logger from "redux-logger";\r
import rootReducer from "./reducers";\r
\r
const store = createStore(rootReducer, applyMiddleware(thunk, logger));\r
\`\`\`\r
\r
## 2. 同步状态操作\r
\r
### useSelector - 从Redux中获取数据\r
\r
\`useSelector\`是React-Redux提供的Hook，用于从Redux store中提取状态。\r
\r
\`\`\`javascript\r
import { useSelector } from "react-redux";\r
\r
function Counter() {\r
  // 从store中获取count状态\r
  const count = useSelector((state) => state.counter.count);\r
\r
  return (\r
    <div>\r
      <h1>Count: {count}</h1>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
### useDispatch - 提交action对象\r
\r
\`useDispatch\`是React-Redux提供的Hook，用于获取dispatch函数，以便提交action。\r
\r
\`\`\`javascript\r
import { useDispatch } from "react-redux";\r
\r
function Counter() {\r
  const dispatch = useDispatch();\r
\r
  const increment = () => {\r
    dispatch({ type: "INCREMENT" });\r
  };\r
\r
  return (\r
    <div>\r
      <button onClick={increment}>Increment</button>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
## 3. 提交action传参\r
\r
### action.payload\r
\r
当我们需要向action传递参数时，可以使用\`payload\`属性。\r
\r
\`\`\`javascript\r
// action creator\r
const incrementBy = (value) => ({\r
  type: "INCREMENT_BY",\r
  payload: value,\r
});\r
\r
// 使用\r
const dispatch = useDispatch();\r
dispatch(incrementBy(5));\r
\r
// reducer\r
function counterReducer(state = { count: 0 }, action) {\r
  switch (action.type) {\r
    case "INCREMENT_BY":\r
      return {\r
        ...state,\r
        count: state.count + action.payload,\r
      };\r
    default:\r
      return state;\r
  }\r
}\r
\`\`\`\r
\r
## 4. 异步状态操作\r
\r
### 使用redux-thunk处理异步\r
\r
\`\`\`javascript\r
// 异步action creator\r
const fetchUsers = () => {\r
  return async (dispatch) => {\r
    dispatch({ type: "FETCH_USERS_START" });\r
\r
    try {\r
      const response = await fetch("https://api.example.com/users");\r
      const users = await response.json();\r
      dispatch({ type: "FETCH_USERS_SUCCESS", payload: users });\r
    } catch (error) {\r
      dispatch({ type: "FETCH_USERS_ERROR", payload: error.message });\r
    }\r
  };\r
};\r
\r
// 使用\r
const dispatch = useDispatch();\r
dispatch(fetchUsers());\r
\`\`\`\r
\r
### 异步状态管理\r
\r
\`\`\`javascript\r
// reducer\r
function usersReducer(\r
  state = {\r
    loading: false,\r
    data: [],\r
    error: null,\r
  },\r
  action,\r
) {\r
  switch (action.type) {\r
    case "FETCH_USERS_START":\r
      return {\r
        ...state,\r
        loading: true,\r
        error: null,\r
      };\r
    case "FETCH_USERS_SUCCESS":\r
      return {\r
        ...state,\r
        loading: false,\r
        data: action.payload,\r
      };\r
    case "FETCH_USERS_ERROR":\r
      return {\r
        ...state,\r
        loading: false,\r
        error: action.payload,\r
      };\r
    default:\r
      return state;\r
  }\r
}\r
\`\`\`\r
\r
## 5. 和Vuex的对比\r
\r
### 相似点\r
\r
1. **状态集中管理**：两者都将应用状态集中管理，便于维护和调试\r
2. **单向数据流**：都遵循单向数据流原则\r
3. **模块化**：都支持状态的模块化管理\r
4. **异步处理**：都支持异步状态操作\r
\r
### 不同点\r
\r
| 特性          | Redux                       | Vuex                          |\r
| ------------- | --------------------------- | ----------------------------- |\r
| **API**       | 更底层，需要手动配置        | 更高级，开箱即用              |\r
| **中间件**    | 需要单独安装和配置          | 内置支持                      |\r
| **mutations** | 无，直接在reducer中修改状态 | 有，必须通过mutations修改状态 |\r
| **actions**   | 支持异步，通过中间件实现    | 支持异步，内置实现            |\r
| **getters**   | 通过useSelector实现         | 内置getters                   |\r
| **代码风格**  | 函数式编程                  | 面向对象编程                  |\r
| **学习曲线**  | 较陡峭                      | 较平缓                        |\r
\r
### 个人感受\r
\r
作为从Vue转React的开发者，我发现Redux的学习曲线确实比Vuex更陡峭。Vuex的API更加直观和易用，而Redux需要更多的手动配置。不过，Redux的函数式编程风格也有其优势，特别是在大型应用中，它的可预测性和可测试性更好。\r
\r
## 总结\r
\r
今天学习了Redux在React中的应用，包括中间件、同步状态操作、异步状态操作以及与Vuex的对比。虽然Redux的学习曲线较陡，但它是React生态中非常重要的一部分，掌握它对于构建复杂的React应用至关重要。\r
\r
作为Vue开发者，我会将Redux与Vuex的概念进行对比，帮助自己更好地理解和记忆。同时，我也会关注Redux Toolkit等工具，它们可以简化Redux的使用，提高开发效率。\r
`;export{e as default};