# Deploy Your Own OAuth Backend (Secure & Free)

## Option 1: Vercel (Recommended - Easiest)

### Step 1: Deploy to Vercel
1. Go to: https://github.com/vencax/netlify-cms-github-oauth-provider
2. Click "Deploy to Vercel" button
3. Create free Vercel account (with GitHub)
4. Set environment variables when prompted:
   - `OAUTH_CLIENT_ID`: Your GitHub OAuth Client ID
   - `OAUTH_CLIENT_SECRET`: Your GitHub OAuth Client Secret
5. Deploy (takes ~2 minutes)

### Step 2: Update your config.yml
```yaml
backend:
  name: github
  repo: daviddawson/daviddawson.me
  branch: main
  base_url: https://your-app-name.vercel.app
  auth_endpoint: api/auth
```

## Option 2: Render.com

### Step 1: Deploy to Render
1. Fork: https://github.com/vencax/netlify-cms-github-oauth-provider
2. Go to: https://render.com
3. New > Web Service
4. Connect your forked repo
5. Add environment variables:
   - `OAUTH_CLIENT_ID`
   - `OAUTH_CLIENT_SECRET`
6. Deploy (free tier: 750 hours/month)

## Option 3: Railway

Similar to Render, but with Railway:
1. Go to: https://railway.app
2. Deploy from GitHub
3. Add environment variables
4. Get your URL

## Why This Is Secure

- **You control the code** - It's your deployment
- **Open source** - You can audit the code
- **Your credentials** - Only stored in your deployment
- **No third parties** - Direct connection GitHub ↔ Your OAuth ↔ Your CMS

## What These Services Cost

- **Vercel**: Free for personal use
- **Render**: 750 hours/month free
- **Railway**: $5 credit to start

All are more than enough for OAuth handling.