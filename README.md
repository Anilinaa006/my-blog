# 个人博客项目

这是一个使用Ai辅助完成的基于 Vue 3 和 Markdown 搭建的纯前端个人博客项目。

## 功能特性

- ✅ 纯前端实现，无需后端服务
- ✅ 支持 Markdown 文章编写和展示
- ✅ 响应式设计，适配不同设备
- ✅ 暗黑模式支持
- ✅ 文章列表和详情页
- ✅ 优雅的 UI 界面（Element Plus）

## 技术栈

- **前端框架**：Vue 3
- **路由**：Vue Router
- **UI 组件库**：Element Plus
- **Markdown 解析**：Marked
- **构建工具**：Vite

## 项目结构

```
src/
├── assets/          # 静态资源
│   └── posts/       # 存放 Markdown 文章
├── components/      # 组件
│   ├── Header.vue   # 头部组件
│   ├── Footer.vue   # 底部组件
│   ├── PostList.vue # 文章列表组件
│   └── ThemeToggle.vue # 主题切换组件
├── router/          # 路由配置
│   └── index.js     # 路由文件
├── views/           # 页面
│   ├── Home.vue     # 首页
│   ├── PostDetail.vue # 文章详情页
│   └── About.vue    # 关于页
├── utils/           # 工具函数
│   └── markdown.js  # 解析 Markdown 的工具
├── App.vue          # 根组件
└── main.js          # 入口文件
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

1. 在 `src/assets/posts/` 目录下创建 Markdown 文件
2. 文件名建议使用英文（例如：`first-post.md`）
3. 文章格式示例：

```markdown
---
title: 文章标题
date: 2024-01-01
---

# 标题

文章内容...
```

## 访问链接

- 首页：`http://localhost:5173/`
- 文章详情：`http://localhost:5173/post/文件名`（不带 `.md` 后缀）
- 关于页：`http://localhost:5173/about`

## 主题切换

点击顶部导航栏右侧的太阳/月亮图标可以切换暗黑模式和浅色模式。

## 特点

- **简单易用**：只需添加 Markdown 文件即可发布文章
- **无需后端**：纯前端实现，可部署到任何静态网站托管服务
- **美观大方**：使用 Element Plus 组件库，界面优雅
- **功能完整**：支持文章列表、详情页、暗黑模式等功能

## 部署

构建完成后，将 `dist` 目录下的文件部署到任何静态网站托管服务即可，例如：

- GitHub Pages
- Vercel
- Netlify
- 阿里云 OSS
- 腾讯云 COS

***

希望这个博客项目能帮助你记录和分享你的想法！ 🎉
