const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: {rejectUnauthorized: false}
});

pool.on('connect', () => {
  console.log('Terhubung ke Database PostgreSQL (Supabase)');
});

pool.on('error', (err) => {
  console.error('Error PostgreSQL:', err);
});

module.exports = pool;