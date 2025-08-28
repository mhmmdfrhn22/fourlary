const db = require('../config/db');

exports.getAllAhli = (req, res) => {
  db.query('SELECT * FROM pembinat_ahli', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createAhli = (req, res) => {
  const { lore_id, nama, kontak_whatsapp, deskripsi } = req.body;
  db.query(
    'INSERT INTO pembinat_ahli (lore_id, nama, kontak_whatsapp, deskripsi) VALUES (?, ?, ?, ?)',
    [lore_id, nama, kontak_whatsapp, deskripsi],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: results.insertId, lore_id, nama, kontak_whatsapp, deskripsi });
    }
  );
};

exports.getAhliById = (req, res) => {
  db.query('SELECT * FROM pembinat_ahli WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ error: 'Ahli not found' });
    res.json(results[0]);
  });
};

exports.updateAhli = (req, res) => {
  const { lore_id, nama, kontak_whatsapp, deskripsi } = req.body;
  db.query(
    'UPDATE pembinat_ahli SET lore_id = ?, nama = ?, kontak_whatsapp = ?, deskripsi = ? WHERE id = ?',
    [lore_id, nama, kontak_whatsapp, deskripsi, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Ahli updated' });
    }
  );
};

exports.deleteAhli = (req, res) => {
  db.query('DELETE FROM pembinat_ahli WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Ahli deleted' });
  });
};
