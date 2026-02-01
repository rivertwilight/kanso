# Kanso

A static-based personal website system that seamlessly integrates with Notion and Markdown.

[简体中文](./README.md) | English

## ✨ Features

- Minimalist Design - Clean, distraction-free reading experience
- Dual Writing Flow - Write in Markdown or sync from Notion
- Multilingual Ready - Support for multiple languages in UI and content
- Modern Stack - Built with Next.js for optimal performance
- Deploy Anywhere - One-click deploy to Vercel, Netlify, or your own server
- Comments - Integrated with Giscus for community engagement
- SEO Optimized - Full SEO support out of the box
- RSS Feed - Keep your readers updated

## 🚀 Quick Start

1. Click "Use this template" to create your repository
2. Edit site.config.js with your information
3. Deploy to your preferred platform

## Deploying to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRiverTwilight%2Frene.wang)

## Deploying to Netify

```bash
CI= yarn run build
```

## Deploying to Your Own Server

0. Server Configuration
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

## ✍ Writing

Currently, two writing methods are supported:

1. Place the Markdown file in the /posts/<categories> directory. Currently, up to two-level directories are supported.
2. Automatically sync articles from Notion.

If you choose the first method, each article must have at least the following two frontmatter:

- title
- date

If you choose to use Notion for writing, refer to this [database] () to create a similar one.

Then, create a new Integration in Notion to obtain an API Key. Also, get your database_id.

Finally, add two environment variables in the GitHub repository:

```bash
NOTION_API_KEY=<YOUR_KEY>
NOTION_DATABASE_ID=<YOUR_ID>
```

> [!NOTE]  
> To get the NOTION_DATABASE_ID, open the page where the database is located, and the long string after the username in the browser URL is the id. To get the NOTION_API_KEY, you need to create a Connection on the first page of the Database, and then click "Manage connections" to get the TOKEN.

Once everything is ready, you can choose the deployment method you prefer.

## License

MIT
