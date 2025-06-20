# Cloudflare Pages Setup (Actually Simple, Still Free)

## Why Cloudflare Pages?
- **Free tier**: Unlimited bandwidth (vs Netlify's 100GB)
- **No auth bullshit**: Use GitHub OAuth directly
- **Faster**: Better global CDN
- **Simpler**: No deprecated services

## Step 1: Deploy to Cloudflare Pages (3 minutes)

1. Go to: https://pages.cloudflare.com
2. Sign up/Login (free)
3. Click **"Create a project"**
4. **"Connect to Git"** → Authorize GitHub
5. Select `daviddawson/daviddawson.me`
6. Build settings:
   - **Framework preset**: Hugo
   - **Build command**: `hugo --gc --minify`
   - **Build output**: `public`
   - **Environment variable**: `HUGO_VERSION = 0.135.0`
7. Click **"Save and Deploy"**

## Step 2: Set Up OAuth (5 minutes)

Since we need OAuth somewhere, use the Cloudflare Worker approach:

1. In Cloudflare dashboard, go to **Workers & Pages**
2. Create new Worker
3. Deploy this OAuth handler: https://github.com/sveltia/sveltia-cms-auth
4. Set environment variables:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `ALLOWED_DOMAINS = your-site.pages.dev`

## Step 3: Update Config

```yaml
backend:
  name: github
  repo: daviddawson/daviddawson.me
  branch: main
  base_url: https://your-oauth-worker.workers.dev

media_folder: "static/images"
public_folder: "/images"
```

## Step 4: Custom Domain

1. Go to your Cloudflare Pages project
2. **Custom domains** → **Set up a custom domain**
3. Add `daviddawson.me`
4. Update your DNS (Cloudflare will guide you)

## That's It!

- Site: `https://daviddawson.me`
- CMS: `https://daviddawson.me/admin/`
- No deprecated services
- Actually works in 2025

## Alternative: Just Use Prose.io

Honestly? If you're this frustrated (I don't blame you), just use:

1. **Prose.io**: http://prose.io
   - Works with GitHub directly
   - No OAuth setup needed
   - Basic but functional

2. **GitHub.dev**: Press `.` on your repo
   - Full VS Code
   - Markdown preview
   - No setup at all

The "visual CMS on static sites" dream has become a nightmare of deprecated services and OAuth proxies. Pick your poison or just use GitHub's editor.