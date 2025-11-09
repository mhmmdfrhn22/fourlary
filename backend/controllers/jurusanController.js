const jurusanService = require("../services/jurusanService");

// ✅ Ambil semua jurusan
exports.getAllJurusan = (req, res) => {
  jurusanService.getAllJurusan((err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data jurusan", error: err });
    res.json(result);
  });
};

// ✅ Tambah jurusan baru
exports.createJurusan = (req, res) => {
  const { nama_jurusan } = req.body;

  if (!nama_jurusan) {
    return res.status(400).json({ message: "Nama jurusan harus diisi" });
  }

  jurusanService.createJurusan(nama_jurusan, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal menambah jurusan", error: err.message });
    res.status(201).json({ message: "Jurusan berhasil ditambahkan", id: result.insertId });
  });
};

// ✅ Update jurusan
exports.updateJurusan = (req, res) => {
  const { id } = req.params;
  const { nama_jurusan } = req.body;

  if (!nama_jurusan) {
    return res.status(400).json({ message: "Nama jurusan harus diisi" });
  }

  jurusanService.updateJurusan(id, nama_jurusan, (err) => {
    if (err) return res.status(500).json({ message: "Gagal mengubah jurusan", error: err.message });
    res.json({ message: "Jurusan berhasil diubah" });
  });
};

// ✅ Hapus jurusan
exports.deleteJurusan = (req, res) => {
  const { id } = req.params;

  jurusanService.deleteJurusan(id, (err) => {
    if (err) return res.status(500).json({ message: "Gagal menghapus jurusan", error: err.message });
    res.json({ message: "Jurusan berhasil dihapus" });
  });
};
