# Kanso

A static-based personal website system powered by Markdown.

[简体中文](./README.md) | English

## Features

-   Minimalist Design - Clean, distraction-free reading experience
-   Markdown Writing - Write in Markdown with MDX support
-   Multilingual Ready - Support for multiple languages in UI and content
-   Modern Stack - Built with Next.js for optimal performance
-   Deploy Anywhere - One-click deploy to Vercel, Netlify, or your own server
-   Comments - Integrated with Giscus for community engagement
-   SEO Optimized - Full SEO support out of the box
-   RSS Feed - Keep your readers updated

## Quick Start

1. Click "Use this template" to create your repository
2. Edit `src/i18n/resources/en.json` with your information
3. Deploy to your preferred platform

## Deploying to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRiverTwilight%2Frene.wang)

## Deploying to Netify

```bash
CI= yarn run build
```

<details>
<summary>Deploying to Your Own Server</summary>

### 0. Server Configuration

Make sure that Node.js, git, and pm2 are installed on the server.

Create a `/app/ygk-blog` directory on the server and execute git init to initialize the repository.

```bash
mkdir -p /app/blog && cd /app/blog
git init
```

### 1. GitHub Repository Configuration

Create a repository on GitHub and add server information under Setting -> Secrets.

```bash
SSH_HOST: Server IP
SSH_USERNAME: Server username
SSH_PORT: SSH port (default 22)
SSH_PASSWORD: Server user password
```

Add the server's git public key under Deploy Keys in the GitHub repository (generation method).

```sh
vim ~/.ssh/id_rsa.pub
```

### 2. Pushing Code

Make sure that the Action is enabled, and all updates to the main branch on GitHub will be automatically deployed to the server. Congratulations!

</details>

## Writing

Place `.mdx` files in the `/content/crafts/<locale>` directory. Each article must have at least the following frontmatter:

```yaml
---
title: Your Article Title
createAt: 2024-01-01
---
```

## License

MIT
