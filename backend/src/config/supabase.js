const { createClient } = require("@supabase/supabase-js");
const { Pool } = require("pg");
require("dotenv").config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
);

const pool = new Pool({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
});

pool.on("connect", () => {
    console.log("Terhubung ke Database PostgreSQL (Supabase)");
});

pool.on("error", (err) => {
    console.error("Error PostgreSQL:", err);
});

module.exports = { supabase, pool };

