const db = require('../config/db');

// GET jumlah like per foto
exports.getLikeCount = (req, res) => {
  const { id_foto } = req.params;
  db.query('SELECT COUNT(*) AS total_like FROM like_foto WHERE id_foto = ?', [id_foto], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result[0]);
  });
};

// CEK apakah user sudah like
exports.checkUserLike = (req, res) => {
  const { id_foto, id_user } = req.params;
  db.query('SELECT * FROM like_foto WHERE id_foto = ? AND id_user = ?', [id_foto, id_user], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ liked: result.length > 0 });
  });
};

// ADD like
exports.addLike = (req, res) => {
  const { id_foto, id_user } = req.body;
  db.query('INSERT IGNORE INTO like_foto (id_foto, id_user) VALUES (?, ?)', [id_foto, id_user], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ message: 'Foto disukai' });
  });
};

// REMOVE like
exports.removeLike = (req, res) => {
  const { id_foto, id_user } = req.body;
  db.query('DELETE FROM like_foto WHERE id_foto = ? AND id_user = ?', [id_foto, id_user], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Like dihapus' });
  });
};

exports.checkLike = (req, res) => {
  const { id_foto, id_user } = req.query;
  const sql = 'SELECT * FROM like_foto WHERE id_foto = ? AND id_user = ?';
  db.query(sql, [id_foto, id_user], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ liked: result.length > 0 });
  });
};