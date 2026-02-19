# Publish InsureAI to GitHub

## Step 1: Create a GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Fill in:
   - **Repository name**: `insure-ai`
   - **Description**: `AI-powered insurance chatbot with multi-agent LangGraph workflow`
   - **Visibility**: Private (or Public)
   - **DO NOT** check "Add a README", ".gitignore", or "License" (you already have these locally)
3. Click **Create repository**

## Step 2: Initialize Git Locally

```bash
cd C:\langgraph-test\insure-ai

git init
git branch -M main
```

## Step 3: Stage and Review

```bash
git add .
git status
```

Verify that these are **NOT** listed (they should be ignored by `.gitignore`):
- `.env` (contains API keys)
- `.venv/` (Python virtual environment)
- `backend/db/insurance_support.db` (generated database)
- `backend/vectordb/chroma_faq_db/` (generated vector store)
- `frontend/node_modules/` (npm packages)
- `frontend/dist/` (build output)

## Step 4: Commit

```bash
git commit -m "Initial commit: InsureAI multi-agent chatbot with executive report feature"
```

## Step 5: Connect to GitHub and Push

Replace `YOUR_USERNAME` with your GitHub username.

**Option A — HTTPS:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/insure-ai.git
git push -u origin main
```

**Option B — SSH:**
```bash
git remote add origin git@github.com:YOUR_USERNAME/insure-ai.git
git push -u origin main
```

## Step 6: Authenticate (if prompted)

### For HTTPS
GitHub no longer accepts passwords. Use a **Personal Access Token**:
1. Go to GitHub → **Settings** → **Developer Settings** → **Personal Access Tokens** → **Tokens (classic)**
2. Click **Generate new token**
3. Select the `repo` scope
4. Copy the token
5. When prompted for a password during `git push`, paste the token

### For SSH
Make sure your SSH key is added:
1. Check if you have a key: `cat ~/.ssh/id_ed25519.pub`
2. If not, generate one: `ssh-keygen -t ed25519 -C "your_email@example.com"`
3. Add the public key to GitHub → **Settings** → **SSH and GPG keys**

## Step 7: Verify

Go to `https://github.com/YOUR_USERNAME/insure-ai` and confirm:
- `.env` is **NOT** visible (sensitive API keys)
- `.env.example` **IS** visible (safe template)
- `backend/db/` folder does **NOT** contain `.db` files
- `frontend/node_modules/` is **NOT** visible

## Quick Reference (all commands)

```bash
cd C:\langgraph-test\insure-ai
git init
git branch -M main
git add .
git status
git commit -m "Initial commit: InsureAI multi-agent chatbot with executive report feature"
git remote add origin https://github.com/YOUR_USERNAME/insure-ai.git
git push -u origin main
```
