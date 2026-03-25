# Deployment Guide

## Quick Deploy to Vercel

### 1. Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### 2. Deploy from this directory
```bash
cd /Users/scott.jones/ai-workspace/verification-comparison
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? (Select your account)
- Link to existing project? **N**
- Project name? (default: verification-comparison) **Enter**
- In which directory is your code located? **./** **Enter**

Vercel will:
- ✅ Auto-detect Next.js
- ✅ Build and deploy
- ✅ Give you a live URL (e.g., `verification-comparison.vercel.app`)

### 3. Production Deploy
```bash
vercel --prod
```

## Alternative: Deploy via GitHub

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: VerifEye vs FaceTec comparison tool"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repo
   - Vercel auto-detects Next.js settings
   - Click "Deploy"

3. **Auto-deploys on push**
   - Every push to `main` auto-deploys to production
   - Pull requests get preview URLs

## Custom Domain (Later)

Once deployed to Vercel, you can add a custom domain:
1. Go to Project Settings → Domains
2. Add `compare.realeyes.ai` (or your preferred subdomain)
3. Follow DNS setup instructions
4. Vercel auto-provisions SSL

## Environment Variables (if needed)

If you add analytics or tracking later:
1. Go to Project Settings → Environment Variables
2. Add variables (e.g., `NEXT_PUBLIC_ANALYTICS_ID`)
3. Redeploy

## Monitoring

Vercel Dashboard shows:
- ✅ Build logs
- ✅ Deployment history
- ✅ Analytics (page views, performance)
- ✅ Error tracking
