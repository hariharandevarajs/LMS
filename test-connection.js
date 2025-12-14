// Quick test script to check database connection
require('dotenv').config();
const postgres = require('postgres');

const isSupabase = process.env.DB_HOST?.includes('supabase') || process.env.DATABASE_URL?.includes('supabase');
const isLocalhost = process.env.DB_HOST?.includes('localhost') || !process.env.DB_HOST;

let connectionConfig;

if (process.env.DATABASE_URL) {
  connectionConfig = {
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
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
    ...(!isLocalhost && {
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
    }),
  };
}

console.log('Testing database connection...');
console.log('Config:', {
  host: connectionConfig.host || 'from DATABASE_URL',
  port: connectionConfig.port || 'from DATABASE_URL',
  database: connectionConfig.database || 'from DATABASE_URL',
  user: connectionConfig.user || 'from DATABASE_URL',
  ssl: connectionConfig.ssl ? 'enabled' : 'disabled',
});

const sql = postgres(connectionConfig);

sql`SELECT 1 as test, version() as pg_version`
  .then((result) => {
    console.log('\n✅ Connection successful!');
    console.log('PostgreSQL version:', result[0].pg_version);
    sql.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Connection failed!');
    console.error('Error:', err.message);
    console.error('Code:', err.code);
    console.error('\nTroubleshooting:');
    console.error('1. Check if Supabase project is active');
    console.error('2. Verify credentials in .env');
    console.error('3. Try connection pooling port 6543');
    sql.end();
    process.exit(1);
  });

