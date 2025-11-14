# Deployment Guide - HomeoCare to GitHub & Vercel

## Step 1: Push to GitHub

Since the automatic push had network issues, please run these commands manually in your terminal:

```bash
# Make sure you're in the project directory
cd "F:\placement project\housecare-main"

# Verify the remote is set
git remote -v

# Push to GitHub (you may need to authenticate)
git push -u origin main
```

**Note:** If you get authentication errors, you may need to:
- Use a Personal Access Token instead of password
- Set up SSH keys for GitHub
- Or use GitHub Desktop/Git GUI

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**: Visit [https://vercel.com](https://vercel.com) and sign in (or create an account)

2. **Import Repository**:
   - Click "Add New..." → "Project"
   - Import from GitHub: Select your repository `KartikNaphade2004/Homeocare`
   - If it's not visible, click "Adjust GitHub App Permissions" to grant access

3. **Configure Project Settings**:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Set Environment Variables**:
   - Click "Environment Variables" section
   - Add the following:
     - **Name**: `OPENAI_API_KEY`
     - **Value**: Your OpenAI API key (get it from https://platform.openai.com/api-keys)
     - **Environment**: Production, Preview, Development (select all)

5. **Deploy**:
   - Click "Deploy" button
   - Wait for the build to complete (usually 2-3 minutes)
   - Your app will be live at a URL like: `https://your-project-name.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow the prompts)
vercel

# For production deployment
vercel --prod
```

**Important:** When using CLI, you'll still need to add environment variables:
```bash
vercel env add OPENAI_API_KEY
```

## Step 3: Post-Deployment Configuration

1. **Verify Environment Variables**:
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Confirm `OPENAI_API_KEY` is set for all environments

2. **Test the Application**:
   - Visit your deployed URL
   - Try the homeopathic medicine suggestion feature
   - Check browser console for any errors

3. **Custom Domain (Optional)**:
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

## Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility (Vercel uses Node 18.x by default)
- Check build logs in Vercel dashboard

### API Errors
- Verify `OPENAI_API_KEY` is correctly set in Vercel environment variables
- Check that the API key is valid and has credits
- Review API route logs in Vercel dashboard

### GitHub Push Issues
- Check internet connection
- Try using SSH instead of HTTPS: `git remote set-url origin git@github.com:KartikNaphade2004/Homeocare.git`
- Use GitHub Desktop for easier authentication

## Resources

- **GitHub Repository**: https://github.com/KartikNaphade2004/Homeocare
- **Vercel Documentation**: https://vercel.com/docs
- **OpenAI API Keys**: https://platform.openai.com/api-keys

---

**Note**: Make sure your OpenAI API key is kept secure and never committed to GitHub!
