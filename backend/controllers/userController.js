const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtSecret = process.env.JWT_SECRET || 'rahasia';

// Fungsi untuk membuat pengguna baru (Register)

exports.createUser = (req, res) => {
  const { username, password, role_id } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  db.query('INSERT INTO user (username, password, role_id) VALUES (?, ?, ?)', [username, hashedPassword, role_id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: 'Terjadi kesalahan server saat mendaftar.' });
    }
    res.status(201).json({ id: results.insertId, username, role_id });
  });
};

// Hitung total tim publikasi (role_id = 3)
exports.getPublikasiTeamCount = (req, res) => {
  db.query('SELECT COUNT(*) AS total FROM user WHERE role_id = 3', (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ total: results[0].total });
  });
};


// Fungsi untuk login pengguna
exports.loginUser = (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: 'Terjadi kesalahan server saat login.' });
    }
    if (!results.length) return res.status(401).json({ error: 'User tidak ditemukan.' });
    const user = results[0];

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Password salah' });
    }

    const token = jwt.sign({ user_id: user.id, role_id: user.role_id }, jwtSecret, { expiresIn: '1d' });
    res.json({ user, token });
  });
};

// Fungsi untuk mengambil semua pengguna
exports.getAllUsers = (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: 'Terjadi kesalahan server saat mengambil data pengguna.' });
    }
    res.json(results);
  });
};

// Fungsi untuk mengambil pengguna berdasarkan ID
exports.getUserById = (req, res) => {
  db.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: 'Terjadi kesalahan server saat mengambil data pengguna.' });
    }
    if (!results.length) return res.status(404).json({ error: 'User tidak ditemukan.' });
    res.json(results[0]);
  });
};

// Fungsi untuk memperbarui pengguna
exports.updateUser = (req, res) => {
  const { username, password, role_id } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  db.query('UPDATE user SET username = ?, password = ?, role_id = ? WHERE id = ?', [username, hashedPassword, role_id, req.params.id], (err) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: 'Terjadi kesalahan server saat memperbarui pengguna.' });
    }
    res.json({ message: 'User berhasil diperbarui' });
  });
};

// Fungsi untuk menghapus pengguna
exports.deleteUser = (req, res) => {
  db.query('DELETE FROM user WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: 'Terjadi kesalahan server saat menghapus pengguna.' });
    }
    res.json({ message: 'User berhasil dihapus' });
  });
};

// Fungsi untuk mengambil user dari token (current user)
exports.getMe = (req, res) => {
  const userId = req.user.user_id; 
  db.query('SELECT id, username, role_id FROM user WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
    if (!results.length) return res.status(404).json({ error: 'User tidak ditemukan.' });
    res.json(results[0]);
  });
};

exports.getUsersCount = (req, res) => {
  db.query('SELECT COUNT(*) AS total FROM user', (err, results) => {
    if (err) {
      console.error('SQL Error:', err); // Debug log
      return res.status(500).json({ error: err.message });
    }

    console.log('Query Results:', results); // Debug log
    res.json({ total: results[0].total });
  });
};

exports.getUserStats = (req, res) => {
  let { range } = req.query;
  if (!range) range = "7d";

  let interval = 7;
  if (range === "14d") interval = 14;
  else if (range === "30d") interval = 30;

  const sql = `
    SELECT DATE(created_at) as date, COUNT(*) as total
    FROM user
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;

  db.query(sql, [interval], (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};