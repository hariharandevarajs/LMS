# 🔧 Fix Database Connection - Step by Step

## Issue: ECONNREFUSED - Connection Refused

This means your app can't connect to Supabase. Here's how to fix it:

---

## ✅ Solution 1: Check if Supabase Project is Active (Do This First!)

**This is the #1 cause of connection errors!**

1. Go to [supabase.com](https://supabase.com) and **login**
2. Check your project list
3. **If you see "Paused" or "Inactive":**
   - Click on your project
   - Click **"Restore"** or **"Resume"** button
   - ⏳ Wait 1-2 minutes for project to activate
4. **If project is active**, proceed to Solution 2

---

## ✅ Solution 2: Use Connection Pooling (Recommended)

Connection pooling is more reliable and fixes most connection issues.

### Step 1: Get Connection Pooling URL

1. Go to **Supabase Dashboard**
2. Click on your project
3. Go to **Settings** (gear icon) → **Database**
4. Scroll down to **"Connection Pooling"** section
5. You'll see a connection string like:
   ```
   postgresql://postgres.twnhkybojaosfbrurrek:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. **Copy this connection string**
7. Replace `[YOUR-PASSWORD]` with your actual password: `harideva`

### Step 2: Update Your .env File

Open your `.env` file and **replace** the `DATABASE_URL` line with:

```env
# Connection Pooling (Port 6543 - More Reliable)
DATABASE_URL=postgresql://postgres.twnhkybojaosfbrurrek:harideva@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Keep all other variables
PORT=3000
DB_HOST=db.twnhkybojaosfbrurrek.supabase.co
DB_USER=postgres
DB_PASSWORD=harideva
DB_NAME=postgres
DB_PORT=5432
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=123456
GOOGLE_API_KEY=AIzaSyBmFy180k-OZv_-ylPyifNWqmojUKQpFpg
GOOGLE_CSE_ID=747adcec126324a50
```

**Important:** 
- Use port **6543** (pooling) instead of 5432 (direct)
- The host should be `pooler.supabase.com`, not `db.xxxxx.supabase.co`
- Add `?pgbouncer=true` at the end

### Step 3: Test Connection

```bash
node test-connection.js
```

You should see: `✅ Connection successful!`

---

## ✅ Solution 3: If You Don't Have Pooling URL

If you can't find the pooling URL, try updating individual variables:

### Update .env with Pooling Port:

```env
# Remove or comment out DATABASE_URL
# DATABASE_URL=...

# Use individual variables with pooling
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.twnhkybojaosfbrurrek
DB_PASSWORD=harideva
DB_NAME=postgres
DB_SSL=true

# Other settings
PORT=3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=123456
SESSION_SECRET=your-secret-here
GOOGLE_API_KEY=AIzaSyBmFy180k-OZv_-ylPyifNWqmojUKQpFpg
GOOGLE_CSE_ID=747adcec126324a50
```

**Note:** The pooler hostname format is: `aws-0-[region].pooler.supabase.com`
- Replace `[region]` with your region (e.g., `us-east-1`, `eu-west-1`)

---

## ✅ Solution 4: Check Network Restrictions

1. Go to Supabase Dashboard → **Settings** → **Database**
2. Scroll to **"Network Restrictions"**
3. Make sure it's set to **"Allow all"** or add your IP address
4. If restricted, temporarily allow all connections for testing

---

## 🧪 Test After Fix

1. **Test connection:**
   ```bash
   node test-connection.js
   ```

2. **Start server:**
   ```bash
   npm start
   ```

3. **Check console** - should see:
   ```
   ✅ Database connected successfully
   Server listening on port 3000
   ```

---

## 📋 Complete .env Template (Working)

Here's a complete working `.env` template:

```env
# Database Connection (Connection Pooling - Recommended)
DATABASE_URL=postgresql://postgres.twnhkybojaosfbrurrek:harideva@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Server
PORT=3000

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=123456

# Session Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
SESSION_SECRET=your-random-secret-here

# Google API (Optional)
GOOGLE_API_KEY=AIzaSyBmFy180k-OZv_-ylPyifNWqmojUKQpFpg
GOOGLE_CSE_ID=747adcec126324a50
```

---

## 🆘 Still Not Working?

1. **Verify Supabase project is active** (not paused)
2. **Double-check password** in Supabase settings
3. **Try direct connection** (port 5432) if pooling doesn't work
4. **Check Supabase status:** [status.supabase.com](https://status.supabase.com)
5. **Contact Supabase support** if issue persists

---

## 🎯 Quick Checklist

- [ ] Supabase project is active (not paused)
- [ ] Using connection pooling (port 6543)
- [ ] Password is correct in connection string
- [ ] Network restrictions allow connections
- [ ] SSL is enabled (automatic with our code)

**Most likely fix:** Restore your Supabase project if it's paused, then use connection pooling URL!

