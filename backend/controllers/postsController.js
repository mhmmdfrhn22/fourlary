const postService = require('../services/postsService');

exports.getAllPosts = async (req, res) => {
  try {
    const { user_id } = req.query;
    const posts = await postService.getAllPosts(user_id);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const results = await postService.getPostById(req.params.id);
    if (!results.length)
      return res.status(404).json({ error: 'Post tidak ditemukan' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { judul, kategori_id, isi, user_id, status } = req.body;
    const foto = req.file ? req.file.filename : null;

    if (!judul || !kategori_id || !isi || !user_id)
      return res.status(400).json({ error: 'Judul, kategori, isi, dan user wajib diisi' });

    const finalStatus = (status || 'draft').toLowerCase();
    const result = await postService.createPost({
      judul,
      kategori_id,
      isi,
      user_id,
      status: finalStatus,
      foto,
    });

    res.status(201).json({
      id: result.insertId,
      judul,
      kategori_id,
      isi,
      user_id,
      status: finalStatus,
      foto,
      message: 'Post berhasil ditambahkan',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, kategori_id, isi, user_id, status } = req.body;
    const foto = req.file ? req.file.filename : null;

    const results = await postService.getPostById(id);
    if (!results.length)
      return res.status(404).json({ error: 'Post tidak ditemukan' });

    const oldFoto = results[0].foto;
    const fotoToSave = foto || oldFoto;
    const finalStatus = (status || 'draft').toLowerCase();

    await postService.updatePost(id, {
      judul,
      kategori_id,
      isi,
      user_id,
      status: finalStatus,
      foto: fotoToSave,
    });

    res.json({ message: 'Post berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const result = await postService.deletePost(req.params.id);
    if (result?.notFound)
      return res.status(404).json({ error: 'Post tidak ditemukan' });

    res.json({ message: 'Post berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Hitung total semua post published
exports.getPostsCount = async (req, res) => {
  try {
    const count = await postService.getPostsCount();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Hitung total post per user
exports.getPostCountByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const count = await postService.getPostCountByUser(user_id);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Ambil semua post milik user tertentu
exports.getPostsByUser = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id)
      return res.status(400).json({ error: 'user_id wajib diisi' });

    const posts = await postService.getPostsByUser(user_id);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
