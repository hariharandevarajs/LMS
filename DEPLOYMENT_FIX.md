# 🔧 Fix: Database Connection Error on Render

## Problem
Error: `ENETUNREACH` - Cannot connect to Supabase database from Render.

## ✅ Solution 1: Use Supabase Connection Pooling (Recommended)

Supabase provides a special connection string for serverless/cloud deployments that handles IPv6/IPv4 issues.

### Step 1: Get Connection Pooling URL from Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Scroll down to **Connection Pooling**
4. Copy the **Connection String** (it looks like: `postgresql://postgres.xxxxx:5432/postgres`)
5. **Important:** Use the **Pooling** connection string, NOT the direct connection string

### Step 2: Update Environment Variables in Render

In your Render dashboard, go to **Environment** tab and:

**Option A: Use Connection String (Easiest)**
```
DATABASE_URL=postgresql://postgres.xxxxx:5432/postgres?pgbouncer=true
```

**Option B: Or Update Individual Variables**
Make sure you're using the **pooling host** (ends with `.supabase.co`, not direct IP):
```
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.xxxxx
DB_PASSWORD=your-password
DB_NAME=postgres
DB_SSL=true
```

**Note:** 
- Port `6543` is for connection pooling (use this instead of `5432`)
- Port `5432` is for direct connections (may have IPv6 issues)
- The host should be a pooler URL, not a direct IP

---

## ✅ Solution 2: Use Direct Connection with IPv4

If you must use direct connection:

1. In Supabase dashboard, go to **Settings** → **Database**
2. Find **Connection string** → **Direct connection**
3. Use the IPv4 address or hostname
4. Make sure to use port `5432` for direct connections

---

## ✅ Solution 3: Update Supabase Network Settings

1. Go to Supabase Dashboard → **Settings** → **Database**
2. Check **Network Restrictions**
3. Make sure it's set to allow connections from anywhere, OR
4. Add Render's IP ranges (if using IP restrictions)

---

## 🔍 Verify Your Current Settings

Check your Render environment variables:

1. Go to Render Dashboard → Your Service → **Environment**
2. Verify these variables:

```
DB_HOST=db.xxxxx.supabase.co  (should be hostname, not IP)
DB_PORT=6543  (for pooling) or 5432 (for direct)
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=postgres
```

---

## 🚀 Quick Fix Steps

### Method 1: Use Connection Pooling (Best for Render)

1. **Get pooling URL from Supabase:**
   - Supabase Dashboard → Settings → Database → Connection Pooling
   - Copy the connection string

2. **Update Render environment:**
   - Remove individual DB_* variables
   - Add: `DATABASE_URL=postgresql://postgres.xxxxx:6543/postgres`

3. **Redeploy:**
   - Render will auto-redeploy, or click "Manual Deploy"

### Method 2: Fix Individual Variables

1. **Update DB_HOST:**
   - Use pooler hostname: `aws-0-us-east-1.pooler.supabase.com`
   - Or use your project pooler: `db.xxxxx.pooler.supabase.com`

2. **Update DB_PORT:**
   - Change from `5432` to `6543` (pooling port)

3. **Add DB_SSL:**
   - Add: `DB_SSL=true`

4. **Redeploy**

---

## 📝 Updated Environment Variables Template

For **Connection Pooling** (Recommended):
```env
DATABASE_URL=postgresql://postgres.xxxxx:6543/postgres?pgbouncer=true
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
SESSION_SECRET=your-secret
```

OR for **Individual Variables**:
```env
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

---

## 🧪 Test Connection

After updating, check Render logs:
1. Go to Render Dashboard → Your Service → **Logs**
2. Look for: `✅ Database connected successfully`
3. If you see errors, check the error message

---

## ❓ Still Having Issues?

### Check Supabase Status
- Make sure your Supabase project is **active** (not paused)
- Free tier projects pause after inactivity

### Check Render Logs
- Look for specific error messages
- Check if it's a timeout, connection refused, or network unreachable

### Verify Credentials
- Double-check your Supabase password
- Make sure you're using the correct database name (`postgres`)

### Try Direct Connection
If pooling doesn't work, try:
- Use direct connection string from Supabase
- Port `5432`
- Make sure network restrictions allow Render IPs

---

## 🔗 Useful Links

- [Supabase Connection Pooling Docs](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Supabase Network Restrictions](https://supabase.com/docs/guides/database/managing-connections)

---

**Most Common Fix:** Use Supabase Connection Pooling with port `6543` instead of direct connection on port `5432`.

