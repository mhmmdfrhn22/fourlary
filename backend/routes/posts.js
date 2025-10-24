const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const upload = require('../middleware/upload'); // pakai konfigurasi upload.js yang sudah benar

// ✅ Hitung total posts published
router.get('/count', postsController.getPostsCount);

router.get("/count/:user_id", postsController.getPostCountByUser);

// ✅ Ambil semua posts
router.get('/', postsController.getAllPosts);

// ✅ Buat post baru (pakai upload single 'foto')
router.post('/', upload.single('foto'), postsController.createPost);

// ✅ Ambil post berdasarkan id
router.get('/:id', postsController.getPostById);

// ✅ Update post berdasarkan id (juga bisa update foto)
router.put('/:id', upload.single('foto'), postsController.updatePost);

// ✅ Hapus post berdasarkan id
router.delete('/:id', postsController.deletePost);

router.get('/user', postsController.getPostsByUser); // 🔹 Ambil post milik user tertentu


module.exports = router;