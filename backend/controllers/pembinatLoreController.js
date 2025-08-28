const db = require('../config/db');

exports.getAllLore = (req, res) => {
  db.query('SELECT * FROM pembinat_lore', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createLore = (req, res) => {
  const { jurusan_id, nama_lore, deskripsi, jobdesk } = req.body;
  db.query(
    'INSERT INTO pembinat_lore (jurusan_id, nama_lore, deskripsi, jobdesk) VALUES (?, ?, ?, ?)',
    [jurusan_id, nama_lore, deskripsi, jobdesk],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: results.insertId, jurusan_id, nama_lore, deskripsi, jobdesk });
    }
  );
};

exports.getLoreById = (req, res) => {
  db.query('SELECT * FROM pembinat_lore WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ error: 'Lore not found' });
    res.json(results[0]);
  });
};

exports.updateLore = (req, res) => {
  const { jurusan_id, nama_lore, deskripsi, jobdesk } = req.body;
  db.query(
    'UPDATE pembinat_lore SET jurusan_id = ?, nama_lore = ?, deskripsi = ?, jobdesk = ? WHERE id = ?',
    [jurusan_id, nama_lore, deskripsi, jobdesk, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Lore updated' });
    }
  );
};

exports.deleteLore = (req, res) => {
  db.query('DELETE FROM pembinat_lore WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Lore deleted' });
  });
};
