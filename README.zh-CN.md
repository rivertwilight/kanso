# Kanso

Kanso 是一个基于 Markdown 的静态个人网站系统。

简体中文 | [English](./README.en-US.md)

## ✨ 特点

-   极简设计 - 清爽、无干扰的阅读体验
-   Markdown 写作 - 支持 Markdown 和 MDX 格式
-   多语言支持 - UI 和内容支持多种语言
-   现代技术栈 - 使用 Next.js 构建，性能优异
-   灵活部署 - 一键部署到 Vercel、Netlify 或自己的服务器
-   评论系统 - 集成 Giscus 实现社区互动
-   SEO 优化 - 内置完整的 SEO 支持
-   RSS 订阅 - 保持读者更新

## 🚀 快速开始

1. Fork 此仓库
2. 部署到你喜欢的平台（参考下面的部署方法）
3. 部署到你喜欢的平台

## 部署到 Vercel

在你 Fork 的仓库，点击下方按钮。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRiverTwilight%2Frene.wang)

## 部署到 Netify

在你 Fork 的仓库，点击下方按钮。

[![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ReneWang/kanso)

## 部署到自己的服务器

### 0. 服务器配置

确保服务器已安装 Node.js、 git 和 pm2。

在服务器下创建/app/ygk-blog 目录，并执行`git init`初始化仓库。

```
mkdir -p /app/blog && cd /app/blog
git init
```

### 1.GitHub 仓库配置

在 github 创建一个仓库，并在`Setting`->`Secrets`下添加服务器信息。

-   SSH_HOST：服务器 IP
-   SSH_USERNAME：服务器用户名
-   SSH_PORT：SSH 端口（默认 22）
-   SSH_PASSWORD：服务器用户密码

在 GitHub 仓库的 `Deploy Keys` 下添加服务器 git 公钥（[生成方法](https://git-scm.com/book/zh/v2/%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84-Git-%E7%94%9F%E6%88%90-SSH-%E5%85%AC%E9%92%A5)）。

```sh
vim ~/.ssh/id_rsa.pub
```

### 2.推送代码

确保 Action 已启用之后，在 github 上所有 main 分支的更新都会自动部署到服务器。大功告成！

## ✍ 写作

将 `.mdx` 文件放入 `/content/crafts/<locale>` 目录即可。每篇文章至少需要以下 frontmatter：

```yaml
---
title: 文章标题
createAt: 2024-01-01
---
```

## License

MIT
