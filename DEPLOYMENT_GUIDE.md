# 🚀 Deployment Guide - Make Your App Live Online

This guide will help you deploy your Lead Management System to a live URL so anyone can access it online.

## 🎯 Recommended Platforms (Free Tier Available)

### Option 1: Render (Easiest - Recommended) ⭐
- **Free tier:** Yes (with limitations)
- **Auto-deploy from GitHub:** Yes
- **PostgreSQL:** Built-in support
- **URL:** `your-app-name.onrender.com`

### Option 2: Railway
- **Free tier:** Yes (with $5 credit/month)
- **Auto-deploy from GitHub:** Yes
- **PostgreSQL:** Built-in support
- **URL:** `your-app-name.up.railway.app`

### Option 3: Fly.io
- **Free tier:** Yes
- **Auto-deploy from GitHub:** Yes
- **PostgreSQL:** Available
- **URL:** `your-app-name.fly.dev`

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- ✅ Your code is pushed to GitHub
- ✅ You have a Supabase database (or other PostgreSQL database)
- ✅ You know your database connection details
- ✅ You have a strong `SESSION_SECRET` ready

---

## 🚀 Deploy to Render (Step-by-Step)

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account (recommended)
3. Verify your email

### Step 2: Create a New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository:
   - Select **"Connect GitHub"** if not connected
   - Find and select `hariharandevarajs/LMS`
3. Configure your service:
   - **Name:** `lms` (or any name you like)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** Leave empty
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Click **"Create Web Service"**

### Step 3: Add Environment Variables

In your Render dashboard, go to **Environment** tab and add:

```
PORT=10000
DB_HOST=db.your-project.supabase.co
DB_USER=postgres
DB_PASSWORD=your-supabase-password
DB_NAME=postgres
DB_PORT=5432
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password
SESSION_SECRET=generate-a-random-secret-here
```

**Important:** 
- Render automatically sets `PORT`, but you can set it to `10000` as backup
- Use your actual Supabase credentials
- Generate a strong `SESSION_SECRET` (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

### Step 4: Deploy

1. Render will automatically start building and deploying
2. Wait for deployment to complete (5-10 minutes first time)
3. Your app will be live at: `https://your-app-name.onrender.com`

### Step 5: Set Up Database Tables

Once deployed, you need to run the database setup. You have two options:

**Option A: Use Render Shell (Recommended)**
1. In Render dashboard, click **"Shell"** tab
2. Run: `node setup-db.js`
3. Wait for "Database setup completed successfully!"

**Option B: Run Locally (Before First Deploy)**
1. Set your `.env` to use the same Supabase database
2. Run: `node setup-db.js`
3. Tables will be ready when Render connects

### Step 6: Access Your Live App

- **Landing Page:** `https://your-app-name.onrender.com`
- **Admin Dashboard:** `https://your-app-name.onrender.com/dashboard`
- **Login:** `https://your-app-name.onrender.com/login`

---

## 🚂 Deploy to Railway (Alternative)

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose `hariharandevarajs/LMS`

### Step 3: Configure Environment Variables

1. Click on your service → **Variables** tab
2. Add all environment variables (same as Render above)

### Step 4: Deploy

Railway will automatically detect your `package.json` and deploy. Your app will be live at `your-app-name.up.railway.app`

---

## ✈️ Deploy to Fly.io (Alternative)

### Step 1: Install Fly CLI

```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

### Step 2: Login

```bash
fly auth login
```

### Step 3: Initialize Fly App

```bash
fly launch
```

Follow the prompts. Fly will create a `fly.toml` file.

### Step 4: Set Secrets (Environment Variables)

```bash
fly secrets set DB_HOST=db.your-project.supabase.co
fly secrets set DB_USER=postgres
fly secrets set DB_PASSWORD=your-password
fly secrets set DB_NAME=postgres
fly secrets set DB_PORT=5432
fly secrets set ADMIN_EMAIL=admin@example.com
fly secrets set ADMIN_PASSWORD=your-password
fly secrets set SESSION_SECRET=your-secret
```

### Step 5: Deploy

```bash
fly deploy
```

---

## 🔧 Post-Deployment Setup

### 1. Set Up Database Tables

After first deployment, you need to create tables. Options:

**Using Render Shell:**
```bash
node setup-db.js
```

**Using Local Machine:**
- Connect to your Supabase database
- Run `node setup-db.js` locally (it will create tables in your Supabase DB)

### 2. Test Your Live App

1. Visit your live URL
2. Test the lead form
3. Login to dashboard
4. Verify everything works

### 3. Set Up Custom Domain (Optional)

Most platforms allow custom domains:
- **Render:** Settings → Custom Domains
- **Railway:** Settings → Domains
- **Fly.io:** `fly domains add yourdomain.com`

---

## 🔒 Security Checklist

Before going live:

- [ ] Change default admin password
- [ ] Use strong `SESSION_SECRET`
- [ ] Ensure `.env` is in `.gitignore` (already done)
- [ ] Use HTTPS (all platforms provide this automatically)
- [ ] Review your database credentials

---

## 🐛 Troubleshooting

### Problem: "Application Error" or "Service Unavailable"

**Solutions:**
- Check Render/Railway logs for errors
- Verify all environment variables are set correctly
- Make sure database is accessible (not paused in Supabase)
- Check that `PORT` environment variable is set

### Problem: "Database connection failed"

**Solutions:**
- Verify Supabase database is active (not paused)
- Check database credentials in environment variables
- Ensure database allows connections from your platform's IP
- For Supabase: Check connection pooling settings

### Problem: "Cannot find module"

**Solutions:**
- Make sure `package.json` has all dependencies
- Check build logs to see if `npm install` completed
- Verify `node_modules` is not in repository (should be in `.gitignore`)

### Problem: Tables don't exist

**Solution:**
- Run `node setup-db.js` using platform's shell/console
- Or run it locally pointing to the same database

---

## 📊 Monitoring Your App

### Render
- View logs: Dashboard → Your Service → Logs
- Metrics: Dashboard → Metrics tab

### Railway
- View logs: Dashboard → Deployments → View Logs
- Metrics: Dashboard → Metrics

### Fly.io
```bash
fly logs
fly status
```

---

## 🔄 Updating Your App

After making changes:

1. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

2. **Auto-deploy:** Most platforms auto-deploy on push to `main` branch

3. **Manual deploy:** Some platforms have a "Deploy" button in dashboard

---

## 💰 Cost Information

### Free Tiers:

- **Render:** Free tier available (spins down after 15 min inactivity)
- **Railway:** $5 credit/month (usually enough for small apps)
- **Fly.io:** Free tier with generous limits

### Paid Options:

If you need 24/7 uptime or more resources, consider paid plans starting around $7-10/month.

---

## 🎉 Success!

Once deployed, your app will have:
- ✅ Live URL accessible from anywhere
- ✅ HTTPS encryption (automatic)
- ✅ Auto-deploy from GitHub
- ✅ Professional hosting

**Share your live URL:** `https://your-app-name.onrender.com`

---

## 📝 Quick Reference

**Environment Variables Needed:**
```
PORT=10000
DB_HOST=your-db-host
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=postgres
DB_PORT=5432
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
SESSION_SECRET=random-secret
```

**Commands:**
```bash
# Deploy to Render/Railway: Just push to GitHub (auto-deploy)
git push

# Deploy to Fly.io
fly deploy

# Set up database tables
node setup-db.js
```

---

**Need help?** Check platform documentation:
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Fly.io Docs](https://fly.io/docs)

