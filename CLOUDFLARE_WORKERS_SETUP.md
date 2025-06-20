# Cloudflare Workers OAuth Setup

This sets up a self-hosted OAuth handler using Cloudflare Workers, so you don't need any external OAuth services.

## 1. Deploy the OAuth Worker

```bash
cd workers/oauth-handler
npm install
```

## 2. Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: "My Blog CMS"
   - **Homepage URL**: `https://daviddawson.me`
   - **Authorization callback URL**: `https://decap-oauth.YOUR-SUBDOMAIN.workers.dev/callback`
4. Click "Register application"
5. Save the Client ID and generate a Client Secret

## 3. Configure Worker Secrets

```bash
# Set your GitHub OAuth credentials
wrangler secret put GITHUB_CLIENT_ID
# Enter your Client ID when prompted

wrangler secret put GITHUB_CLIENT_SECRET
# Enter your Client Secret when prompted
```

## 4. Deploy the Worker

```bash
npm run deploy
```

This will output your worker URL, something like:
`https://decap-oauth.YOUR-SUBDOMAIN.workers.dev`

## 5. Update CMS Config

Update `/static/admin/config.yml`:

```yaml
backend:
  name: github
  repo: daviddawson/daviddawson.me
  branch: main
  base_url: https://decap-oauth.YOUR-SUBDOMAIN.workers.dev
  auth_endpoint: auth
```

## 6. Deploy Site to Cloudflare Pages

```bash
# In the root directory
git add .
git commit -m "Add Cloudflare Workers OAuth"
git push origin main
```

Then in Cloudflare dashboard:
1. Go to Workers & Pages
2. Create new Pages project
3. Connect your GitHub repo
4. Use these settings:
   - Framework: Hugo
   - Build command: `hugo --gc --minify`
   - Output directory: `public`
   - Environment variable: `HUGO_VERSION = 0.135.0`

## That's it!

- Your site: `https://daviddawson.me`
- Your CMS: `https://daviddawson.me/admin/`
- OAuth handled by your own Cloudflare Worker
- No external dependencies!

## How it works

The Cloudflare Worker handles:
1. GitHub OAuth flow
2. Token exchange
3. API proxying for the CMS

Everything runs on Cloudflare's infrastructure, no external OAuth services needed.