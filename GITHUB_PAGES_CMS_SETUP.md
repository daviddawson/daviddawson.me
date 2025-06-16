# GitHub Pages CMS Setup - No Netlify Required

This guide will help you set up Sveltia CMS (a modern alternative to Decap CMS) on GitHub Pages without any Netlify involvement.

## Why Sveltia CMS?

- Drop-in replacement for Decap CMS with better GitHub integration
- Modern UI and better performance
- Works seamlessly with GitHub Pages
- No vendor lock-in

## Setup Options

### Option 1: Cloudflare Workers OAuth (Recommended - Free)

This is the most reliable free option for GitHub Pages.

#### Step 1: Create a GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `Your Site CMS`
   - **Homepage URL**: `https://daviddawson.github.io/daviddawson.me`
   - **Authorization callback URL**: `https://your-worker-name.your-subdomain.workers.dev/callback`
4. Click "Register application"
5. Save the **Client ID** and generate a **Client Secret**

#### Step 2: Deploy Cloudflare Workers OAuth Handler

1. Sign up for a free Cloudflare account at https://cloudflare.com
2. Fork this repository: https://github.com/sveltia/sveltia-cms-auth
3. Click "Deploy with Workers" button in the README
4. Configure environment variables:
   ```
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ALLOWED_DOMAINS=daviddawson.github.io
   ```
5. Deploy the worker
6. Note your worker URL (e.g., `https://cms-auth.yourname.workers.dev`)

#### Step 3: Update Your CMS Configuration

Edit `/static/admin/config.yml`:

```yaml
backend:
  name: github
  repo: daviddawson/daviddawson.me
  branch: main
  base_url: https://cms-auth.yourname.workers.dev
```

### Option 2: Render.com OAuth Backend (Free Tier)

#### Step 1: Create GitHub OAuth App

Same as Option 1, but use this callback URL:
- **Authorization callback URL**: `https://your-app-name.onrender.com/callback`

#### Step 2: Deploy to Render

1. Fork this repository: https://github.com/njfamirm/decap-cms-github-backend
2. Sign up at https://render.com
3. Create a new Web Service
4. Connect your forked repository
5. Set environment variables:
   ```
   OAUTH_CLIENT_ID=your_github_client_id
   OAUTH_CLIENT_SECRET=your_github_client_secret
   ORIGIN=https://daviddawson.github.io
   ```
6. Deploy (free tier includes 750 hours/month)

#### Step 3: Update Configuration

```yaml
backend:
  name: github
  repo: daviddawson/daviddawson.me
  branch: main
  base_url: https://your-app-name.onrender.com
```

### Option 3: Railway OAuth Backend (Free Trial)

#### Step 1: Create GitHub OAuth App

Callback URL: `https://your-app.up.railway.app/callback`

#### Step 2: Deploy to Railway

1. Fork: https://github.com/njfamirm/decap-cms-github-backend
2. Sign up at https://railway.app
3. Create new project from GitHub repo
4. Add environment variables
5. Deploy

#### Step 3: Update Configuration

```yaml
backend:
  name: github
  repo: daviddawson/daviddawson.me
  branch: main
  base_url: https://your-app.up.railway.app
```

## Testing Your Setup

1. Commit and push all changes to GitHub
2. Wait for GitHub Pages to update (1-2 minutes)
3. Visit: https://daviddawson.github.io/daviddawson.me/admin/
4. Click "Login with GitHub"
5. Authorize the OAuth app
6. You should now have access to the CMS

## Troubleshooting

### "Authentication Failed" Error
- Verify your OAuth app credentials are correct
- Check that the callback URL matches exactly
- Ensure your OAuth backend is running

### "Not Found" Error
- Make sure the admin files are in `/static/admin/`
- Check that GitHub Pages has finished deploying
- Verify the base_url in config.yml is correct

### CORS Errors
- Add your GitHub Pages domain to allowed origins in your OAuth backend
- For Cloudflare Workers, update the ALLOWED_DOMAINS variable

## Who Can Access the CMS?

Only GitHub users with write access to your repository can log in:
1. Go to: https://github.com/daviddawson/daviddawson.me/settings/access
2. Add collaborators with "Write" permission
3. They can log in with their GitHub account

## Local Development

For local development, Sveltia CMS works without OAuth:

1. Clone your repository
2. Run your static site generator (e.g., `hugo server`)
3. Visit http://localhost:1313/admin/
4. Click "Work with local repository"
5. Grant file system access when prompted

## Security Notes

- Never commit OAuth secrets to your repository
- Use environment variables for sensitive data
- Regularly rotate your OAuth credentials
- Monitor your OAuth app usage in GitHub settings

## Need Help?

- Sveltia CMS Documentation: https://github.com/sveltia/sveltia-cms
- GitHub OAuth Apps: https://docs.github.com/en/apps/oauth-apps
- Cloudflare Workers: https://workers.cloudflare.com/