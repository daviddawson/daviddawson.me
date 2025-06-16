# daviddawson.me

Personal blog hosted on GitHub Pages at https://daviddawson.github.io/daviddawson.me

## Sveltia CMS Setup (No Netlify Required)

This site uses Sveltia CMS - a modern, GitHub-friendly alternative to Decap CMS that works perfectly with GitHub Pages without any Netlify dependencies.

### Quick Setup

1. **Run the setup script**:
   ```bash
   ./cloudflare-oauth-setup.sh
   ```
   This will guide you through setting up OAuth authentication using Cloudflare Workers (free tier).

2. **Or follow manual setup** in `GITHUB_PAGES_CMS_SETUP.md`

### Why Sveltia CMS?

- Drop-in replacement for Decap CMS
- Better GitHub integration
- Modern UI and performance
- Works seamlessly with GitHub Pages
- No vendor lock-in to Netlify

### Current Configuration

- **CMS**: Sveltia CMS
- **Backend**: GitHub
- **Authentication**: External OAuth (needs to be configured)
- **Hosting**: GitHub Pages

### OAuth Setup Options

Choose one of these free options:

1. **Cloudflare Workers** (Recommended)
   - Free tier available
   - Fast and reliable
   - Easy setup with provided script

2. **Render.com**
   - Free tier with 750 hours/month
   - Simple deployment

3. **Railway**
   - Free trial available
   - Good performance

### Managing Editor Access

Access is controlled by GitHub repository permissions:

1. Go to: https://github.com/daviddawson/daviddawson.me/settings/access
2. Add collaborators with "Write" permission
3. They can log in with their GitHub account

### Local Development

```bash
# Start Hugo development server
hugo server -D

# Access CMS at http://localhost:1313/admin/
# Click "Work with local repository" for local editing
```

### Testing the CMS

1. Open `test-cms.html` in your browser to check configuration status
2. Visit `/admin/` to access the CMS
3. Log in with your GitHub account

### Project Structure

```
daviddawson.me/
├── static/
│   └── admin/
│       ├── index.html    # Sveltia CMS loader
│       └── config.yml    # CMS configuration
├── content/              # Blog posts and pages
├── GITHUB_PAGES_CMS_SETUP.md  # Detailed setup guide
└── cloudflare-oauth-setup.sh  # Automated setup script
```

### Troubleshooting

- **"Not Found" error**: OAuth backend not configured - run setup script
- **"Authentication Failed"**: Check OAuth app credentials
- **CORS errors**: Verify allowed domains in OAuth backend

### Resources

- [Sveltia CMS Documentation](https://github.com/sveltia/sveltia-cms)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [GitHub OAuth Apps](https://docs.github.com/en/apps/oauth-apps)