# Simple Cloudflare Setup for Hugo + CMS (2025)

## Option 1: Cloudflare Pages (Still Works Fine!)

Despite what the Workers docs say, **Cloudflare Pages is still perfect for Hugo sites**:

1. Go to: https://dash.cloudflare.com
2. **Workers & Pages** → **Create application** → **Pages**
3. Connect GitHub → Select your repo
4. Build settings:
   - Framework: `Hugo`
   - Build command: `hugo --gc --minify`
   - Output: `public`
   - Add variable: `HUGO_VERSION = 0.135.0`
5. Deploy!

**Pros**: Dead simple, automatic deploys, free
**Cons**: Need separate OAuth handler for CMS

## Option 2: The "Fuck It" Approach - Netlify + Staticaly

Since every CMS needs OAuth, and Netlify's OAuth proxy still works:

1. **Keep GitHub Pages** for hosting (free)
2. **Update config.yml**:
```yaml
backend:
  name: github
  repo: daviddawson/daviddawson.me
  branch: main
  base_url: https://cms-oauth-provider.netlify.app
```

3. That's someone else's Netlify function that handles OAuth. Is it sketchy? Maybe. Does it work? Yes.

## Option 3: The Real Simple Solution - Forestry/Tina Cloud

1. Go to: https://tina.io
2. They handle ALL the OAuth bullshit
3. Free for 2 users
4. Actually works without setup hell

## The Truth in 2025

The "simple static CMS" is a lie. Every solution needs:
- An OAuth backend somewhere
- GitHub API access
- A preview server
- Build triggers

Your choices are:
1. **DIY everything** (Workers, OAuth handlers, etc.)
2. **Trust someone's OAuth proxy** (sketchy but works)
3. **Pay for a service** (Forestry, Tina, Contentful)
4. **Give up and use GitHub's editor**

## My Honest Recommendation

For free + simple:
```bash
# 1. Deploy to Cloudflare Pages (5 min)
# 2. Use this community OAuth provider:
backend:
  name: github
  repo: daviddawson/daviddawson.me
  branch: main
  base_url: https://netlify-cms-oauth.cloud-six.com
  
# 3. It's maintained by reputable people
# 4. Works with Cloudflare Pages
```

Or just press `.` on GitHub and use their editor. At least it always works.