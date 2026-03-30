# FrontendDiary 博客项目

这是一个使用 Vue 3 和 Markdown 搭建的个人博客项目，支持暗黑模式、响应式设计和用户认证功能。

## 功能特性

- ✅ 纯前端实现，无需后端服务（可选后端支持）
- ✅ 支持 Markdown 文章编写和展示
- ✅ 响应式设计，适配不同设备
- ✅ 暗黑模式支持
- ✅ 文章列表和详情页
- ✅ 分类筛选和排序功能
- ✅ 用户登录和注册功能
- ✅ 优雅的 UI 界面（Element Plus）
- ✅ 滚动位置保存和恢复
- ✅ 固定的返回按钮
- ✅ 博客介绍页面

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **路由**：Vue Router（Hash模式）
- **UI 组件库**：Element Plus
- **Markdown 解析**：Marked
- **构建工具**：Vite
- **后端（可选）**：Express + MySQL + TypeScript

## 项目结构

```
src/
├── assets/          # 静态资源
│   └── posts/       # 存放 Markdown 文章
│       ├── CSS/      # CSS 相关文章
│       ├── JS/       # JavaScript 相关文章
│       ├── React/    # React 相关文章
│       ├── Vue/      # Vue 相关文章
│       ├── 网络/     # 网络相关文章
│       └── 其他/     # 其他文章
├── components/      # 组件
│   ├── Header.vue   # 头部组件
│   ├── Footer.vue   # 底部组件
│   ├── PostList.vue # 文章列表组件
│   └── ThemeToggle.vue # 主题切换组件
├── router/          # 路由配置
│   └── index.ts     # 路由文件
├── utils/           # 工具函数
│   ├── markdown.ts  # 解析 Markdown 的工具
│   └── postLoader.ts # 文章加载工具
├── views/           # 页面
│   ├── Home.vue     # 首页
│   ├── PostDetail.vue # 文章详情页
│   ├── About.vue    # 关于页
│   ├── BlogIntro.vue # 博客介绍页
│   └── Auth.vue     # 登录/注册页
├── App.vue          # 根组件
├── main.ts          # 入口文件
└── vue-shim.d.ts    # TypeScript 类型定义

server/              # 后端服务（可选）
├── src/             # 后端源代码
│   ├── routes/      # 路由
│   ├── env.ts       # 环境配置
│   └── index.ts      # 后端入口
└── dist/            # 编译后的后端代码
```

## 如何使用

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm run dev
```

### 构建生产版本

```bash
pnpm run build
```

## 如何添加文章

1. 在 `src/assets/posts/` 对应分类目录下创建 Markdown 文件
2. 文章格式示例：

```markdown
---
title: 文章标题
date: 2024-01-01
categories: Vue
---

# 标题

文章内容...
```

## 访问链接

- 首页：`http://localhost:5173/#/`
- 文章详情：`http://localhost:5173/#/post/文件名`（不带 `.md` 后缀）
- 关于页：`http://localhost:5173/#/about`
- 博客介绍：`http://localhost:5173/#/blog-intro`
- 登录/注册：`http://localhost:5173/#/auth`

## 主题切换

点击顶部导航栏右侧的太阳/月亮图标可以切换暗黑模式和浅色模式。

## 特点

- **简单易用**：只需添加 Markdown 文件即可发布文章
- **无需后端**：纯前端实现，可部署到任何静态网站托管服务
- **美观大方**：使用 Element Plus 组件库，界面优雅
- **功能完整**：支持文章列表、详情页、暗黑模式、分类筛选等功能
- **响应式设计**：适配桌面端和移动端
- **TypeScript 支持**：提供类型安全
- **可扩展**：可选后端服务支持用户认证和评论功能

## 部署

构建完成后，将 `dist` 目录下的文件部署到任何静态网站托管服务即可，例如：

- GitHub Pages
- Vercel
- Netlify
- 阿里云 OSS
- 腾讯云 COS

## 后端服务（可选）

项目包含一个可选的后端服务，提供用户认证和评论功能：

1. 配置环境变量：复制 `.env.example` 为 `.env` 并填写数据库信息
2. 启动后端服务：`cd server && pnpm install && pnpm run dev`

## 浏览器支持

- Chrome / Edge
- Firefox
- Safari

***

希望这个博客项目能帮助你记录和分享你的想法！ 🎉