---
title: React Router 路由详解
date: 2026-05-28
categories: React
---

# React Router 路由详解

## 什么是 React Router？

React Router 是 React 应用中最常用的路由库，它允许我们在单页应用中实现页面之间的导航，而无需重新加载整个页面。

## 安装 React Router

```bash
# React Router v6+
npm install react-router-dom
```

## 基本用法

### 配置路由

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Contact from './Contact';

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

export default App;
```

### 创建链接

```tsx
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">首页</Link>
      <Link to="/about">关于我们</Link>
      <Link to="/contact">联系我们</Link>
    </nav>
  );
}
```

## 动态路由

### 带参数的路由

```tsx
// 配置路由
<Route path="/users/:id" element={<UserProfile />} />

// 访问路由
<Link to="/users/123">用户 123</Link>

// 获取参数
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { id } = useParams<{ id: string }>();
  return <h1>用户 ID: {id}</h1>;
}
```

### 可选参数

```tsx
// 可选参数使用 ?
<Route path="/users/:id?" element={<UserList />} />
```

## 嵌套路由

```tsx
import { Outlet } from 'react-router-dom';

// 父组件
function Dashboard() {
  return (
    <div>
      <h1>仪表盘</h1>
      <nav>
        <Link to="/dashboard/profile">个人资料</Link>
        <Link to="/dashboard/settings">设置</Link>
      </nav>
      {/* 子路由内容将在这里渲染 */}
      <Outlet />
    </div>
  );
}

// 配置嵌套路由
<Route path="/dashboard" element={<Dashboard />}>
  <Route path="profile" element={<Profile />} />
  <Route path="settings" element={<Settings />} />
</Route>
```

## 编程式导航

```tsx
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 登录成功后导航
    navigate('/dashboard');
    
    // 导航到上一页
    // navigate(-1);
    
    // 替换当前历史记录
    // navigate('/dashboard', { replace: true });
  };

  return <button onClick={handleLogin}>登录</button>;
}
```

## 查询参数

```tsx
import { useSearchParams } from 'react-router-dom';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 获取查询参数
  const query = searchParams.get('q');
  const page = searchParams.get('page');

  // 设置查询参数
  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: query || '', page: newPage.toString() });
  };

  return (
    <div>
      <p>搜索关键词: {query}</p>
      <button onClick={() => handlePageChange(2)}>第 2 页</button>
    </div>
  );
}

// 链接中传递查询参数
<Link to="/search?q=react&page=1">搜索</Link>
```

## 路由守卫

### 私有路由

```tsx
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthenticated: boolean;
}

function PrivateRoute({ isAuthenticated }: PrivateRouteProps) {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

// 使用
<Route element={<PrivateRoute isAuthenticated={isAuth} />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
</Route>
```

### 公共路由

```tsx
import { Navigate, Outlet } from 'react-router-dom';

interface PublicRouteProps {
  isAuthenticated: boolean;
}

function PublicRoute({ isAuthenticated }: PublicRouteProps) {
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" />;
}

// 使用
<Route element={<PublicRoute isAuthenticated={isAuth} />}>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Route>
```

## 404 页面

```tsx
<Route path="*" element={<NotFound />} />

function NotFound() {
  return (
    <div>
      <h1>404 - 页面未找到</h1>
      <Link to="/">返回首页</Link>
    </div>
  );
}
```

## 路由配置

### 对象式路由配置

```tsx
interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

// 渲染路由
function renderRoutes(routes: RouteConfig[]) {
  return routes.map((route, index) => (
    <Route key={index} path={route.path} element={route.element}>
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
}

// 使用
<Routes>
  {renderRoutes(routes)}
</Routes>
```

## 滚动恢复

```tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// 在应用中使用
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* 路由配置 */}
      </Routes>
    </BrowserRouter>
  );
}
```

## 路由状态

```tsx
// 导航时传递状态
<Link to="/confirm" state={{ orderId: '123' }}>确认订单</Link>

// 编程式导航传递状态
navigate('/confirm', { state: { orderId: '123' } });

// 获取状态
import { useLocation } from 'react-router-dom';

function ConfirmPage() {
  const location = useLocation();
  const { orderId } = location.state as { orderId: string };
  
  return <h1>订单 ID: {orderId}</h1>;
}
```

## 常用 Hooks

### useParams

获取 URL 参数：

```tsx
const { id, name } = useParams<{ id: string; name?: string }>();
```

### useNavigate

编程式导航：

```tsx
const navigate = useNavigate();
navigate('/path');
navigate(-1); // 返回上一页
```

### useLocation

获取当前位置信息：

```tsx
const location = useLocation();
console.log(location.pathname);
console.log(location.search);
console.log(location.state);
```

### useSearchParams

处理查询参数：

```tsx
const [searchParams, setSearchParams] = useSearchParams();
const query = searchParams.get('q');
setSearchParams({ q: 'new query' });
```

### useRouteError

处理路由错误：

```tsx
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

function ErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status} - {error.statusText}</h1>
        <p>{error.data?.message}</p>
      </div>
    );
  }
  
  return <div>发生未知错误</div>;
}

// 使用
<Route path="/users/:id" element={<UserProfile />} errorElement={<ErrorBoundary />} />
```

## 性能优化

### lazy 和 Suspense

```tsx
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./Home'));
const About = lazy(() => import('./About'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>加载中...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

## 总结

React Router 提供了强大的路由功能，包括：

1. **基本路由配置**：使用 `Routes` 和 `Route` 组件
2. **动态路由**：支持 URL 参数和查询参数
3. **嵌套路由**：使用 `Outlet` 组件实现
4. **编程式导航**：使用 `useNavigate` Hook
5. **路由守卫**：保护特定路由
6. **错误处理**：使用 `errorElement`

掌握这些知识，你就可以在 React 应用中实现复杂的路由功能了！