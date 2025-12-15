# ✅ Correct Supabase Connection Setup

Based on your Supabase dashboard, here's the **correct** connection format:

## 📝 Connection String from Supabase

```
postgresql://postgres:[YOUR_PASSWORD]@db.twnhkybojaosfbrurrek.supabase.co:5432/postgres
```

## 🔧 Update Your .env File

Replace your current database connection with this:

```env
# Direct Connection (Port 5432) - As shown in Supabase Dashboard
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD_HERE@db.twnhkybojaosfbrurrek.supabase.co:5432/postgres

# Individual Variables (Alternative)
DB_HOST=db.twnhkybojaosfbrurrek.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD_HERE
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

## ⚠️ Important: Replace YOUR_PASSWORD_HERE

**You MUST replace `YOUR_PASSWORD_HERE` with your actual Supabase database password!**

To find your password:
1. Go to [supabase.com](https://supabase.com)
2. Login and select your project
3. Go to **Settings** → **Database**
4. Look for **"Database password"** - this is the password you set when creating the project
5. If you forgot it, you can reset it in the same settings page

## 🚀 After Updating .env

1. **Test connection:**
   ```bash
   node test-connection.js
   ```

2. **Setup database tables:**
   ```bash
   node setup-db.js
   ```

3. **Start server:**
   ```bash
   npm start
   ```

## ✅ What's Correct

- ✅ Host: `db.twnhkybojaosfbrurrek.supabase.co`
- ✅ Port: `5432` (Direct connection)
- ✅ User: `postgres` (NOT `postgres.xxxxx` for direct connection)
- ✅ Database: `postgres`
- ✅ SSL: `true` (required for Supabase)

## 🔍 Current Issue

The error "password authentication failed" means:
- ✅ Connection is working (reaching Supabase)
- ❌ Password is incorrect

**Solution:** Update the password in your `.env` file with the correct one from Supabase settings.

