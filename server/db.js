const postgres = require('postgres');
require('dotenv').config();

// Use connection string if provided, otherwise use individual parameters
const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'postgres',
      port: Number(process.env.DB_PORT || 5432),
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
      // Force IPv4 if hostname resolves to IPv6
      ...(process.env.DB_HOST && !process.env.DB_HOST.includes('localhost') && {
        // Add connection options for cloud databases
        ssl: process.env.DB_SSL !== 'false' ? { rejectUnauthorized: false } : false,
      }),
    };

const sql = postgres(connectionConfig);

// Test connection on startup
sql`SELECT 1`
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
  });

module.exports = sql;



