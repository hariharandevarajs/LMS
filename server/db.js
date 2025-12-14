const postgres = require('postgres');
require('dotenv').config();

// Use connection string if provided, otherwise use individual parameters
const isSupabase = process.env.DB_HOST?.includes('supabase') || process.env.DATABASE_URL?.includes('supabase');
const isLocalhost = process.env.DB_HOST?.includes('localhost') || !process.env.DB_HOST;

let connectionConfig;

if (process.env.DATABASE_URL) {
  // Parse DATABASE_URL and add SSL if needed
  connectionConfig = {
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    // Add SSL for Supabase connections
    ...(isSupabase && {
      ssl: { rejectUnauthorized: false },
    }),
  };
} else {
  connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
    port: Number(process.env.DB_PORT || 5432),
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    // Add SSL for Supabase and other cloud databases (not localhost)
    ...(!isLocalhost && {
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
    }),
  };
}

const sql = postgres(connectionConfig);

// Test connection on startup
sql`SELECT 1`
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((err) => {
    console.error('❌ Database connection error:');
    console.error('Error message:', err.message);
    console.error('Error code:', err.code);
    console.error('Error details:', {
      host: process.env.DB_HOST || 'from DATABASE_URL',
      port: process.env.DB_PORT || 'from DATABASE_URL',
      database: process.env.DB_NAME || 'from DATABASE_URL',
      user: process.env.DB_USER || 'from DATABASE_URL',
    });
    console.error('\n💡 Troubleshooting:');
    console.error('1. Check if Supabase project is active (not paused)');
    console.error('2. Verify database credentials in .env file');
    console.error('3. For Supabase, try using connection pooling (port 6543)');
    console.error('4. Make sure DB_SSL=true is set for Supabase');
  });

module.exports = sql;



