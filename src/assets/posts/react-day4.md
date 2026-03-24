---
title: React学习Day4 - React Router详解
date: 2026-03-04
categories: React
---

# React学习Day4 - React Router详解

## 前言

今天学习了React Router，这是React生态系统中用于处理路由的重要库。它允许我们在单页应用中实现页面之间的导航，而无需刷新整个页面。本文将详细介绍React Router的基本概念、核心组件和使用方法。

## 什么是React Router？

React Router是一个用于React应用的声明式路由库，它允许我们构建具有多个视图的单页应用。通过React Router，我们可以：

- 在不同的URL路径下显示不同的组件
- 实现页面之间的导航和跳转
- 处理URL参数和查询字符串
- 实现嵌套路由和布局

## 安装React Router

在React项目中使用React Router，首先需要安装相关包：

```bash
# 使用npm
npm install react-router-dom

# 使用yarn
yarn add react-router-dom
```

## 核心组件

React Router提供了以下核心组件：

### 1. BrowserRouter

`BrowserRouter`是React Router的根组件，它使用HTML5的History API来跟踪应用的导航状态。

```jsx
import { BrowserRouter } from "react-router-dom";

function App() {
  return <BrowserRouter>{/* 应用内容 */}</BrowserRouter>;
}
```

### 2. Routes 和 Route

`Routes`组件用于包裹多个`Route`组件，`Route`组件定义了路径和对应的组件。

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 3. Link 和 NavLink

`Link`组件用于创建导航链接，`NavLink`是`Link`的特殊版本，它可以根据当前路径添加激活状态。

```jsx
import { Link, NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      <Link to="/">首页</Link>
      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        关于我们
      </NavLink>
      <NavLink to="/contact">联系我们</NavLink>
    </nav>
  );
}
```

### 4. Outlet

`Outlet`组件用于渲染嵌套路由的子组件。

```jsx
// 父组件
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>仪表盘</h1>
      <nav>
        <Link to="profile">个人资料</Link>
        <Link to="settings">设置</Link>
      </nav>
      <Outlet /> {/* 渲染子路由组件 */}
    </div>
  );
}

// 路由配置
<Route path="/dashboard" element={<Dashboard />}>
  <Route path="profile" element={<Profile />} />
  <Route path="settings" element={<Settings />} />
</Route>;
```

## 路由参数

React Router允许我们在路径中定义参数，用于传递动态数据：

```jsx
// 路由配置
<Route path="/users/:id" element={<UserDetail />} />;

// UserDetail组件
import { useParams } from "react-router-dom";

function UserDetail() {
  const { id } = useParams();

  return <h1>用户ID: {id}</h1>;
}
```

## 查询字符串

使用`useSearchParams`钩子来处理URL查询字符串：

```jsx
import { useSearchParams } from "react-router-dom";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("query");
    setSearchParams({ q: query });
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input type="text" name="query" />
        <button type="submit">搜索</button>
      </form>
      <p>当前搜索: {searchParams.get("q")}</p>
    </div>
  );
}
```

## 编程式导航

使用`useNavigate`钩子来实现编程式导航：

```jsx
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // 模拟登录
    const isLoggedIn = true;

    if (isLoggedIn) {
      // 登录成功，跳转到首页
      navigate("/");
      // 或者使用replace替换当前历史记录
      // navigate('/', { replace: true });
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="text" placeholder="用户名" />
      <input type="password" placeholder="密码" />
      <button type="submit">登录</button>
    </form>
  );
}
```

## 嵌套路由

React Router支持嵌套路由，允许我们构建复杂的应用结构：

```jsx
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";

// 布局组件
function Layout() {
  return (
    <div>
      <header>
        <h1>我的应用</h1>
        <nav>
          <Link to="/">首页</Link>
          <Link to="/products">产品</Link>
          <Link to="/about">关于</Link>
        </nav>
      </header>
      <main>
        <Outlet /> {/* 渲染子路由 */}
      </main>
      <footer>
        <p>© 2026 我的应用</p>
      </footer>
    </div>
  );
}

// 产品列表组件
function Products() {
  return (
    <div>
      <h2>产品列表</h2>
      <nav>
        <Link to="1">产品1</Link>
        <Link to="2">产品2</Link>
        <Link to="3">产品3</Link>
      </nav>
      <Outlet /> {/* 渲染产品详情 */}
    </div>
  );
}

// 产品详情组件
function ProductDetail() {
  const { id } = useParams();
  return <h3>产品ID: {id}</h3>;
}

// 路由配置
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />}>
            <Route path=":id" element={<ProductDetail />} />
          </Route>
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## 重定向

使用`Navigate`组件实现重定向：

```jsx
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuthenticated = false; // 模拟未登录状态

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// 使用
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>;
```

## 404页面

处理不存在的路由：

```jsx
function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>页面不存在</p>
      <Link to="/">返回首页</Link>
    </div>
  );
}

// 路由配置
<Routes>
  {/* 其他路由 */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

## 最佳实践

1. **使用布局组件**：创建布局组件来共享导航和页脚
2. **合理组织路由**：根据功能模块组织路由结构
3. **使用相对路径**：在嵌套路由中使用相对路径
4. **保护路由**：实现路由守卫保护需要认证的页面
5. **代码分割**：使用React.lazy和Suspense实现路由级别的代码分割

## 代码分割示例

```jsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 懒加载组件
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>加载中...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

## 总结

React Router是React应用中处理路由的强大工具，它提供了声明式的API来定义路由和导航。通过本文的学习，我们了解了：

- React Router的核心组件和它们的用法
- 如何定义路由和处理导航
- 如何使用路由参数和查询字符串
- 如何实现嵌套路由和布局
- 如何保护路由和处理404页面
- 如何使用代码分割优化性能

掌握React Router对于构建复杂的单页应用非常重要，它可以帮助我们创建具有良好用户体验的多页面应用。
