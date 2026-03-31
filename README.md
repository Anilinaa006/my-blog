# FrontendDiary 博客项目

这是一个基于 Vue 3 + Vite 的个人博客项目，支持 Markdown 文章、暗色模式、登录注册和文章评论。项目同时包含前端页面与一个可选的 Express + MySQL 后端，适合本地开发，也方便后续部署到静态站点和独立 API 服务。

## 技术栈

- 前端：Vue 3、Vite、TypeScript、Vue Router、Element Plus
- 内容：Markdown + Marked
- 后端：Express、TypeScript、MySQL、JWT、bcryptjs

## 项目结构

```text
my-blog/
├─ src/                  前端源码
├─ public/               静态资源
├─ server/               后端服务
│  ├─ src/               后端源码
│  ├─ dist/              后端构建产物
│  ├─ .env.example       后端环境变量示例
│  └─ package.json
├─ dist/                 前端构建产物
├─ vite.config.js        Vite 配置（当前生效）
├─ vite.config.ts        备用同构配置
└─ package.json
```

## 根目录脚本

在项目根目录可以直接使用这些命令：

```bash
npm run dev
npm run dev:client
npm run dev:server
npm run build
npm run build:client
npm run build:server
npm run preview
npm run start:server
```

说明：

- `npm run dev` / `npm run dev:client`：启动前端开发服务，默认地址 `http://localhost:5173`
- `npm run dev:server`：启动后端开发服务，默认地址 `http://localhost:3001`
- `npm run build` / `npm run build:client`：构建前端
- `npm run build:server`：构建后端
- `npm run start:server`：运行后端生产构建结果

## 本地联调流程

### 1. 安装依赖

根目录安装前端依赖：

```bash
pnpm install
```

安装后端依赖：

```bash
cd server
pnpm install
```

### 2. 配置后端环境变量

在 `server/` 目录下复制环境变量模板：

```bash
cp .env.example .env
```

然后根据你的 MySQL 环境填写这些字段：

```env
PORT=3001
JWT_SECRET=change_me_to_a_long_random_string
JWT_EXPIRES_IN=7d
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=my_blog
CORS_ORIGIN=http://localhost:5173
```

### 3. 启动后端

在项目根目录执行：

```bash
npm run dev:server
```

启动成功后可访问健康检查接口：

```text
http://localhost:3001/healthz
```

### 4. 启动前端

另开一个终端，在项目根目录执行：

```bash
npm run dev
```

前端开发环境会通过 Vite 代理把 `/api/*` 自动转发到 `http://localhost:3001`，所以本地开发时不需要手动改接口地址。

## 生产环境说明

### 前端部署到静态站点

当前项目默认支持部署到 GitHub Pages 子路径：

- 本地开发：`/`
- GitHub Pages：`/my-blog/`

### 后端单独部署

如果你把前端部署到 GitHub Pages、Vercel 或 Netlify，登录、注册、评论功能仍然需要一个单独部署的后端服务和数据库。

这时建议在前端环境变量中设置：

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

前端会优先请求这个地址，而不是本地 `/api`。

## 常见问题排查

### 1. 评论加载失败、登录注册失败

先检查这三项：

- 后端是否已启动：访问 `http://localhost:3001/healthz`
- 前端是否通过 `npm run dev` 启动，而不是直接打开 `dist/index.html`
- MySQL 是否连接到了包含真实数据的那一个数据库

### 2. 页面提示 `/my-blog/api/...` 或 `/api/...` 路径错误

通常是以下原因：

- 前端部署路径和接口基路径不一致
- 线上没有设置 `VITE_API_BASE_URL`
- 静态站点已更新，但浏览器还在缓存旧 bundle

可以先强制刷新页面，再确认最新构建是否已经重新部署。

### 3. 账号登录不上，但评论和接口能通

这通常表示：

- 当前连接的数据库里没有该账号
- 输入的密码和数据库中的密码哈希不匹配
- 你正在连接另一套数据库，而不是之前使用的那一套

### 4. 评论“消失了”

评论并不保存在前端，而是保存在 MySQL。只要后端换了数据库、换了表、换了环境变量，前端看到的评论列表就会变化。

## 内容管理

文章放在 `src/assets/posts/` 下，按分类分目录保存 Markdown 文件即可。示例：

```markdown
---
title: Vue 3 常用指令详解
date: 2026-03-30
categories: Vue
---

# Vue 3 常用指令详解

正文内容...
```

## 建议的开发顺序

日常开发建议固定按这个顺序：

1. 先启动 MySQL
2. 再启动后端 `npm run dev:server`
3. 最后启动前端 `npm run dev`
4. 联调接口时优先检查 `http://localhost:3001/healthz`
5. 部署前区分清楚“前端地址”和“后端 API 地址”

这样可以最大程度避免登录、评论、代理和路径配置反复出问题。
