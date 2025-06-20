# David Dawson's Blog

A Hugo-based static blog with Decap CMS for content management, hosted on Cloudflare Pages with a self-hosted OAuth handler on Cloudflare Workers.

## Quick Start

### 1. Deploy to Cloudflare Pages

1. Fork this repository
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Create a new project and connect your GitHub repo
4. Build settings:
   - Framework preset: `Hugo`
   - Build command: `hugo --gc --minify`
   - Build output: `public`
   - Environment variable: `HUGO_VERSION = 0.135.0`

### 2. Set up OAuth for the CMS

See [CLOUDFLARE_WORKERS_SETUP.md](CLOUDFLARE_WORKERS_SETUP.md) for detailed instructions on deploying the OAuth handler.

### 3. Access the CMS

Once deployed, access your CMS at: `https://your-site.pages.dev/admin/`

## Local Development

```bash
# Install Hugo
brew install hugo  # macOS
# or download from https://gohugo.io/

# Clone the repo
git clone https://github.com/daviddawson/daviddawson.me.git
cd daviddawson.me

# Run locally
hugo server -D

# Build for production
hugo --gc --minify
```

## Project Structure

```
.
├── content/          # Blog posts and pages
├── static/           # Static assets
│   ├── admin/       # Decap CMS files
│   └── images/      # Blog images
├── themes/          # Hugo theme
├── workers/         # Cloudflare Workers code
│   └── oauth-handler/  # OAuth handler for CMS
└── hugo.toml        # Hugo configuration
```

## Writing Content

### Option 1: Visual CMS
Access `/admin/` on your deployed site to use the visual editor.

### Option 2: Git
Create markdown files in `content/posts/` with this format:

```markdown
---
title: "Your Post Title"
date: 2024-01-01T12:00:00Z
draft: false
categories: ["tech"]
tags: ["hugo", "static-site"]
---

Your content here...
```

## Deployment

The site automatically deploys to Cloudflare Pages when you push to the `main` branch.

## No External Dependencies

This setup is completely self-hosted:
- Static site on Cloudflare Pages (free tier)
- OAuth handler on Cloudflare Workers (free tier)
- No external OAuth services needed
- No databases required

## License

MIT