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

// Build connection configuration (same as db.js)
function buildConnectionConfig() {
  // If DATABASE_URL is provided, use it
  if (process.env.DATABASE_URL) {
    const config = {
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idle_timeout: 20,
      connect_timeout: 30,
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
    connect_timeout: 30,
  };

  // Add SSL for cloud databases (not localhost)
  if (!isLocalhost()) {
    if (isSupabaseConnection() || process.env.DB_SSL !== 'false') {
      config.ssl = { rejectUnauthorized: false };
    }
  }

  return config;
}

async function setupDatabase() {
  const connectionConfig = buildConnectionConfig();
  
  console.log('Connecting to database...');
  console.log('Host:', connectionConfig.host || 'from DATABASE_URL');
  console.log('Port:', connectionConfig.port || 'from DATABASE_URL');
  console.log('Database:', connectionConfig.database || 'from DATABASE_URL');
  console.log('User:', connectionConfig.user || 'from DATABASE_URL');
  console.log('SSL:', connectionConfig.ssl ? 'enabled' : 'disabled');
  console.log('');

  const sql = postgres(connectionConfig);

  try {
    // Test connection first
    console.log('Testing connection...');
    await sql`SELECT 1 as test`;
    console.log('✅ Connection successful!\n');
    
    console.log('Creating tables and indexes...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(200) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(200),
        source VARCHAR(100),
        message TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'New' CHECK (status IN ('New','Contacted','Qualified','Won','Lost')),
        utm_source VARCHAR(100),
        utm_medium VARCHAR(100),
        utm_campaign VARCHAR(200),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_status ON leads(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_created_at ON leads(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_email ON leads(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_utm_source ON leads(utm_source)`;

    console.log('✅ Database setup completed successfully!');
    console.log('\n📊 Tables created:');
    console.log('   - leads (with indexes)');
    await sql.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error setting up database:');
    console.error('   Error:', err.message);
    console.error('   Code:', err.code || 'N/A');
    
    if (err.message.includes('SASL') || err.message.includes('authentication') || err.code === '28P01') {
      console.error('\n🔐 Authentication Failed!');
      console.error('\n💡 Common causes:');
      console.error('   1. Wrong password in .env file');
      console.error('   2. Wrong username format');
      console.error('      → For Supabase pooling: use postgres.xxxxx (not just postgres)');
      console.error('      → For direct: use postgres');
      console.error('   3. Using wrong connection method');
      console.error('\n📝 Solutions:');
      console.error('   1. Check your .env file credentials');
      console.error('   2. For Supabase, use Connection Pooling URL:');
      console.error('      DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true');
      console.error('   3. Or update individual variables:');
      console.error('      DB_HOST=aws-0-us-east-1.pooler.supabase.com');
      console.error('      DB_PORT=6543');
      console.error('      DB_USER=postgres.xxxxx (with project ref)');
      console.error('      DB_PASSWORD=your-password');
      console.error('      DB_SSL=true');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('\n🔌 Connection Refused!');
      console.error('   1. Check if Supabase project is ACTIVE (not paused)');
      console.error('   2. Verify host and port are correct');
      console.error('   3. Try connection pooling (port 6543)');
    }
    
    await sql.end();
    process.exit(1);
  }
}

setupDatabase();
