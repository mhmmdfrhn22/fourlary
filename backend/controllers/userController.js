const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtSecret = process.env.JWT_SECRET || 'rahasia';

exports.createUser = (req, res) => {
  const { username, password, role_id } = req.body;
  // Hash password di sini!
  const hashedPassword = bcrypt.hashSync(password, 8);
  db.query('INSERT INTO user (username, password, role_id) VALUES (?, ?, ?)', [username, hashedPassword, role_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: results.insertId, username, role_id });
  });
};

exports.loginUser = (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(401).json({ error: 'User not found' });
    const user = results[0];

    // Bandingkan password dengan hash dari DB
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Password salah' });
    }
    const token = jwt.sign({ user_id: user.id, role_id: user.role_id }, jwtSecret, { expiresIn: '1d' });
    res.json({user, token });

  });
};

exports.getAllUsers = (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getUserById = (req, res) => {
  db.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  });
};

exports.updateUser = (req, res) => {
  const { username, password, role_id } = req.body;
  db.query('UPDATE user SET username = ?, password = ?, role_id = ? WHERE id = ?', [username, password, role_id, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User updated' });
  });
};

exports.deleteUser = (req, res) => {
  db.query('DELETE FROM user WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User deleted' });
  });
};
