const kategoriFotoService = require("../services/kategoriFotoService");

// ✅ Ambil semua kategori
exports.getAllKategori = (req, res) => {
  kategoriFotoService.getAllKategori((err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data kategori", error: err });
    res.json(results);
  });
};

// ✅ Ambil kategori berdasarkan ID
exports.getKategoriById = (req, res) => {
  const { id } = req.params;

  kategoriFotoService.getKategoriById(id, (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil kategori", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Kategori tidak ditemukan" });
    res.json(results[0]);
  });
};

// ✅ Tambah kategori baru
exports.createKategori = (req, res) => {
  const { nama_kategori, dibuat_oleh } = req.body;

  // Hanya nama_kategori yang wajib
  if (!nama_kategori) {
    return res.status(400).json({ message: "Nama kategori harus diisi" });
  }

  // Kalau tidak ada dibuat_oleh, isi NULL
  const dibuatOlehValue = dibuat_oleh || null;

  kategoriFotoService.createKategori(nama_kategori, dibuatOlehValue, (err, result) => {
    if (err) {
      console.error("❌ Gagal membuat kategori:", err);
      return res.status(500).json({ message: "Gagal membuat kategori", error: err });
    }

    res.status(201).json({
      message: "Kategori berhasil dibuat",
      id: result.insertId,
      nama_kategori,
      dibuat_oleh: dibuatOlehValue,
    });
  });
};

// ✅ Update kategori
exports.updateKategori = (req, res) => {
  const { id } = req.params;
  const { nama_kategori } = req.body;

  if (!nama_kategori) {
    return res.status(400).json({ message: "Nama kategori harus diisi" });
  }

  kategoriFotoService.updateKategori(id, nama_kategori, (err) => {
    if (err) return res.status(500).json({ message: "Gagal memperbarui kategori", error: err });
    res.json({ message: "Kategori berhasil diperbarui" });
  });
};

// ✅ Hapus kategori
exports.deleteKategori = (req, res) => {
  const { id } = req.params;

  kategoriFotoService.deleteKategori(id, (err) => {
    if (err) return res.status(500).json({ message: "Gagal menghapus kategori", error: err });
    res.json({ message: "Kategori berhasil dihapus" });
  });
};
