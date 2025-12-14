# 🔗 Complete Guide: Connecting to Supabase Database

A step-by-step guide to connect your Lead Management System to Supabase PostgreSQL database.

---

## 📋 Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with:
   - GitHub (recommended)
   - Email
   - Google account
4. Verify your email if required

---

## 🚀 Step 2: Create a New Project

1. After logging in, click **"New Project"** (green button)
2. Fill in the project details:
   - **Name:** `lms` or `lead-management` (any name you like)
   - **Database Password:** 
     - Create a strong password (save it somewhere safe!)
     - You'll need this password later
     - Example: `MySecurePassword123!@#`
   - **Region:** Choose closest to you (affects speed)
     - Examples: `US East`, `EU West`, `Asia Pacific`
   - **Pricing Plan:** Select **Free** (for development)
3. Click **"Create new project"**
4. ⏳ Wait 2-3 minutes for project to be created

---

## 🔑 Step 3: Get Your Database Connection Details

Once your project is ready:

1. In your Supabase dashboard, click on your project
2. Go to **Settings** (gear icon in left sidebar)
3. Click **Database** in the settings menu
4. Scroll down to find connection details

You'll see several connection options. Here's what you need:

### Option A: Connection Pooling (Recommended for Render/Cloud)

1. Scroll to **"Connection Pooling"** section
2. You'll see a connection string like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
3. **Copy this connection string** (click the copy icon)

### Option B: Connection String (Direct)

1. Scroll to **"Connection string"** section
2. Select **"URI"** tab
3. You'll see:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your actual password
5. **Copy this connection string**

### Option C: Individual Parameters

You can also get individual values:

1. **Host:** `db.xxxxx.supabase.co` (shown in Connection info)
2. **Database name:** `postgres` (default)
3. **Port:** 
   - `5432` for direct connection
   - `6543` for connection pooling
4. **User:** `postgres` (default)
5. **Password:** The one you created in Step 2

---

## 📝 Step 4: Set Up Your Local Environment

### Create `.env` File

In your project root folder, create or update `.env` file:

**Option 1: Using Connection String (Easiest)**

```env
# Supabase Connection (Pooling - Recommended)
DATABASE_URL=postgresql://postgres.xxxxx:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Server
PORT=3000

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me-to-secure-password

# Session Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
SESSION_SECRET=your-random-secret-key-here
```

**Option 2: Using Individual Variables**

```env
# Supabase Database Connection
DB_HOST=db.xxxxx.supabase.co
DB_USER=postgres
DB_PASSWORD=your-supabase-password
DB_NAME=postgres
DB_PORT=6543
DB_SSL=true

# Server
PORT=3000

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me-to-secure-password

# Session Secret
SESSION_SECRET=your-random-secret-key-here
```

**Important:**
- Replace `xxxxx` with your actual Supabase project reference
- Replace `your-password` with your actual Supabase database password
- Use port `6543` for connection pooling (recommended)
- Use port `5432` for direct connection

---

## 🗄️ Step 5: Create Database Tables

After setting up your connection, create the tables:

1. **Open terminal** in your project folder
2. **Make sure your `.env` file is configured** with Supabase credentials
3. **Run the setup script:**
   ```bash
   node setup-db.js
   ```

You should see:
```
Creating tables and indexes...
Database setup completed successfully!
```

---

## ✅ Step 6: Test Your Connection

### Test Locally

1. Start your server:
   ```bash
   npm run dev
   ```

2. Check the console - you should see:
   ```
   ✅ Database connected successfully
   Server listening on port 3000
   ```

3. Test the app:
   - Visit: http://localhost:3000
   - Submit a test lead
   - Login to dashboard and verify the lead appears

### Verify in Supabase

1. Go to Supabase Dashboard
2. Click **Table Editor** (left sidebar)
3. You should see the `leads` table
4. Click on it to see your data

---

## 🌐 Step 7: For Render/Cloud Deployment

When deploying to Render or other cloud platforms:

### In Render Dashboard:

1. Go to your service → **Environment** tab
2. Add environment variables:

**Using Connection String:**
```
DATABASE_URL=postgresql://postgres.xxxxx:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
SESSION_SECRET=your-secret
```

