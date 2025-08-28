const db = require('../config/db');

exports.getAllRoles = (req, res) => {
  db.query('SELECT * FROM role', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createRole = (req, res) => {
  const { nama_role } = req.body;
  db.query('INSERT INTO role (nama_role) VALUES (?)', [nama_role], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: results.insertId, nama_role });
  });
};

exports.getRoleById = (req, res) => {
  db.query('SELECT * FROM role WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ error: "Role not found" });
    res.json(results[0]);
  });
};

exports.updateRole = (req, res) => {
  const { nama_role } = req.body;
  db.query('UPDATE role SET nama_role = ? WHERE id = ?', [nama_role, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Role updated" });
  });
};

exports.deleteRole = (req, res) => {
  db.query('DELETE FROM role WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Role deleted" });
  });
};
