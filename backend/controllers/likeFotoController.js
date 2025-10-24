const db = require('../config/db');

// GET jumlah like per foto
exports.getLikeCount = (req, res) => {
  const { id_foto } = req.params;
  db.query('SELECT COUNT(*) AS total_like FROM like_foto WHERE id_foto = ?', [id_foto], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result[0]);
  });
};

// ✅ Hitung jumlah like dari semua foto milik user tertentu
exports.getLikeCountByUser = (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ message: "user_id wajib diisi" });
  }

  const sql = `
    SELECT COUNT(l.id_like) AS total
    FROM like_foto AS l
    INNER JOIN foto_galeri AS f ON l.id_foto = f.id_foto
    WHERE f.diupload_oleh = ?
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (results.length === 0) {
      return res.json({ total: 0 });
    }

    return res.json({ total: results[0].total });
  });
};

// ✅ Statistik like berdasarkan waktu (per user)
exports.getLikeStats = (req, res) => {
  const userId = req.params.userId;
  let { range } = req.query;
  if (!range) range = "7d";

  let interval = 7;
  if (range === "14d") interval = 14;
  else if (range === "30d") interval = 30;

  const sql = `
    SELECT 
      DATE(l.tanggal_like) AS date, 
      COUNT(l.id_like) AS total
    FROM like_foto l
    JOIN foto_galeri f ON l.id_foto = f.id_foto
    WHERE f.diupload_oleh = ?
      AND l.tanggal_like >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY DATE(l.tanggal_like)
    ORDER BY date ASC
  `;

  db.query(sql, [userId, interval], (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: err.message });
    }

    console.log("📊 Like stats results:", results); // ✅ buat cek hasil di terminal
    res.json(results);
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
