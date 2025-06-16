# Netlify OAuth Setup for Decap CMS (2025 Guide)

## Important: Two Different Approaches

### Approach A: Using Netlify Identity (If hosting on Netlify)
This requires hosting your site on Netlify, not GitHub Pages.

### Approach B: Using Netlify as OAuth Provider Only (Your case - GitHub Pages hosting)
This is what you need - using Netlify's OAuth service while hosting on GitHub Pages.

---

## Approach B: Netlify OAuth Provider for GitHub Pages

### Step 1: Create a GitHub OAuth App
1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `My Blog CMS`
   - **Homepage URL**: `https://daviddawson.github.io/daviddawson.me`
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
4. Click "Register application"
5. Save your **Client ID** and **Client Secret**

### Step 2: Add OAuth Provider in Netlify
Since Netlify's UI changed in 2025, here's how to find it:

1. **Create a Netlify Site First** (drag any folder to https://app.netlify.com)
2. Once you have a site, go to:
   - **Site configuration** → **Integrations** → **Identity** → **Enable Identity**
3. Then go to:
   - **Site configuration** → **Identity** → **External providers**
4. Click **"Add provider"**
5. Select **GitHub**
6. Enter your GitHub OAuth **Client ID** and **Client Secret**
7. Click **Install**

### Step 3: Update Your Config
Your config.yml should be:

```yaml
backend:
  name: github
  repo: daviddawson/daviddawson.me
  branch: main
  base_url: https://api.netlify.com
  site_domain: daviddawson.github.io/daviddawson.me

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

### Step 4: Push Changes
```bash
git add .
git commit -m "Configure Netlify OAuth"
git push
```

### Step 5: Test
1. Wait 2-3 minutes for GitHub Pages to update
2. Go to: https://daviddawson.github.io/daviddawson.me/admin/
3. Click "Login with GitHub"
4. Authorize the app
5. You should see your CMS!

---

## Hugo Tags/Categories Setup

Yes! Hugo has excellent support for taxonomies (tags/categories). Here's how:

### 1. Configure Taxonomies (already in your hugo.toml)
```toml
[taxonomies]
  category = 'categories'
  tag = 'tags'
```

### 2. Hugo Automatically Creates:
- `/tags/` - Lists all tags
- `/tags/docker/` - Shows all posts tagged "docker"
- `/categories/` - Lists all categories
- `/categories/coding/` - Shows all posts in "Coding" category

### 3. To Add Search
Add this to your theme's layouts:

```html
<!-- In layouts/partials/search.html -->
<div class="search">
  <input type="text" id="search-input" placeholder="Search posts...">
  <div id="search-results"></div>
</div>

<script>
// Simple client-side search
const posts = [
  {{ range .Site.RegularPages }}
  {
    title: "{{ .Title }}",
    url: "{{ .Permalink }}",
    tags: {{ .Params.tags | jsonify }},
    categories: {{ .Params.categories | jsonify }},
    content: {{ .Plain | truncate 200 | jsonify }}
  },
  {{ end }}
];

document.getElementById('search-input').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const results = posts.filter(post => 
    post.title.toLowerCase().includes(query) ||
    post.content.toLowerCase().includes(query) ||
    post.tags.some(tag => tag.toLowerCase().includes(query))
  );
  
  // Display results
  const resultsDiv = document.getElementById('search-results');
  resultsDiv.innerHTML = results.map(post => 
    `<a href="${post.url}">${post.title}</a>`
  ).join('<br>');
});
</script>
```

### 4. Tag Cloud Widget
```html
<!-- In layouts/partials/tagcloud.html -->
<div class="tag-cloud">
  {{ range .Site.Taxonomies.tags }}
    <a href="{{ .Page.Permalink }}" 
       style="font-size: {{ math.Log (len .Pages) | add 1 }}em">
      {{ .Page.Title }} ({{ len .Pages }})
    </a>
  {{ end }}
</div>
```

Hugo handles all the heavy lifting for taxonomies - no plugins needed!

---

## Troubleshooting

### If login fails:
1. Check browser console for errors
2. Verify your GitHub OAuth callback URL is exactly: `https://api.netlify.com/auth/done`
3. Make sure `site_domain` in config.yml matches your GitHub Pages URL
4. Try incognito mode to rule out browser extensions

### If you can't find OAuth settings in Netlify:
The 2025 UI requires you to:
1. Have a site created first
2. Enable Identity service
3. Then OAuth providers appear under Identity settings

### Access Control:
- Only GitHub users with write access to your repo can log in
- Add collaborators: Repository Settings → Manage access → Invite collaborator