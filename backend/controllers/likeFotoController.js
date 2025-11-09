// controllers/likeController.js
const likeService = require("../services/likeFotoService");

// ✅ Jumlah like per foto
exports.getLikeCount = (req, res) => {
  const { id_foto } = req.params;

  likeService.getLikeCount(id_foto, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result[0]);
  });
};

// ✅ Total like dari semua foto milik user
exports.getLikeCountByUser = (req, res) => {
  const { user_id } = req.params;
  if (!user_id)
    return res.status(400).json({ message: "user_id wajib diisi" });

  likeService.getLikeCountByUser(user_id, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    const total = result.length ? result[0].total : 0;
    res.json({ total });
  });
};

// ✅ Statistik like berdasarkan waktu
exports.getLikeStats = (req, res) => {
  const { userId } = req.params;
  let { range } = req.query;
  if (!range) range = "7d";

  let interval = 7;
  if (range === "14d") interval = 14;
  else if (range === "30d") interval = 30;

  likeService.getLikeStats(userId, interval, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

// ✅ Cek apakah user sudah like foto
exports.checkUserLike = (req, res) => {
  const { id_foto, id_user } = req.params;

  likeService.checkUserLike(id_foto, id_user, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ liked: result.length > 0 });
  });
};

// ✅ Tambah like
exports.addLike = (req, res) => {
  const { id_foto, id_user } = req.body;
  if (!id_foto || !id_user)
    return res.status(400).json({ message: "id_foto dan id_user wajib diisi" });

  likeService.addLike(id_foto, id_user, (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ message: "Foto disukai" });
  });
};

// ✅ Hapus like
exports.removeLike = (req, res) => {
  const { id_foto, id_user } = req.body;

  likeService.removeLike(id_foto, id_user, (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Like dihapus" });
  });
};

// ✅ Cek like (pakai query)
exports.checkLike = (req, res) => {
  const { id_foto, id_user } = req.query;

  likeService.checkLike(id_foto, id_user, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ liked: result.length > 0 });
  });
};
