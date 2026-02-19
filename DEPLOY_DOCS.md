# Deploy Documentation to Mintlify

## Prerequisites

- Node.js 18+
- npm 9+
- GitHub repository with the `docs/` folder pushed

## Step 1: Update Placeholder URLs

Edit `docs/mint.json` and replace all instances of `YOUR_USERNAME` with your actual GitHub username:

```
https://github.com/YOUR_USERNAME/insure-ai
```

There are 3 places to update:
- `topbarLinks` → `url`
- `anchors` → `url`
- `footerSocials` → `github`

## Step 2: Install Mintlify CLI

```bash
npm install -g mintlify
```

## Step 3: Preview Locally

```bash
cd docs
mintlify dev
```

This starts a local server at `http://localhost:3000`. Verify:

- Navigation sidebar loads correctly
- All 28 pages render without errors
- Mermaid diagrams display
- Code blocks have syntax highlighting
- Accordions, Cards, Steps, and Tabs work

Press `Ctrl + C` to stop the preview server.

## Step 4: Deploy to Mintlify Cloud

### Option A — Mintlify Dashboard (Recommended)

1. Go to [dashboard.mintlify.com](https://dashboard.mintlify.com)
2. Sign up or log in
3. Click **New Project**
4. Connect your GitHub repository (`insure-ai`)
5. Set the **docs directory** to `docs/`
6. Click **Deploy**

Your docs will be live at `https://your-org.mintlify.app`.

Every push to `main` will auto-deploy.

### Option B — Mintlify CLI Deploy

```bash
cd docs
mintlify deploy
```

Follow the prompts to authenticate and select your project.

### Option C — Self-Host as Static Site

If you prefer to host on Vercel, Netlify, or GitHub Pages:

```bash
cd docs
mintlify build --output ../docs-dist
```

Then deploy the `docs-dist/` folder to your preferred static hosting provider.

#### GitHub Pages

1. Push `docs-dist/` to a `gh-pages` branch:
   ```bash
   git subtree push --prefix docs-dist origin gh-pages
   ```
2. Go to GitHub → Repository → Settings → Pages
3. Set source to `gh-pages` branch

#### Vercel

1. Import the repository on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `docs/`
3. Set **Build Command** to `mintlify build`
4. Set **Output Directory** to `.output`

#### Netlify

1. Import the repository on [netlify.com](https://netlify.com)
2. Set **Base Directory** to `docs/`
3. Set **Build Command** to `mintlify build`
4. Set **Publish Directory** to `docs/.output`

## Step 5: Custom Domain (Optional)

If using Mintlify Cloud:

1. Go to your Mintlify Dashboard → Settings → Custom Domain
2. Add your domain (e.g., `docs.insure-ai.com`)
3. Add the DNS records Mintlify provides:
   - `CNAME` record pointing to `your-org.mintlify.app`
4. Wait for DNS propagation (up to 24 hours)

## Verification

After deployment, verify these pages load correctly:

- [ ] Overview page (`/introduction/overview`)
- [ ] Quickstart (`/quickstart/quickstart`)
- [ ] Architecture diagram renders (`/architecture/architecture`)
- [ ] API Reference with code blocks (`/api/rest-api`)
- [ ] FAQ accordions expand (`/troubleshooting/faq`)
- [ ] Navigation sidebar shows all 11 sections

## Updating Documentation

After initial deployment, any changes pushed to `main` will auto-deploy (Mintlify Cloud) or require a rebuild (self-hosted).

```bash
# Edit a docs page
# Commit and push
git add docs/
git commit -m "Update documentation"
git push origin main
```

## Deployment Options Summary

| Method | Cost | Auto-Deploy | Custom Domain | Setup Time |
|--------|------|-------------|---------------|------------|
| Mintlify Cloud | Free tier available | Yes | Yes (paid) | 5 min |
| Vercel | Free tier | Yes | Yes (free) | 15 min |
| Netlify | Free tier | Yes | Yes (free) | 15 min |
| GitHub Pages | Free | Manual | Yes (free) | 20 min |
