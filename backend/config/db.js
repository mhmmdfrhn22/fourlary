const mysql = require('mysql2');

// Buat koneksi ke database dengan menggunakan environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Coba terhubung ke database dan cetak statusnya
connection.connect(err => {
  if (err) {
    // Jika koneksi gagal, cetak pesan error
    console.error('DB Connection Error:', err);
  } else {
    // Jika koneksi berhasil, cetak pesan sukses
    console.log('Connected to DB');
  }
});

// Ekspor objek koneksi agar bisa digunakan di file lain
module.exports = connection;