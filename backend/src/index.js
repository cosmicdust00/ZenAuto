const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectMongoDB = require('./config/mongodb');
const { pool } = require('./config/supabase');

const app = express();

connectMongoDB();

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Gagal query awal Supabase:', err);
  else console.log('Supabase bisa digunakan pada:', res.rows[0].now);
});

app.use(cors());
app.use(express.json());

// Borrower
app.use('/api/borrower', require('./routes/borrower.routes'));

// Lender
app.use('/api/lender', require('./routes/lender.routes'));

// Upload
app.use('/api/uploads', require('./routes/upload.routes'));

// Telemetry
app.use('/api/telemetry', require('./routes/telemetry.routes'));

// FAQ
app.use('/api/faqs', require('./routes/faq.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server terkoneksi di port ${PORT}`);
});