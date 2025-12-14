const postgres = require('postgres');
require('dotenv').config();

async function setupDatabase() {
  // For Supabase, the database is already provided (typically "postgres")
  // We just need to create tables in the existing database
  const sql = postgres({
    host: process.env.DB_HOST || 'db.tvtoxszukvdzteflzuaz.supabase.co',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Techsun@1532',
    database: process.env.DB_NAME || 'postgres', // Supabase uses "postgres" as default database
    port: Number(process.env.DB_PORT || 5432),
  });

  try {
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

    console.log('Database setup completed successfully!');
    await sql.end();
  } catch (err) {
    console.error('Error setting up tables:', err.message);
    await sql.end();
    process.exit(1);
  }
}

setupDatabase();

