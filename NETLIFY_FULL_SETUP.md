# Full Netlify Setup Guide

## Benefits of Full Netlify Hosting:
- **Simpler OAuth setup** - Just toggle it on
- **Automatic HTTPS** with Let's Encrypt
- **Global CDN** - Faster than GitHub Pages
- **Deploy previews** for branches
- **Form handling** built-in
- **Still free** for your usage

## Step 1: Deploy to Netlify

### Option A: Via GitHub (Recommended)
1. Go to: https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Select your repository: `daviddawson/daviddawson.me`
5. Build settings:
   - **Build command**: `hugo --gc --minify`
   - **Publish directory**: `public`
6. Click "Deploy site"

### Option B: Via CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify init
# Choose "Create & configure a new site"
# Team: Your team
# Site name: daviddawson (or leave blank for random)
```

## Step 2: Configure Build Settings

In Netlify dashboard → Site settings → Build & deploy:

### Environment variables:
```
HUGO_VERSION = 0.135.0
HUGO_ENV = production
```

## Step 3: Set Up CMS Authentication

1. Go to: **Site settings** → **Identity**
2. Click **"Enable Identity"**
3. Under **Registration preferences**, select **"Invite only"**
4. Under **External providers**:
   - Click **"Add provider"**
   - Select **GitHub**
   - Enter your GitHub OAuth credentials (from earlier)
5. Under **Services** → **Git Gateway**:
   - Click **"Enable Git Gateway"**

## Step 4: Update Your Config Files

### Update static/admin/config.yml:
```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "static/images"
public_folder: "/images"

collections:
  - name: "posts"
    label: "Blog Posts"
    folder: "content/posts"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Date", name: "date", widget: "datetime"}
      - {label: "Draft", name: "draft", widget: "boolean", default: false}
      - {label: "Categories", name: "categories", widget: "list", required: false}
      - {label: "Tags", name: "tags", widget: "list", required: false}
      - {label: "Description", name: "description", widget: "text", required: false}
      - {label: "Body", name: "body", widget: "markdown"}
```

### Update static/admin/index.html:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Content Manager</title>
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

### Add Identity redirect to your homepage:
Create `layouts/partials/netlify-identity.html`:
```html
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
```

Add to your theme's baseof.html before `</body>`.

## Step 5: Custom Domain (Optional)

1. Go to: **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter: `daviddawson.me`
4. Update your DNS:
   - Add CNAME record pointing to `[your-site].netlify.app`
   - Or use Netlify DNS (they'll guide you)

## Step 6: Invite Yourself as CMS User

1. Go to: **Identity** tab
2. Click **"Invite users"**
3. Enter your email
4. Check your email and accept the invite
5. Set a password

## Step 7: Remove GitHub Pages Workflow

```bash
rm -rf .github/workflows/deploy.yml
git add .
git commit -m "Remove GitHub Pages workflow, using Netlify"
git push
```

## That's It!

Your site will now:
- Build automatically on every push
- Have CMS at `/admin` with simple auth
- Be served from Netlify's global CDN
- Have automatic HTTPS

## Access Your CMS:
1. Go to: `https://[your-site].netlify.app/admin/`
2. Login with your email/password
3. Start editing!

## Costs:
Still **$0/month** for:
- 100GB bandwidth
- 300 build minutes
- Unlimited admin logins
- Custom domain
- HTTPS certificate