# Simple Netlify OAuth Setup (5 minutes, Free Forever)

## Step 1: Create Free Netlify Account
1. Go to: https://app.netlify.com/signup
2. Sign up with GitHub (easiest)
3. No credit card needed

## Step 2: Create OAuth Credentials
1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Blog CMS
   - **Homepage URL**: https://daviddawson.github.io/daviddawson.me
   - **Authorization callback URL**: https://api.netlify.com/auth/done
4. Save your Client ID and Secret

## Step 3: Configure Netlify
1. In Netlify dashboard: Site settings → Access control → OAuth
2. Under "Authentication providers", click "Install provider"
3. Choose GitHub
4. Enter your Client ID and Secret from Step 2
5. Click "Install"

## Step 4: Update Your Config
Edit `/static/admin/config.yml`:

```yaml
backend:
  name: github
  repo: daviddawson/daviddawson.me
  branch: main
  base_url: https://api.netlify.com
  site_domain: daviddawson.github.io/daviddawson.me
```

## Step 5: Push Changes
```bash
git add .
git commit -m "Configure Netlify OAuth"
git push
```

## That's It!
- Visit: https://daviddawson.github.io/daviddawson.me/admin/
- Click "Login with GitHub"
- You're done!

## What This Costs
- **Netlify**: $0 (OAuth service is free)
- **GitHub Pages**: $0 (hosting is free)
- **Total**: $0/month forever

## What Netlify Can See
- They handle the OAuth flow
- They cannot access your content
- They cannot see your repository
- They just verify you're authorized