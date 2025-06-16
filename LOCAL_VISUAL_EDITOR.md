# Local Visual Editor Setup (Actually Simple)

## Option 1: Obsidian (Free, Beautiful)
1. Download: https://obsidian.md
2. Open your `/content/posts` folder as a vault
3. Install "Templater" plugin for front matter
4. Write with live preview
5. Git commit/push when done

**Pros**: Beautiful editor, live preview, works offline
**Cons**: Need to push manually

## Option 2: VS Code + Extensions
1. Open VS Code
2. Install "Front Matter CMS" extension
3. Run: `Front Matter: Initialize project`
4. Now you have a visual CMS in VS Code!

**Pros**: Full CMS experience, media management, preview
**Cons**: Still VS Code

## Option 3: Stackbit (Free tier)
1. Go to: https://stackbit.com
2. Import your GitHub repo
3. Visual editor in the cloud
4. Auto-commits to GitHub

**Pros**: True visual editor, no setup
**Cons**: Another service (but reputable)

## Option 4: TinaCMS (Run locally)
```bash
npx create-tina-app@latest --example hugo-starter
```

**Pros**: Fantastic visual editor
**Cons**: Requires Node.js

## The Truth About Web-Based CMS

Every web-based CMS needs OAuth because:
1. Browser can't access your GitHub token directly (security)
2. Someone needs to exchange codes for tokens (backend)
3. No backend = No GitHub access from browser

That's why they all need Netlify/Vercel/Whatever.

## My Real Recommendation

**Use Obsidian** - It's:
- Free
- Beautiful 
- Works offline
- Live preview
- Just git push when done

Or pay $10/month for Forestry.io/TinaCloud and get a proper CMS without the OAuth hassle.