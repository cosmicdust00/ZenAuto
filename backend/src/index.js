const express = require('express');
const dotenv = require('dotenv');
const connectMongoDB = require('./config/mongodb');
const pool = require('./config/supabase');

const app = express();

connectMongoDB();

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Gagal query awal Supabase:', err);
  else console.log('Supabase bisa digunakan pada:', res.rows[0].now);
});

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server terkoneksi di port ${PORT}`);
});