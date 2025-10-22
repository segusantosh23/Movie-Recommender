# Deployment Guide for Movie Recommender

This guide will help you deploy your Movie Recommender app to both Vercel and Render.

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to a GitHub repository
2. **API Keys**: You'll need a Gemini API key for AI recommendations
   - Get your API key from: https://makersuite.google.com/app/apikey

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add `GEMINI_API_KEY` with your actual API key

### Option 2: Deploy via Vercel Dashboard

1. **Connect GitHub**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**:
   - Add `GEMINI_API_KEY` with your actual API key

## Deployment to Render

### Option 1: Deploy via Render Dashboard

1. **Connect GitHub**:
   - Go to [render.com](https://render.com)
   - Sign in with GitHub
   - Click "New +" > "Static Site"

2. **Configure Build Settings**:
   - Connect your GitHub repository
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

3. **Set Environment Variables**:
   - Go to Environment tab
   - Add `GEMINI_API_KEY` with your actual API key

### Option 2: Deploy via render.yaml (Already configured)

The `render.yaml` file is already configured for your project. Simply:

1. Push your code to GitHub
2. Connect your repository to Render
3. Render will automatically detect the `render.yaml` file and use those settings

## Environment Variables

Both platforms require the following environment variable:

- `GEMINI_API_KEY`: Your Gemini AI API key for AI-powered movie recommendations

## Post-Deployment

1. **Test your deployment**: Visit your deployed URL and test the AI recommendation feature
2. **Monitor performance**: Check both platforms' dashboards for any issues
3. **Set up custom domain** (optional): Configure a custom domain in either platform's settings

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Ensure all dependencies are in `package.json`
   - Check that build command is correct (`npm run build`)

2. **Environment Variables**:
   - Verify API keys are correctly set in both platforms
   - Check that variable names match exactly

3. **Routing Issues**:
   - Both platforms are configured for SPA routing
   - All routes should redirect to `index.html`

### Support:

- **Vercel**: [Vercel Documentation](https://vercel.com/docs)
- **Render**: [Render Documentation](https://render.com/docs)

## Cost Considerations

- **Vercel**: Free tier available with generous limits
- **Render**: Free tier available with some limitations
- Both platforms offer paid plans for production use

Choose the platform that best fits your needs and budget!
