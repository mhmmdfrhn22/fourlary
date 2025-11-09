const guruService = require("../services/guruService");

// ✅ Ambil semua guru
exports.getAllGuru = (req, res) => {
  guruService.getAllGuru((err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data guru", error: err });
    res.json(results);
  });
};

// ✅ Tambah guru baru
exports.addGuru = (req, res) => {
  const { nama_guru, mata_pelajaran, deskripsi, link_sosial_media } = req.body;
  const foto_guru = req.file ? req.file.filename : null;

  if (!nama_guru || !mata_pelajaran || !deskripsi) {
    return res.status(400).json({ message: "Data belum lengkap" });
  }

  const data = { nama_guru, mata_pelajaran, deskripsi, link_sosial_media, foto_guru };

  guruService.addGuru(data, (err, result) => {
    if (err) {
      console.error("Error insert guru:", err);
      return res.status(500).json({ message: "Gagal menambah guru", error: err.message });
    }

    res.status(201).json({
      id: result.insertId,
      ...data,
    });
  });
};

// ✅ Update guru
exports.updateGuru = (req, res) => {
  const { nama_guru, mata_pelajaran, deskripsi, link_sosial_media } = req.body;
  const foto_guru = req.file ? req.file.filename : req.body.foto_guru || null;

  const data = { nama_guru, mata_pelajaran, deskripsi, link_sosial_media, foto_guru };

  guruService.updateGuru(req.params.id, data, (err) => {
    if (err) {
      console.error("Error update guru:", err);
      return res.status(500).json({ message: "Gagal memperbarui guru", error: err });
    }
    res.json({ message: "Guru berhasil diperbarui" });
  });
};

// ✅ Ambil guru by ID
exports.getGuruById = (req, res) => {
  guruService.getGuruById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data guru", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Guru tidak ditemukan" });
    res.json(results[0]);
  });
};

// ✅ Hapus guru
exports.deleteGuru = (req, res) => {
  guruService.deleteGuru(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: "Gagal menghapus data guru", error: err.message });
    res.json({ message: "Guru berhasil dihapus" });
  });
};
