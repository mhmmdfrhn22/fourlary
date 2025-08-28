const db = require('../config/db');

exports.getAllKategori = (req, res) => {
  db.query('SELECT * FROM kategori', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createKategori = (req, res) => {
  const { judul } = req.body;
  db.query('INSERT INTO kategori (judul) VALUES (?)', [judul], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: results.insertId, judul });
  });
};

exports.getKategoriById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM kategori WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ error: 'Kategori not found' });
    res.json(results[0]);
  });
};

exports.updateKategori = (req, res) => {
  const { id } = req.params;
  const { judul } = req.body;
  db.query('UPDATE kategori SET judul = ? WHERE id = ?', [judul, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Kategori updated' });
  });
};

exports.deleteKategori = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM kategori WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Kategori deleted' });
  });
};
