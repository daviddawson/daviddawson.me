# GitHub-Only CMS Options (No External Services)

## Option 1: Prose.io
- **URL**: http://prose.io
- **How it works**: Uses GitHub OAuth directly in the browser
- **Setup**: Just visit prose.io and authorize with GitHub
- **Pros**: Zero setup, works immediately
- **Cons**: Basic editor, no visual preview

## Option 2: GitHub's Built-in Editor
- **How**: Edit files directly on github.com
- **Press**: `.` (period) on any repo page to open VS Code in browser
- **Pros**: No setup at all, full VS Code features
- **Cons**: No CMS features, requires markdown knowledge

## Option 3: Forestry.io (Now Tina Cloud)
- **Note**: Has a free tier but requires account
- **Alternative**: TinaCMS can run locally without cloud services

## Option 4: NetlifyCMS/DecapCMS with GitHub App
- **Limitation**: GitHub Apps can't do OAuth in browser-only environments
- **Result**: Still need a backend service

## The Technical Reality

GitHub OAuth requires a backend to:
1. Keep your Client Secret secure (can't expose in browser)
2. Exchange OAuth codes for tokens
3. Handle the OAuth callback

This is why every browser-based CMS needs either:
- A backend service (Cloudflare Workers, Netlify, etc.)
- Direct GitHub token (security risk)
- Use GitHub's own editors

## Recommendation

If you want **zero external dependencies**, your best options are:
1. **Prose.io** - Simple but works
2. **GitHub's web editor** - Press `.` on your repo
3. **Local editing** - Clone, edit, push

If you want a **real CMS experience**, you need one backend service:
- Cloudflare Workers (free, no credit card)
- Netlify (free tier)
- Any small server (even a free Render.com instance)