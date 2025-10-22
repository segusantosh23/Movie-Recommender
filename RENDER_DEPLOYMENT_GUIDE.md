# 🚀 Complete Render Deployment Guide

## Step 1: Access Render Dashboard
1. Go to: https://render.com
2. Sign in with your GitHub account
3. You should see your dashboard

## Step 2: Create New Static Site
1. Click **"New +"** in the top right corner
2. Select **"Static Site"** from the dropdown menu

## Step 3: Connect Repository
1. Click **"Connect GitHub"** (if not already connected)
2. Find and select: `segusantosh23/Movie-Recommender`
3. Click **"Connect"**

## Step 4: Configure Settings
**Basic Settings:**
- **Name**: `movie-recommender`
- **Branch**: `main`
- **Root Directory**: (leave empty)
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

## Step 5: Add Environment Variables
**CRITICAL STEP - This makes AI features work:**

1. Look for **"Environment Variables"** section
2. Click **"Add Environment Variable"**
3. Add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your actual Gemini API key
   - **Environment**: Production

**Get Gemini API Key:**
- Visit: https://makersuite.google.com/app/apikey
- Sign in with Google account
- Create new API key
- Copy the key

## Step 6: Deploy
1. Click **"Create Static Site"**
2. Wait for deployment (2-5 minutes)
3. Get your live URL

## Step 7: Test Your App
1. Visit your deployment URL
2. Test the AI recommendation feature
3. Verify all functionality works

## Troubleshooting
- **Build fails**: Check environment variables are set
- **AI not working**: Verify GEMINI_API_KEY is correct
- **Page not loading**: Check publish directory is `dist`

## Expected Result
- ✅ Live URL: `https://movie-recommender.onrender.com`
- ✅ AI recommendations working
- ✅ All features functional
