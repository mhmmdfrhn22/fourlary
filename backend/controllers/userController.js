const db = require('../config/db');

exports.getAllUsers = (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createUser = (req, res) => {
  const { username, password, role_id } = req.body;
  db.query('INSERT INTO user (username, password, role_id) VALUES (?, ?, ?)', [username, password, role_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: results.insertId, username, role_id });
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
