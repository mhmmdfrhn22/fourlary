const pembimbingService = require("../services/pembimbingService");

// ✅ GET semua pembimbing
exports.getAllPembimbing = async (req, res) => {
  try {
    const data = await pembimbingService.getAllPembimbing();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET pembimbing by ID
exports.getPembimbingById = async (req, res) => {
  try {
    const pembimbing = await pembimbingService.getPembimbingById(req.params.id);
    if (!pembimbing) return res.status(404).json({ message: "Pembimbing tidak ditemukan" });
    res.json(pembimbing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ CREATE pembimbing
exports.createPembimbing = async (req, res) => {
  try {
    const { nama, nomor_wa, link_wa, jabatan, deskripsi } = req.body;
    const foto_pembimbing = req.file ? req.file.filename : null;

    const id = await pembimbingService.createPembimbing({
      nama,
      nomor_wa,
      link_wa,
      foto_pembimbing,
      jabatan,
      deskripsi,
    });

    res.status(201).json({ message: "Pembimbing berhasil ditambahkan", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE pembimbing
exports.updatePembimbing = async (req, res) => {
  try {
    const { nama, nomor_wa, link_wa, jabatan, deskripsi } = req.body;
    const fotoBaru = req.file ? req.file.filename : null;

    const updated = await pembimbingService.updatePembimbing(req.params.id, {
      nama,
      nomor_wa,
      link_wa,
      jabatan,
      deskripsi,
      fotoBaru,
    });

    if (!updated) return res.status(404).json({ message: "Pembimbing tidak ditemukan" });
    res.json({ message: "Pembimbing berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE pembimbing
exports.deletePembimbing = async (req, res) => {
  try {
    const deleted = await pembimbingService.deletePembimbing(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Pembimbing tidak ditemukan" });
    res.json({ message: "Pembimbing berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
