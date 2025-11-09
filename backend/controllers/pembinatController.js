const pembinatService = require("../services/pembinatService");

// ✅ GET semua pembinat
exports.getAllPembinat = async (req, res) => {
  try {
    const data = await pembinatService.getAllPembinat();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ CREATE pembinat
exports.createPembinat = async (req, res) => {
  try {
    const { nama_pekerjaan, deskripsi, id_jurusan, id_pembimbing } = req.body;
    const gambar_pekerjaan = req.file ? req.file.filename : null;

    const id = await pembinatService.createPembinat({
      nama_pekerjaan,
      deskripsi,
      id_jurusan,
      id_pembimbing,
      gambar_pekerjaan,
    });

    res.status(201).json({ message: "✅ Pembinat berhasil ditambahkan", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE pembinat
exports.updatePembinat = async (req, res) => {
  try {
    const { nama_pekerjaan, deskripsi, id_jurusan, id_pembimbing } = req.body;
    const gambarBaru = req.file ? req.file.filename : null;

    const updated = await pembinatService.updatePembinat(req.params.id, {
      nama_pekerjaan,
      deskripsi,
      id_jurusan,
      id_pembimbing,
      gambarBaru,
    });

    if (!updated) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json({ message: "✅ Pembinat berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE pembinat
exports.deletePembinat = async (req, res) => {
  try {
    const deleted = await pembinatService.deletePembinat(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json({ message: "🗑️ Pembinat dan fotonya berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
