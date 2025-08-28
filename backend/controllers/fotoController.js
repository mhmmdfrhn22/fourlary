const db = require('../config/db');

exports.getAllFoto = (req, res) => {
  db.query('SELECT * FROM foto', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createFoto = (req, res) => {
  const { galery_id, file, judul } = req.body;
  db.query(
    'INSERT INTO foto (galery_id, file, judul) VALUES (?, ?, ?)',
    [galery_id, file, judul],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: results.insertId, galery_id, file, judul });
    }
  );
};

exports.getFotoById = (req, res) => {
  db.query('SELECT * FROM foto WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ error: 'Foto not found' });
    res.json(results);
  });
};

exports.updateFoto = (req, res) => {
  const { galery_id, file, judul } = req.body;
  db.query(
    'UPDATE foto SET galery_id = ?, file = ?, judul = ? WHERE id = ?',
    [galery_id, file, judul, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Foto updated' });
    }
  );
};

exports.deleteFoto = (req, res) => {
  db.query('DELETE FROM foto WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Foto deleted' });
  });
};
