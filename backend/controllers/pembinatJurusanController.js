const db = require('../config/db');

exports.getAllJurusan = (req, res) => {
  db.query('SELECT * FROM pembinat_jurusan', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createJurusan = (req, res) => {
  const { nama_jurusan, deskripsi } = req.body;
  db.query(
    'INSERT INTO pembinat_jurusan (nama_jurusan, deskripsi) VALUES (?, ?)',
    [nama_jurusan, deskripsi],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: results.insertId, nama_jurusan, deskripsi });
    }
  );
};

exports.getJurusanById = (req, res) => {
  db.query('SELECT * FROM pembinat_jurusan WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ error: 'Jurusan not found' });
    res.json(results[0]);
  });
};

exports.updateJurusan = (req, res) => {
  const { nama_jurusan, deskripsi } = req.body;
  db.query(
    'UPDATE pembinat_jurusan SET nama_jurusan = ?, deskripsi = ? WHERE id = ?',
    [nama_jurusan, deskripsi, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Jurusan updated' });
    }
  );
};

exports.deleteJurusan = (req, res) => {
  db.query('DELETE FROM pembinat_jurusan WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Jurusan deleted' });
  });
};
