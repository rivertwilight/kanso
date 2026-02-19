# Kanso

A static-based personal website system powered by Markdown.

[简体中文](./README.md) | English

## Features

-   Minimalist Design with Amazon Kindle style
-   Write in Markdown with MDX support
-   Code block, mermaid and video block supported
-   Full SEO support out of the box
-   RSS Feed

## Quick Start

1. Click "Use this template" to create your repository
2. Edit `src/i18n/resources/en.json` with your information
3. Deploy to your preferred platform

## Deploying to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRiverTwilight%2Frene.wang)

<details>
<summary>Deploying to Your Own Server</summary>

### 0. Server Configuration

Make sure that Node.js, git, and pm2 are installed on the server.

Create a `/app/blog` directory on the server and execute git init to initialize the repository.

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

```mdx
---
title: Your Article Title
createAt: 2024-01-01
---

Article content.
```

## Projects

Place `.mdx` files in `content/projects` directory.

```mdx
---
title: Mute
createAt: 2026-02-12
cover: "/project/mute.png"
year: 2026
link: mute.ink
seo:
    keywords:
        - text RPG
        - AI fictoin
---
```

## License

MIT
