# Lead Management App

Simple landing page to capture leads with an admin dashboard to manage them.

## Stack
- Node.js + Express
- PostgreSQL (using `postgres` package)
- Vanilla HTML/CSS/JS

## Setup
1. Install dependencies:
```bash
npm install
```
2. Configure environment variables by creating a `.env` (example below).
3. Set up database tables:
```bash
node setup-db.js
```
4. Run the server:
```bash
npm run dev
```
Open http://localhost:3000

## .env example
```
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=postgres
DB_PORT=5432
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
SESSION_SECRET=replace-with-strong-secret
```

**Note:** For Supabase, use your Supabase connection details. The database name is typically `postgres`.

## Development
- Static assets served from `/static`
- Landing page at `/`
- Marketing pages: `/home`, `/products`, `/about`, `/contact`
- Admin dashboard: `/dashboard` (requires login)
- Health check at `/health`

## Campaign Tracking (UTM Parameters)

The app automatically tracks campaign sources for leads. When users click on ads, add UTM parameters to your URLs:

### Google Ads Example:
```
http://localhost:3000/contact?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale
```

### Meta/Facebook Ads Example:
```
http://localhost:3000/contact?utm_source=facebook&utm_medium=cpc&utm_campaign=product_launch
```

### How It Works:
- UTM parameters are captured from the URL and stored in sessionStorage
- When a lead form is submitted, the campaign data is saved to the database
- Campaigns are automatically categorized:
  - `google` → Google Ads
  - `meta` or `facebook` or `fb` → Meta/Facebook Ads
  - No UTM params → Organic
- View campaign analytics in the dashboard showing leads by source

### Migration:
If you already have a database, the campaign tracking fields are included in the main schema. Run `node setup-db.js` to set up all tables.

## Optional: Google Images for products
To auto-fetch product images from Google, create a Programmable Search Engine and enable the Custom Search API:
1. In Google Cloud Console, enable "Custom Search API" and create an API key.
2. Create a Programmable Search Engine (programmablesearchengine.google.com), turn on Image Search, and note the Search engine ID (cx).
3. Add to your `.env`:
```
GOOGLE_API_KEY=your-google-api-key
GOOGLE_CSE_ID=your-cse-id
```
The products page will call `/api/images?q=...` to fetch an image URL for each product.


