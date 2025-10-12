const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// ✅ Ambil semua post (join kategori + user)
exports.getAllPosts = (req, res) => {
  const sql = `
    SELECT p.id, p.judul, p.isi, p.foto, p.status, p.created_at, p.updated_at,
           k.judul AS kategori, 
           u.username AS penulis
    FROM posts p
    LEFT JOIN kategori k ON p.kategori_id = k.id
    LEFT JOIN user u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ✅ Tambah post baru
exports.createPost = (req, res) => {
  const { judul, kategori_id, isi, user_id, status } = req.body;
  const foto = req.file ? req.file.filename : null;

  if (!judul || !kategori_id || !isi || !user_id) {
    return res
      .status(400)
      .json({ error: 'Judul, kategori, isi, dan user wajib diisi' });
  }

  const finalStatus = (status || 'draft').toLowerCase();

  const sql = `
    INSERT INTO posts (judul, kategori_id, isi, user_id, status, foto) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [judul, kategori_id, isi, user_id, finalStatus, foto],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        id: results.insertId,
        judul,
        kategori_id,
        isi,
        user_id,
        status: finalStatus,
        foto,
        message: 'Post berhasil ditambahkan',
      });
    }
  );
};

// ✅ Ambil detail post by ID
exports.getPostById = (req, res) => {
  const sql = `
    SELECT p.id, p.judul, p.isi, p.foto, p.status, p.created_at, p.updated_at,
           k.judul AS kategori, 
           u.username AS penulis
    FROM posts p
    LEFT JOIN kategori k ON p.kategori_id = k.id
    LEFT JOIN user u ON p.user_id = u.id
    WHERE p.id = ?
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length)
      return res.status(404).json({ error: 'Post tidak ditemukan' });
    res.json(results[0]);
  });
};

// ✅ Update post
exports.updatePost = (req, res) => {
  const { judul, kategori_id, isi, user_id, status } = req.body;
  const newFoto = req.file ? req.file.filename : null;
  const id = req.params.id;

  db.query('SELECT foto FROM posts WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length)
      return res.status(404).json({ error: 'Post tidak ditemukan' });

    const oldFoto = results[0].foto;
    const fotoToSave = newFoto || oldFoto;
    const finalStatus = (status || 'draft').toLowerCase();

    // Jika ada foto baru, hapus foto lama
    if (newFoto && oldFoto) {
      const oldPath = path.join(__dirname, '../uploads/berita', oldFoto);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const sql = `
      UPDATE posts 
      SET judul=?, kategori_id=?, isi=?, user_id=?, status=?, foto=?, updated_at=NOW()
      WHERE id=?
    `;
    db.query(
      sql,
      [judul, kategori_id, isi, user_id, finalStatus, fotoToSave, id],
      (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: 'Post berhasil diperbarui' });
      }
    );
  });
};

// ✅ Hapus post
exports.deletePost = (req, res) => {
  const id = req.params.id;

  db.query('SELECT foto FROM posts WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length)
      return res.status(404).json({ error: 'Post tidak ditemukan' });

    const foto = results[0].foto;
    if (foto) {
      const fotoPath = path.join(__dirname, '../uploads/berita', foto);
      if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
    }

    db.query('DELETE FROM posts WHERE id = ?', [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'Post berhasil dihapus' });
    });
  });
};

// ✅ Hitung total post "publish"
exports.getPostsCount = (req, res) => {
  db.query(
    `SELECT COUNT(*) AS total FROM posts WHERE LOWER(status) IN ('publish', 'published')`,
    (err, results) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ total: results[0].total });
    }
  );
};