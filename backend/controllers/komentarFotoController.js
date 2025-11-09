// controllers/komentarController.js
const komentarService = require("../services/komentarFotoService");

// ✅ GET semua komentar
exports.getAllKomentar = (req, res) => {
  const { uploader_id } = req.query;

  komentarService.getAllKomentar(uploader_id, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

// ✅ Hitung jumlah komentar yang diterima user
exports.getKomentarCountByUser = (req, res) => {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ message: "user_id wajib diisi" });

  komentarService.getKomentarCountByUser(user_id, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ total: result[0].total });
  });
};

// ✅ Komentar untuk semua foto milik user (khusus uploader)
exports.getKomentarByUploader = (req, res) => {
  const { user_id } = req.query;
  if (!user_id)
    return res.status(400).json({ message: "Parameter user_id wajib diisi" });

  komentarService.getKomentarByUploader(user_id, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

// ✅ Komentar berdasarkan foto
exports.getKomentarByFoto = (req, res) => {
  const { id_foto } = req.params;

  komentarService.getKomentarByFoto(id_foto, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

// ✅ Tambah komentar
exports.createKomentar = (req, res) => {
  const { id_foto, id_user, isi_komentar } = req.body;

  if (!id_foto || !id_user || !isi_komentar) {
    return res.status(400).json({ message: "Semua data harus diisi" });
  }

  komentarService.createKomentar(id_foto, id_user, isi_komentar, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    res.status(201).json({
      message: "Komentar berhasil ditambahkan",
      id: result.insertId,
    });
  });
};

// ✅ Hapus komentar
exports.deleteKomentar = (req, res) => {
  const { id } = req.params;

  komentarService.deleteKomentar(id, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Komentar tidak ditemukan" });

    res.json({ message: "Komentar berhasil dihapus" });
  });
};
