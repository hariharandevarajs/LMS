const postgres = require('postgres');
require('dotenv').config();

const sql = postgres({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'postgres', // Supabase uses "postgres" as default database
  port: Number(process.env.DB_PORT || 5432),
  max: 10, // connection pool size
});

module.exports = sql;



