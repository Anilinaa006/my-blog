var e=`---
title: 部署纯前端静态网站的那些坑
date: 2026-3-10
tags: [部署, 前端, 问题]
categories: 其他
---
# 部署纯前端静态网站的那些坑

最近在部署我的个人博客（基于Vue 3 + Vite）时，遇到了不少问题。从GitHub push失败到部署后404，真的是一路坎坷。不过好在最后都解决了，现在把这些经历记录下来，当作自己的学习笔记，也希望能帮助其他遇到类似问题的同学。

## 我的部署踩坑记录

1. GitHub push上传仓库显示网络不稳定
2. GitHub Actions 部署报错：TypeError: error must be an instance of Error
3. 部署成功后一刷新就 404
4. Markdown 笔记看不到
5. Vercel 部署后打开 404
6. GitHub Pages / Vercel 国内不开加速器打不开

## 问题分析与解决方案

### 1. GitHub push上传仓库显示网络不稳定

**我的遭遇**：第一次尝试push代码到GitHub时，一直显示网络不稳定，试了好多次都失败了，当时真的很崩溃。

**问题原因**：

- 国内网络连接GitHub本来就不太稳定
- 我用的是HTTPS协议，容易受到网络波动影响
- 密码验证方式每次都要输入密码，很麻烦也不稳定

**解决过程**：
后来查了资料，发现可以用SSH密钥来解决这个问题。步骤如下：

1. 生成 SSH 密钥：\`ssh-keygen -t ed25519 -C "我的邮箱"\`
2. 复制公钥到 GitHub：\`cat ~/.ssh/id_ed25519.pub\`
3. 在 GitHub 设置中添加 SSH 密钥
4. 使用 SSH 地址克隆仓库：\`git clone git@github.com:我的用户名/我的仓库.git\`

**结果**：设置完SSH密钥后，push代码变得非常顺畅，再也没有出现网络不稳定的问题了！

### 2. GitHub Actions 部署报错

**我的遭遇**：设置好GitHub Pages后，第一次触发Actions部署，结果报错了，错误信息是"TypeError: error must be an instance of Error"，当时完全不知道怎么回事。

**问题原因**：查了一下，发现是actions/configure-pages@v5这个action有bug，而且Vite项目其实根本不需要它。

**解决过程**：
我打开了.github/workflows/static.yml文件，找到了这段代码，直接把它删掉了：

\`\`\`yaml
- name: Setup Pages
  uses: actions/configure-pages@v5
  with:
    static_site_generator: vite
\`\`\`

**结果**：删掉这段代码后，重新触发部署，成功了！

### 3. 刷新页面 404

**我的遭遇**：部署成功后，首页能正常访问，但是一刷新页面就显示404错误，当时我还以为是部署失败了，反复部署了好多次。

**问题原因**：查了资料才知道，Vue Router默认使用history模式，但是静态网站没有服务器端路由支持，所以刷新时会找不到页面。

**解决过程**：
我修改了路由配置，把history模式改成了hash模式：

\`\`\`javascript
history: createWebHashHistory();
\`\`\`

**结果**：改成hash模式后，网址会带#号，但是再也不会出现404错误了！

### 4. Markdown 笔记看不到

**我的遭遇**：部署成功后，打开博客页面，发现页面是空白的，我的Markdown笔记都看不到了，当时急得不行。

**问题原因**：查了一下，发现Vite默认没有把md文件当作资源处理，所以构建时没有包含这些文件。

**解决过程**：
我修改了vite.config.js文件，添加了对md文件的支持：

\`\`\`javascript
assetsInclude: ["**/*.md"];
\`\`\`

**结果**：添加这个配置后，重新构建部署，Markdown笔记终于能正常显示了！

### 5. Vercel 打开 404

**我的遭遇**：我尝试用Vercel部署，部署过程显示成功了，但是打开网址却显示404错误，当时真的很困惑。

**问题原因**：

- 我在vite.config.js里把base路径写死为/my-blog/，但是Vercel部署时不需要这个路径
- 没有配置路由fallback
- 没有指定dist目录

**解决过程**：
我做了两个修改：

① 修改 vite.config.js，根据环境变量来设置base路径：

\`\`\`javascript
const base = process.env.VERCEL ? "/" : "/my-blog/";
export default defineConfig({ base });
\`\`\`

② 在根目录新建 vercel.json 文件：

\`\`\`json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }],
  "build": {
    "outputDirectory": "dist"
  }
}
\`\`\`

**结果**：修改后重新部署，Vercel上的网站终于能正常访问了！

### 6. 国内不开加速器打不开

**我的遭遇**：部署成功后，我把网址分享给朋友，结果他们都说打不开，我自己试了一下，发现确实有时候能打开有时候打不开，网络很不稳定。

**问题原因**：查了一下，原来GitHub Pages和Vercel的服务器都在国外，国内网络访问确实会受到影响，不是代码的问题。

**结论**：国内网络访问GitHub Pages和Vercel确实需要使用加速器，这是网络环境的问题，不是我们代码的问题。

## 部署总结

经过这一系列的踩坑，我终于成功部署了我的个人博客。现在回顾一下整个过程，其实这些问题都有相应的解决方案，只是一开始不知道而已。

**部署成功的关键步骤**：

1. 配置SSH密钥解决网络不稳定问题
2. 移除有问题的GitHub Actions配置
3. 使用hash模式避免404错误
4. 配置Vite支持Markdown文件
5. 为Vercel设置正确的配置

## 一些小建议

1. **耐心**：部署过程中遇到问题很正常，要保持耐心，仔细查找原因
2. **记录**：把遇到的问题和解决方案记录下来，以后遇到类似问题可以参考
3. **备份**：定期备份代码，防止意外情况
4. **测试**：部署后一定要测试各种情况，确保网站正常运行
5. **学习**：多了解部署相关的知识，提高自己的技能

## 最后的感想

部署网站的过程虽然有点坎坷，但是解决问题的过程也让我学到了很多东西。现在看到自己的博客成功上线，那种成就感还是很满足的。

希望这篇日记能帮助其他遇到类似问题的同学，少走一些弯路。如果有什么问题，欢迎一起交流讨论！
`;export{e as default};