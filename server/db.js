const postgres = require('postgres');
require('dotenv').config();

// Helper function to detect if this is a Supabase connection
function isSupabaseConnection() {
  const host = process.env.DB_HOST || '';
  const url = process.env.DATABASE_URL || '';
  return host.includes('supabase') || url.includes('supabase') || url.includes('pooler.supabase');
}

// Helper function to detect if this is localhost
function isLocalhost() {
  const host = process.env.DB_HOST || '';
  return host.includes('localhost') || host === '' || host === '127.0.0.1';
}

// Build connection configuration
function buildConnectionConfig() {
  // If DATABASE_URL is provided, use it
  if (process.env.DATABASE_URL) {
    const config = {
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idle_timeout: 20,
      connect_timeout: 30, // Increased timeout for cloud connections
    };

    // Add SSL for Supabase connections
    if (isSupabaseConnection()) {
      config.ssl = { rejectUnauthorized: false };
    }

    return config;
  }

  // Otherwise, use individual parameters
  const config = {
    host: process.env.DB_HOST || 'aws-1-ap-northeast-2.pooler.supabase.com',
    user: process.env.DB_USER || 'postgres.twnhkybojaosfbrurrek',
    password: process.env.DB_PASSWORD || 'Harideva45%',
    database: process.env.DB_NAME || 'postgres',
    port: Number(process.env.DB_PORT || 6543),
    max: 10,
    idle_timeout: 20,
    connect_timeout: 30, // Increased timeout
  };

  // Add SSL for cloud databases (not localhost)
  if (!isLocalhost()) {
    // SSL is required for Supabase, optional for others
    if (isSupabaseConnection() || process.env.DB_SSL !== 'false') {
      config.ssl = { rejectUnauthorized: false };
    }
  }

  return config;
}

// Create connection configuration
const connectionConfig = buildConnectionConfig();

// Create postgres connection
// Note: postgres creates a connection pool, actual connection happens on first query
const sql = postgres(connectionConfig);

// Test connection asynchronously (don't block app startup)
// This runs in the background and won't crash the app if it fails
setTimeout(async () => {
  try {
    await sql`SELECT 1 as test`;
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Database connection error:');
    console.error('   Error:', err.message);
    console.error('   Code:', err.code || 'N/A');
    
    // Provide helpful troubleshooting
    console.error('\n💡 Troubleshooting Steps:');
    console.error('   1. Check if Supabase project is ACTIVE (not paused)');
    console.error('      → Go to supabase.com and restore project if paused');
    console.error('   2. Verify credentials in .env file');
    console.error('   3. Try using Connection Pooling (port 6543)');
    console.error('      → Get pooling URL from Supabase Dashboard → Settings → Database');
    console.error('   4. Check network restrictions in Supabase settings');
    
    if (isSupabaseConnection()) {
      console.error('\n📝 For Supabase, use Connection Pooling URL:');
      console.error('   DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true');
    }
  }
}, 1000); // Wait 1 second before testing to allow app to start

// Export the connection (routes use it as 'pool')
module.exports = sql;
