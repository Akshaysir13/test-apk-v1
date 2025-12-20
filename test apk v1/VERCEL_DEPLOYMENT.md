# Deploy to Vercel + Supabase

Your app is ready for permanent deployment! Follow these steps:

## Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/jee-mock-test-portal
git push -u origin main
```

## Step 2: Deploy to Vercel
1. Go to https://vercel.com and sign up (free)
2. Click "New Project"
3. Select "Import Git Repository"
4. Find and select your `jee-mock-test-portal` repository
5. Vercel will auto-detect Vite settings ✓
6. Click "Environment Variables" and add:
   - **Key**: `VITE_SUPABASE_URL`
     **Value**: `https://ftqlbbpjcrwdxirzuxddg.supabase.co`
   - **Key**: `VITE_SUPABASE_ANON_KEY`
     **Value**: Your Supabase anon key
7. Click "Deploy"

## Step 3: Test Your App
- Vercel will provide a URL like `your-project.vercel.app`
- Your app will be live permanently with:
  ✓ Supabase authentication
  ✓ Test data persistence
  ✓ Violation tracking
  ✓ All security features enabled
  ✓ 100% uptime (no 7-day limit!)

## Getting Environment Variables

### From Supabase:
1. Go to https://supabase.com and log in
2. Select your project
3. Go to Settings > API
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Key** → `VITE_SUPABASE_ANON_KEY`

## Important Notes
- The app is already configured for Vercel (vercel.json, .vercelignore created)
- Build command: `npm run build` (auto-detected)
- Output: `dist/` folder (auto-detected)
- No additional configuration needed!

## Optional: Custom Domain
After deployment, you can add a custom domain in Vercel's Project Settings for free.

## Automatic Deployments
Every time you push to GitHub, Vercel automatically redeploys your app. This keeps everything in sync!

---

Need help? Check Vercel's docs: https://vercel.com/docs
