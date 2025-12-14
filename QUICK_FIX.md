# 🔧 Quick Fix: Database Connection Error

## Current Error
`ECONNREFUSED` - Connection refused to Supabase database

## ✅ Solution Steps

### Step 1: Check if Supabase Project is Active

1. Go to [supabase.com](https://supabase.com) and login
2. Check your project status
3. **If project is paused:**
   - Click on your project
   - Click **"Restore"** or **"Resume"** button
   - Wait 1-2 minutes for project to activate

### Step 2: Update Your .env File

Your current `.env` has both `DATABASE_URL` and individual variables. Let's use the connection pooling URL which is more reliable.

**Option A: Use Connection Pooling (Recommended)**

1. Go to Supabase Dashboard → **Settings** → **Database**
2. Scroll to **"Connection Pooling"** section
3. Copy the connection string (looks like: `postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres`)
4. Update your `.env` file:

```env
# Use connection pooling (port 6543)
DATABASE_URL=postgresql://postgres.twnhkybojaosfbrurrek:harideva@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Or if you prefer individual variables, use pooling port:
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
```

**Option B: Fix Direct Connection**

If you want to use direct connection (port 5432), make sure:
1. Your Supabase project is **active** (not paused)
2. Add `DB_SSL=true` to your `.env`
3. The password doesn't have special characters that need encoding

### Step 3: Test Connection

Run the test script:
```bash
node test-connection.js
```

Or start your server:
```bash
npm start
```

You should see: `✅ Database connected successfully`

### Step 4: If Still Not Working

1. **Check Supabase Network Settings:**
   - Supabase Dashboard → Settings → Database → Network Restrictions
   - Make sure it allows connections (or add your IP)

2. **Try Different Connection Method:**
   - Use connection pooling (port 6543) instead of direct (5432)
   - This fixes most connection issues

3. **Verify Password:**
   - Make sure password is correct
   - If password has special characters, they might need URL encoding in DATABASE_URL

4. **Check Supabase Status:**
   - Visit status.supabase.com to check if there are any outages

## 🎯 Most Common Fix

**Use Connection Pooling:**
- Change port from `5432` to `6543`
- Use pooler hostname: `aws-0-us-east-1.pooler.supabase.com`
- Or use the connection pooling URL from Supabase dashboard

## 📝 Updated .env Template

```env
# Connection Pooling (Recommended)
DATABASE_URL=postgresql://postgres.twnhkybojaosfbrurrek:harideva@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Server
PORT=3000

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=123456

# Session
SESSION_SECRET=generate-with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Google API (optional)
GOOGLE_API_KEY=AIzaSyBmFy180k-OZv_-ylPyifNWqmojUKQpFpg
GOOGLE_CSE_ID=747adcec126324a50
```

**After updating .env, restart your server:**
```bash
npm start
```

