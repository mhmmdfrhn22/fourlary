const db = require('../config/db');

// GET semua kategori
exports.getAllKategori = (req, res) => {
  db.query('SELECT * FROM kategori_foto ORDER BY tanggal_dibuat DESC', (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

// GET kategori by ID
exports.getKategoriById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM kategori_foto WHERE id_kategori = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    res.json(result[0]);
  });
};

// CREATE kategori baru
exports.createKategori = (req, res) => {
  const { nama_kategori, dibuat_oleh } = req.body;
  db.query('INSERT INTO kategori_foto (nama_kategori, dibuat_oleh) VALUES (?, ?)', [nama_kategori, dibuat_oleh], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ message: 'Kategori berhasil dibuat', id: result.insertId });
  });
};

// UPDATE kategori
exports.updateKategori = (req, res) => {
  const { id } = req.params;
  const { nama_kategori } = req.body;
  db.query('UPDATE kategori_foto SET nama_kategori = ? WHERE id_kategori = ?', [nama_kategori, id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Kategori berhasil diperbarui' });
  });
};

// DELETE kategori
exports.deleteKategori = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM kategori_foto WHERE id_kategori = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Kategori berhasil dihapus' });
  });
};