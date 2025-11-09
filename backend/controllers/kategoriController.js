const kategoriService = require("../services/kategoriService");

// ✅ Ambil semua kategori
exports.getAllKategori = (req, res) => {
  kategoriService.getAllKategori((err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data kategori", error: err });
    res.json(results);
  });
};

// ✅ Tambah kategori baru
exports.createKategori = (req, res) => {
  const { judul } = req.body;

  if (!judul) {
    return res.status(400).json({ message: "Judul kategori harus diisi" });
  }

  kategoriService.createKategori(judul, (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal menambah kategori", error: err });
    res.status(201).json({
      id: results.insertId,
      judul,
    });
  });
};

// ✅ Ambil kategori berdasarkan ID
exports.getKategoriById = (req, res) => {
  const { id } = req.params;

  kategoriService.getKategoriById(id, (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil kategori", error: err });
    if (!results.length) return res.status(404).json({ message: "Kategori tidak ditemukan" });

    res.json(results[0]);
  });
};

// ✅ Update kategori
exports.updateKategori = (req, res) => {
  const { id } = req.params;
  const { judul } = req.body;

  if (!judul) {
    return res.status(400).json({ message: "Judul kategori harus diisi" });
  }

  kategoriService.updateKategori(id, judul, (err) => {
    if (err) return res.status(500).json({ message: "Gagal memperbarui kategori", error: err });
    res.json({ message: "Kategori berhasil diperbarui" });
  });
};

// ✅ Hapus kategori
exports.deleteKategori = (req, res) => {
  const { id } = req.params;

  kategoriService.deleteKategori(id, (err) => {
    if (err) return res.status(500).json({ message: "Gagal menghapus kategori", error: err });
    res.json({ message: "Kategori berhasil dihapus" });
  });
};
