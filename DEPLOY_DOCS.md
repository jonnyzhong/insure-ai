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

> **Important:** Mintlify is a hosted platform — it does **not** support static export
> (`mintlify build` does not exist). You must use Mintlify Cloud for deployment.

### Mintlify Dashboard

1. Go to [dashboard.mintlify.com](https://dashboard.mintlify.com)
2. Sign up or log in with GitHub
3. Click **New Project**
4. Connect your GitHub repository (`insure-ai`)
5. Set the **docs directory** to `docs/`
6. Click **Deploy**

Your docs will be live at `https://your-org.mintlify.app`.

Every push to `main` will auto-deploy automatically.

## Step 5: Custom Domain (Optional)

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

After initial deployment, any changes pushed to `main` will auto-deploy:

```bash
# Edit a docs page
# Commit and push
git add docs/
git commit -m "Update documentation"
git push origin main
```

## Alternative: If You Need Free Self-Hosted Docs

Mintlify Cloud requires a paid plan for private repos. If you need a fully free,
self-hosted solution, consider migrating the `.mdx` content to one of these
static site generators:

| Tool | GitHub Pages | Build Command | Notes |
|------|-------------|---------------|-------|
| [VitePress](https://vitepress.dev) | Yes | `vitepress build` | Vue-based, Markdown, fast |
| [Docusaurus](https://docusaurus.io) | Yes | `docusaurus build` | React-based, MDX support |
| [Nextra](https://nextra.site) | Yes | `next build` | Next.js-based, MDX |
| [Starlight](https://starlight.astro.build) | Yes | `astro build` | Astro-based, lightweight |

These all produce static HTML that can be deployed to GitHub Pages, Vercel, or Netlify for free.
The `.mdx` content from the `docs/` folder can be reused with minor syntax adjustments
(Mintlify-specific components like `<CardGroup>`, `<Steps>`, `<Accordion>` would need replacement).
