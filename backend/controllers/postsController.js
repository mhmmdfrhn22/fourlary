const db = require('../config/db');

exports.getAllPosts = (req, res) => {
  db.query('SELECT * FROM posts', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createPost = (req, res) => {
  const { judul, kategori_id, isi, user_id, status } = req.body;
  db.query(
    'INSERT INTO posts (judul, kategori_id, isi, user_id, status) VALUES (?, ?, ?, ?, ?)',
    [judul, kategori_id, isi, user_id, status],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: results.insertId, judul, kategori_id, isi, user_id, status });
    }
  );
};

exports.getPostById = (req, res) => {
  db.query('SELECT * FROM posts WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ error: 'Post not found' });
    res.json(results[0]);
  });
};

exports.updatePost = (req, res) => {
  const { judul, kategori_id, isi, user_id, status } = req.body;
  db.query(
    'UPDATE posts SET judul = ?, kategori_id = ?, isi = ?, user_id = ?, status = ? WHERE id = ?',
    [judul, kategori_id, isi, user_id, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Post updated' });
    }
  );
};

exports.deletePost = (req, res) => {
  db.query('DELETE FROM posts WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Post deleted' });
  });
};
