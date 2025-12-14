# Simple Guide - How to Run the Lead Management App

A step-by-step guide to get your Lead Management System up and running.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL Database** - Either:
  - Local PostgreSQL installation, OR
  - A Supabase account (free tier available) - [Sign up here](https://supabase.com/)

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will install all required packages (Express, PostgreSQL driver, etc.)

### Step 2: Set Up Your Database

#### Option A: Using Supabase (Recommended for Beginners)

**📖 For detailed step-by-step instructions, see [SUPABASE_CONNECTION_GUIDE.md](SUPABASE_CONNECTION_GUIDE.md)**

Quick steps:
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (set a strong database password!)
3. Go to **Settings** → **Database**
4. Copy your connection details:
   - **For Connection Pooling (Recommended):** Use the pooling connection string (port `6543`)
   - **For Direct Connection:** Host (looks like: `db.xxxxx.supabase.co`), Port `5432`
   - Database name: `postgres`
   - User: `postgres`
   - Password: The one you set when creating the project

#### Option B: Using Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
   ```bash
   psql -U postgres
   CREATE DATABASE lms;
   \q
   ```

### Step 3: Create Environment Variables File

Create a file named `.env` in the root directory of your project with the following content:

```env
# Server Configuration
PORT=3000

# Database Configuration (Supabase)
DB_HOST=db.your-project.supabase.co
DB_USER=postgres
DB_PASSWORD=your-password-here
DB_NAME=postgres
DB_PORT=5432

# Admin Login Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me-to-secure-password

# Session Secret (generate a random string)
SESSION_SECRET=your-random-secret-key-here
```

**Important:** Replace all placeholder values with your actual credentials!

**To generate a secure SESSION_SECRET**, you can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Set Up Database Tables

Run the setup script to create the necessary tables:

```bash
node setup-db.js
```

You should see:
```
Creating tables and indexes...
Database setup completed successfully!
```

### Step 5: Start the Server

#### Development Mode (with auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

You should see:
```
Server listening on http://localhost:3000
```

### Step 6: Access the Application

Open your web browser and visit:

- **Landing Page (Lead Form):** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/dashboard
- **Login Page:** http://localhost:3000/login
- **Health Check:** http://localhost:3000/health

## 🔐 First Time Login

1. Go to http://localhost:3000/login
2. Use the credentials from your `.env` file:
   - Email: `admin@example.com` (or whatever you set)
   - Password: `change-me-to-secure-password` (or whatever you set)

## 📝 Common Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start server in development mode (auto-reload) |
| `npm start` | Start server in production mode |
| `node setup-db.js` | Set up database tables (run once) |

## 🛠️ Troubleshooting

### Problem: "Database does not exist"
**Solution:** Make sure you've run `node setup-db.js` to create the tables.

### Problem: "Connection refused" or "Cannot connect to database"
**Solution:** 
- Check your `.env` file has correct database credentials
- For Supabase: Make sure your project is active and not paused
- For local PostgreSQL: Make sure PostgreSQL service is running

### Problem: "Port 3000 already in use"
**Solution:** 
- Change `PORT=3000` to another port (e.g., `PORT=3001`) in your `.env` file
- Or stop the other application using port 3000

### Problem: "Module not found"
**Solution:** Run `npm install` again to ensure all dependencies are installed.

### Problem: "Authentication failed"
**Solution:** 
- Double-check your database password in `.env`
- For Supabase: Make sure you're using the correct password from Settings → Database

## 📁 Project Structure

```
lms/
├── server/
│   ├── app.js          # Main server file
│   ├── db.js           # Database connection
│   ├── routes/         # API routes
│   ├── views/          # HTML templates
│   └── public/         # Static files (CSS, JS)
├── .env                # Environment variables (create this)
├── setup-db.js         # Database setup script
├── package.json        # Dependencies
└── README.md           # Full documentation
```

## 🎯 What's Next?

Once your app is running:

1. **Test the Lead Form:** Submit a test lead from the landing page
2. **View in Dashboard:** Login and see your leads in the dashboard
3. **Track Campaigns:** Add UTM parameters to URLs to track campaign sources
4. **Customize:** Modify the styling in `server/public/css/styles.css`

## 📚 Additional Features

### Campaign Tracking with UTM Parameters

Add UTM parameters to your URLs to track where leads come from:

```
http://localhost:3000/contact?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale
```

The app automatically categorizes:
- `google` → Google Ads
- `meta` or `facebook` → Meta/Facebook Ads
- No UTM params → Organic

### Optional: Google Images API

To enable product image fetching:

1. Get a Google API key from Google Cloud Console
2. Create a Programmable Search Engine
3. Add to `.env`:
   ```
   GOOGLE_API_KEY=your-api-key
   GOOGLE_CSE_ID=your-search-engine-id
   ```

## 💡 Tips

- Keep your `.env` file secure and never commit it to version control
- Use a strong `SESSION_SECRET` for production
- Change the default admin password immediately
- The app uses PostgreSQL, so make sure your database is PostgreSQL-compatible

## 🆘 Need Help?

- Check the `README.md` for more detailed documentation
- Review error messages in the terminal for specific issues
- Make sure all environment variables are set correctly

---

**Happy coding! 🚀**

