var e=`---\r
title: React Router 路由详解\r
date: 2026-05-28\r
categories: React\r
---\r
\r
# React Router 路由详解\r
\r
## 什么是 React Router？\r
\r
React Router 是 React 应用中最常用的路由库，它允许我们在单页应用中实现页面之间的导航，而无需重新加载整个页面。\r
\r
## 安装 React Router\r
\r
\`\`\`bash\r
# React Router v6+\r
npm install react-router-dom\r
\`\`\`\r
\r
## 基本用法\r
\r
### 配置路由\r
\r
\`\`\`tsx\r
import { BrowserRouter, Routes, Route } from 'react-router-dom';\r
import Home from './Home';\r
import About from './About';\r
import Contact from './Contact';\r
\r
function App() {\r
  return (\r
    <BrowserRouter>\r
      <Routes>\r
        <Route path="/" element={<Home />} />\r
        <Route path="/about" element={<About />} />\r
        <Route path="/contact" element={<Contact />} />\r
      </Routes>\r
    </BrowserRouter>\r
  );\r
}\r
\r
export default App;\r
\`\`\`\r
\r
### 创建链接\r
\r
\`\`\`tsx\r
import { Link } from 'react-router-dom';\r
\r
function Navigation() {\r
  return (\r
    <nav>\r
      <Link to="/">首页</Link>\r
      <Link to="/about">关于我们</Link>\r
      <Link to="/contact">联系我们</Link>\r
    </nav>\r
  );\r
}\r
\`\`\`\r
\r
## 动态路由\r
\r
### 带参数的路由\r
\r
\`\`\`tsx\r
// 配置路由\r
<Route path="/users/:id" element={<UserProfile />} />\r
\r
// 访问路由\r
<Link to="/users/123">用户 123</Link>\r
\r
// 获取参数\r
import { useParams } from 'react-router-dom';\r
\r
function UserProfile() {\r
  const { id } = useParams<{ id: string }>();\r
  return <h1>用户 ID: {id}</h1>;\r
}\r
\`\`\`\r
\r
### 可选参数\r
\r
\`\`\`tsx\r
// 可选参数使用 ?\r
<Route path="/users/:id?" element={<UserList />} />\r
\`\`\`\r
\r
## 嵌套路由\r
\r
\`\`\`tsx\r
import { Outlet } from 'react-router-dom';\r
\r
// 父组件\r
function Dashboard() {\r
  return (\r
    <div>\r
      <h1>仪表盘</h1>\r
      <nav>\r
        <Link to="/dashboard/profile">个人资料</Link>\r
        <Link to="/dashboard/settings">设置</Link>\r
      </nav>\r
      {/* 子路由内容将在这里渲染 */}\r
      <Outlet />\r
    </div>\r
  );\r
}\r
\r
// 配置嵌套路由\r
<Route path="/dashboard" element={<Dashboard />}>\r
  <Route path="profile" element={<Profile />} />\r
  <Route path="settings" element={<Settings />} />\r
</Route>\r
\`\`\`\r
\r
## 编程式导航\r
\r
\`\`\`tsx\r
import { useNavigate } from 'react-router-dom';\r
\r
function Login() {\r
  const navigate = useNavigate();\r
\r
  const handleLogin = () => {\r
    // 登录成功后导航\r
    navigate('/dashboard');\r
    \r
    // 导航到上一页\r
    // navigate(-1);\r
    \r
    // 替换当前历史记录\r
    // navigate('/dashboard', { replace: true });\r
  };\r
\r
  return <button onClick={handleLogin}>登录</button>;\r
}\r
\`\`\`\r
\r
## 查询参数\r
\r
\`\`\`tsx\r
import { useSearchParams } from 'react-router-dom';\r
\r
function SearchResults() {\r
  const [searchParams, setSearchParams] = useSearchParams();\r
  \r
  // 获取查询参数\r
  const query = searchParams.get('q');\r
  const page = searchParams.get('page');\r
\r
  // 设置查询参数\r
  const handlePageChange = (newPage: number) => {\r
    setSearchParams({ q: query || '', page: newPage.toString() });\r
  };\r
\r
  return (\r
    <div>\r
      <p>搜索关键词: {query}</p>\r
      <button onClick={() => handlePageChange(2)}>第 2 页</button>\r
    </div>\r
  );\r
}\r
\r
// 链接中传递查询参数\r
<Link to="/search?q=react&page=1">搜索</Link>\r
\`\`\`\r
\r
## 路由守卫\r
\r
### 私有路由\r
\r
\`\`\`tsx\r
import { Navigate, Outlet } from 'react-router-dom';\r
\r
interface PrivateRouteProps {\r
  isAuthenticated: boolean;\r
}\r
\r
function PrivateRoute({ isAuthenticated }: PrivateRouteProps) {\r
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;\r
}\r
\r
// 使用\r
<Route element={<PrivateRoute isAuthenticated={isAuth} />}>\r
  <Route path="/dashboard" element={<Dashboard />} />\r
  <Route path="/profile" element={<Profile />} />\r
</Route>\r
\`\`\`\r
\r
### 公共路由\r
\r
\`\`\`tsx\r
import { Navigate, Outlet } from 'react-router-dom';\r
\r
interface PublicRouteProps {\r
  isAuthenticated: boolean;\r
}\r
\r
function PublicRoute({ isAuthenticated }: PublicRouteProps) {\r
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" />;\r
}\r
\r
// 使用\r
<Route element={<PublicRoute isAuthenticated={isAuth} />}>\r
  <Route path="/login" element={<Login />} />\r
  <Route path="/register" element={<Register />} />\r
</Route>\r
\`\`\`\r
\r
## 404 页面\r
\r
\`\`\`tsx\r
<Route path="*" element={<NotFound />} />\r
\r
function NotFound() {\r
  return (\r
    <div>\r
      <h1>404 - 页面未找到</h1>\r
      <Link to="/">返回首页</Link>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
## 路由配置\r
\r
### 对象式路由配置\r
\r
\`\`\`tsx\r
interface RouteConfig {\r
  path: string;\r
  element: React.ReactNode;\r
  children?: RouteConfig[];\r
}\r
\r
const routes: RouteConfig[] = [\r
  {\r
    path: '/',\r
    element: <Home />,\r
  },\r
  {\r
    path: '/dashboard',\r
    element: <Dashboard />,\r
    children: [\r
      { path: 'profile', element: <Profile /> },\r
      { path: 'settings', element: <Settings /> },\r
    ],\r
  },\r
  {\r
    path: '*',\r
    element: <NotFound />,\r
  },\r
];\r
\r
// 渲染路由\r
function renderRoutes(routes: RouteConfig[]) {\r
  return routes.map((route, index) => (\r
    <Route key={index} path={route.path} element={route.element}>\r
      {route.children && renderRoutes(route.children)}\r
    </Route>\r
  ));\r
}\r
\r
// 使用\r
<Routes>\r
  {renderRoutes(routes)}\r
</Routes>\r
\`\`\`\r
\r
## 滚动恢复\r
\r
\`\`\`tsx\r
import { useEffect } from 'react';\r
import { useLocation } from 'react-router-dom';\r
\r
function ScrollToTop() {\r
  const { pathname } = useLocation();\r
\r
  useEffect(() => {\r
    window.scrollTo(0, 0);\r
  }, [pathname]);\r
\r
  return null;\r
}\r
\r
// 在应用中使用\r
function App() {\r
  return (\r
    <BrowserRouter>\r
      <ScrollToTop />\r
      <Routes>\r
        {/* 路由配置 */}\r
      </Routes>\r
    </BrowserRouter>\r
  );\r
}\r
\`\`\`\r
\r
## 路由状态\r
\r
\`\`\`tsx\r
// 导航时传递状态\r
<Link to="/confirm" state={{ orderId: '123' }}>确认订单</Link>\r
\r
// 编程式导航传递状态\r
navigate('/confirm', { state: { orderId: '123' } });\r
\r
// 获取状态\r
import { useLocation } from 'react-router-dom';\r
\r
function ConfirmPage() {\r
  const location = useLocation();\r
  const { orderId } = location.state as { orderId: string };\r
  \r
  return <h1>订单 ID: {orderId}</h1>;\r
}\r
\`\`\`\r
\r
## 常用 Hooks\r
\r
### useParams\r
\r
获取 URL 参数：\r
\r
\`\`\`tsx\r
const { id, name } = useParams<{ id: string; name?: string }>();\r
\`\`\`\r
\r
### useNavigate\r
\r
编程式导航：\r
\r
\`\`\`tsx\r
const navigate = useNavigate();\r
navigate('/path');\r
navigate(-1); // 返回上一页\r
\`\`\`\r
\r
### useLocation\r
\r
获取当前位置信息：\r
\r
\`\`\`tsx\r
const location = useLocation();\r
console.log(location.pathname);\r
console.log(location.search);\r
console.log(location.state);\r
\`\`\`\r
\r
### useSearchParams\r
\r
处理查询参数：\r
\r
\`\`\`tsx\r
const [searchParams, setSearchParams] = useSearchParams();\r
const query = searchParams.get('q');\r
setSearchParams({ q: 'new query' });\r
\`\`\`\r
\r
### useRouteError\r
\r
处理路由错误：\r
\r
\`\`\`tsx\r
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';\r
\r
function ErrorBoundary() {\r
  const error = useRouteError();\r
  \r
  if (isRouteErrorResponse(error)) {\r
    return (\r
      <div>\r
        <h1>{error.status} - {error.statusText}</h1>\r
        <p>{error.data?.message}</p>\r
      </div>\r
    );\r
  }\r
  \r
  return <div>发生未知错误</div>;\r
}\r
\r
// 使用\r
<Route path="/users/:id" element={<UserProfile />} errorElement={<ErrorBoundary />} />\r
\`\`\`\r
\r
## 性能优化\r
\r
### lazy 和 Suspense\r
\r
\`\`\`tsx\r
import { lazy, Suspense } from 'react';\r
\r
const Home = lazy(() => import('./Home'));\r
const About = lazy(() => import('./About'));\r
\r
function App() {\r
  return (\r
    <BrowserRouter>\r
      <Suspense fallback={<div>加载中...</div>}>\r
        <Routes>\r
          <Route path="/" element={<Home />} />\r
          <Route path="/about" element={<About />} />\r
        </Routes>\r
      </Suspense>\r
    </BrowserRouter>\r
  );\r
}\r
\`\`\`\r
\r
## 总结\r
\r
React Router 提供了强大的路由功能，包括：\r
\r
1. **基本路由配置**：使用 \`Routes\` 和 \`Route\` 组件\r
2. **动态路由**：支持 URL 参数和查询参数\r
3. **嵌套路由**：使用 \`Outlet\` 组件实现\r
4. **编程式导航**：使用 \`useNavigate\` Hook\r
5. **路由守卫**：保护特定路由\r
6. **错误处理**：使用 \`errorElement\`\r
\r
掌握这些知识，你就可以在 React 应用中实现复杂的路由功能了！`;export{e as default};