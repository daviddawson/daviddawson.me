#!/bin/bash

# Cloudflare Workers OAuth Setup Script for Sveltia CMS
# This script helps you set up OAuth authentication for GitHub Pages

echo "=== Sveltia CMS OAuth Setup for GitHub Pages ==="
echo ""
echo "This script will guide you through setting up OAuth authentication"
echo "using Cloudflare Workers (free tier) - No Netlify required!"
echo ""

# Check if config exists
if [ ! -f "static/admin/config.yml" ]; then
    echo "Error: static/admin/config.yml not found"
    echo "Please run this script from your site's root directory"
    exit 1
fi

echo "Step 1: GitHub OAuth App Setup"
echo "------------------------------"
echo "1. Open: https://github.com/settings/developers"
echo "2. Click 'New OAuth App'"
echo "3. Use these settings:"
echo "   - Application name: Your Site CMS"
echo "   - Homepage URL: https://daviddawson.github.io/daviddawson.me"
echo "   - Authorization callback URL: https://[your-worker].workers.dev/callback"
echo ""
echo "Press Enter when you've created the OAuth app..."
read

echo ""
echo "Step 2: Enter your OAuth credentials"
echo "------------------------------------"
read -p "Enter your GitHub OAuth Client ID: " client_id
read -s -p "Enter your GitHub OAuth Client Secret: " client_secret
echo ""

echo ""
echo "Step 3: Cloudflare Workers Setup"
echo "--------------------------------"
echo "1. Sign up for free at: https://cloudflare.com"
echo "2. Go to: https://github.com/sveltia/sveltia-cms-auth"
echo "3. Click 'Deploy with Workers' button"
echo "4. When prompted, use these environment variables:"
echo ""
echo "   GITHUB_CLIENT_ID=$client_id"
echo "   GITHUB_CLIENT_SECRET=[your-secret]"
echo "   ALLOWED_DOMAINS=daviddawson.github.io"
echo ""
echo "Press Enter when you've deployed the worker..."
read

echo ""
echo "Step 4: Update your configuration"
echo "---------------------------------"
read -p "Enter your Cloudflare Worker URL (e.g., https://cms-auth.yourname.workers.dev): " worker_url

# Update the config file
echo ""
echo "Updating static/admin/config.yml..."
sed -i.bak "s|# base_url: https://your-worker-name.your-subdomain.workers.dev|base_url: $worker_url|g" static/admin/config.yml

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Next steps:"
echo "1. Commit and push your changes:"
echo "   git add ."
echo "   git commit -m 'Configure Sveltia CMS OAuth'"
echo "   git push"
echo ""
echo "2. Wait 1-2 minutes for GitHub Pages to update"
echo ""
echo "3. Visit your CMS at:"
echo "   https://daviddawson.github.io/daviddawson.me/admin/"
echo ""
echo "4. Click 'Login with GitHub' to test"
echo ""
echo "Troubleshooting? Check GITHUB_PAGES_CMS_SETUP.md for detailed instructions."