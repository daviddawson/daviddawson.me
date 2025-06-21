---
title: Welcome to My New Static Blog FTW!
aliases: ['/welcome-to-new-blog/']
date: 2024-01-15T10:00:00.000Z
draft: false
categories:
  - Coding
  - Guide
tags:
  - hugo
  - static-site
  - jamstack
description: I've migrated my WordPress blog to a static site using Hugo and
  Decap CMS. Here's why and how.
---

I've just completed migrating my blog from WordPress to a static site generator. This new setup gives me the best of both worlds: the simplicity and security of static files with the convenience of a visual editor.

## Why I Made the Switch

After years of maintaining WordPress sites, I wanted something simpler:

- **No database to maintain** - Everything is stored in Git
- **Better performance** - Static files served from a CDN
- **Enhanced security** - No server-side code to exploit
- **Version control** - Every change tracked in Git
- **Simple backups** - Just clone the repository

## The Technology Stack

I chose a modern JAMstack approach:

1. **Hugo** - Lightning-fast static site generator
2. **Decap CMS** - Git-based content management with visual editing
3. **GitHub Pages** - Free, reliable hosting
4. **GitHub Actions** - Automated deployment pipeline

## How It Works

When I want to write a new post:

1. I navigate to `/admin` on my site
2. Log in with GitHub OAuth
3. Use the visual editor to write my content
4. Click publish - it commits directly to Git
5. GitHub Actions automatically rebuilds and deploys the site

The entire process takes less than a minute from hitting publish to seeing the post live.

## Benefits I'm Already Seeing

- **Blazing fast load times** - No database queries
- **Perfect Lighthouse scores** - Optimized by default
- **Markdown files** - Future-proof content format
- **Local development** - Work offline with live preview
- **Free hosting** - GitHub Pages handles everything

## Next Steps

I plan to:
- Migrate all my existing WordPress content
- Set up Bunny CDN for even better performance
- Customize the theme to match my style
- Add more advanced features like search

If you're considering a similar migration, I highly recommend this approach. The initial setup takes a bit of work, but the long-term benefits are worth it.
