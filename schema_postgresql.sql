-- Database schema for Lead Management App (PostgreSQL)
-- Run this to create the database and table

-- Create database (run this separately as superuser if needed)
-- CREATE DATABASE lms;

-- Connect to the database and run the following:

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
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_utm_source ON leads(utm_source);

