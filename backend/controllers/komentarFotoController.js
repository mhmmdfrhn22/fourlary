const db = require('../config/db');

// GET semua komentar
exports.getAllKomentar = (req, res) => {
  const sql = `
    SELECT kf.*, u.username, f.url_foto, f.deskripsi AS nama_foto
    FROM komentar_foto kf
    LEFT JOIN user u ON kf.id_user = u.id
    LEFT JOIN foto_galeri f ON kf.id_foto = f.id_foto
    ORDER BY kf.tanggal_komentar DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

// GET komentar berdasarkan foto
exports.getKomentarByFoto = (req, res) => {
  const { id_foto } = req.params;
  const sql = `
    SELECT kf.*, u.username
    FROM komentar_foto kf
    LEFT JOIN user u ON kf.id_user = u.id
    WHERE kf.id_foto = ?
    ORDER BY kf.tanggal_komentar DESC
  `;

  db.query(sql, [id_foto], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

// ADD komentar
exports.createKomentar = (req, res) => {
  const { id_foto, id_user, isi_komentar } = req.body;

  // Validasi data
  if (!id_foto || !id_user || !isi_komentar) {
    return res.status(400).json({ message: 'Semua data harus diisi' });
  }

  const sql = 'INSERT INTO komentar_foto (id_foto, id_user, isi_komentar) VALUES (?, ?, ?)';
  db.query(sql, [id_foto, id_user, isi_komentar], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({
      message: 'Komentar berhasil ditambahkan',
      id: result.insertId
    });
  });
};

// DELETE komentar
exports.deleteKomentar = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM komentar_foto WHERE id_komentar = ?';

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Komentar tidak ditemukan' });
    }
    res.json({ message: 'Komentar berhasil dihapus' });
  });
};