**Or Using Individual Variables:**
```
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.xxxxx
DB_PASSWORD=your-password
DB_NAME=postgres
DB_SSL=true
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
SESSION_SECRET=your-secret
```

**Important for Cloud:**
- Always use **Connection Pooling** (port `6543`)
- This fixes IPv6 connection issues
- Better for serverless/cloud deployments

---

## 🔍 Finding Your Connection Details - Visual Guide

### In Supabase Dashboard:

```
Settings → Database
├── Connection info
│   ├── Host: db.xxxxx.supabase.co
│   ├── Database name: postgres
│   ├── Port: 5432 (direct) or 6543 (pooling)
│   └── User: postgres
│
├── Connection string
│   └── URI: postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
│
└── Connection pooling
    └── Connection string: postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## 🛠️ Troubleshooting

### Problem: "Connection refused" or "Cannot connect"

**Solutions:**
1. **Check your password:**
   - Make sure you're using the correct database password
   - Not your Supabase account password
   - The one you set when creating the project

2. **Check project status:**
   - Free tier projects pause after inactivity
   - Go to Supabase dashboard and make sure project is active
   - If paused, click "Restore" or "Resume"

3. **Verify connection details:**
   - Double-check host, port, user, and database name
   - Make sure there are no extra spaces in `.env` file

4. **Check network restrictions:**
   - Supabase → Settings → Database → Network Restrictions
   - Make sure it allows connections (or add your IP if restricted)

### Problem: "ENETUNREACH" or IPv6 error

**Solution:**
- Use **Connection Pooling** (port `6543`) instead of direct connection
- Update `DB_PORT` to `6543` in your `.env`
- Or use `DATABASE_URL` with pooling connection string

### Problem: "Authentication failed"

**Solutions:**
1. Verify your password is correct
2. Make sure you're using the database password, not account password
3. Check if password has special characters that need URL encoding
4. Try resetting the database password in Supabase settings

### Problem: "Database does not exist"

**Solution:**
- The database name should be `postgres` (default)
- Don't change it unless you created a custom database

### Problem: Tables not created

**Solution:**
1. Make sure connection is working (check console for "Database connected")
2. Run `node setup-db.js` again
3. Check Supabase Table Editor to see if tables exist
4. If tables exist but empty, that's normal - you haven't added data yet

---

## 📊 Verify Connection in Supabase

### Method 1: Table Editor
1. Supabase Dashboard → **Table Editor**
2. You should see `leads` table
3. Click on it to view data

### Method 2: SQL Editor
1. Supabase Dashboard → **SQL Editor**
2. Run query:
   ```sql
   SELECT * FROM leads;
   ```
3. Should return your leads (or empty if none yet)

### Method 3: Database Connection Test
1. Supabase Dashboard → **Settings** → **Database**
2. Scroll to **Connection string**
3. Test the connection string in a PostgreSQL client

---

## 🔐 Security Best Practices

1. **Never commit `.env` file:**
   - Already in `.gitignore` ✅
   - Don't share your database password

2. **Use strong passwords:**
   - Database password should be complex
   - Admin password should be different from database password

3. **Use Connection Pooling for production:**
   - Better performance
   - Handles connection issues better
   - Required for cloud deployments

4. **Rotate passwords regularly:**
   - Change database password periodically
   - Update in `.env` and deployment platform

---

## 📝 Quick Reference

### Connection String Format

**Direct Connection:**
```
postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

**Connection Pooling (Recommended):**
```
postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Environment Variables Template

```env
# Option 1: Connection String
DATABASE_URL=postgresql://postgres.xxxxx:password@pooler.supabase.com:6543/postgres?pgbouncer=true

# Option 2: Individual Variables
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.xxxxx
DB_PASSWORD=your-password
DB_NAME=postgres
DB_SSL=true

# App Settings
PORT=3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
SESSION_SECRET=random-secret
```

---

## 🎯 Next Steps

After connecting:

1. ✅ Test local connection
2. ✅ Create database tables (`node setup-db.js`)
3. ✅ Test the application
4. ✅ Deploy to Render/cloud (see `DEPLOYMENT_GUIDE.md`)
5. ✅ Set up environment variables in deployment platform

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)

---

**Need Help?** Check the troubleshooting section above or review your connection details in Supabase dashboard.

