const db = require('../config/db');

exports.getAllProfile = (req, res) => {
  db.query('SELECT * FROM profile', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createProfile = (req, res) => {
  const { judul, isi } = req.body;
  db.query(
    'INSERT INTO profile (judul, isi) VALUES (?, ?)',
    [judul, isi],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: results.insertId, judul, isi });
    }
  );
};

exports.getProfileById = (req, res) => {
  db.query('SELECT * FROM profile WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ error: 'Profile not found' });
    res.json(results[0]);
  });
};

exports.updateProfile = (req, res) => {
  const { judul, isi } = req.body;
  db.query(
    'UPDATE profile SET judul = ?, isi = ? WHERE id = ?',
    [judul, isi, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Profile updated' });
    }
  );
};

exports.deleteProfile = (req, res) => {
  db.query('DELETE FROM profile WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Profile deleted' });
  });
};
