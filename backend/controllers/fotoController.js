const fotoService = require("../services/fotoService");

// ✅ Ambil semua foto
exports.getAllFoto = (req, res) => {
  fotoService.getAllFoto(req.query.uploader_id, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

// ✅ Ambil foto milik user
exports.getFotoByUploader = (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ message: "Parameter user_id wajib diisi" });

  fotoService.getFotoByUploader(user_id, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

// ✅ Hitung jumlah foto user
exports.getFotoCountByUser = (req, res) => {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ message: "user_id wajib diisi" });

  fotoService.getFotoCountByUser(user_id, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ total: result[0].total });
  });
};

// ✅ Ambil foto by ID
exports.getFotoById = (req, res) => {
  fotoService.getFotoById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!result.length) return res.status(404).json({ message: "Foto tidak ditemukan" });
    res.json(result[0]);
  });
};

// ✅ Tambah foto
exports.createFoto = (req, res) => {
  const { id_kategori, deskripsi, diupload_oleh } = req.body;
  const foto = req.file ? req.file.filename : null;
  if (!foto) return res.status(400).json({ message: "Foto wajib diupload" });

  fotoService.createFoto({ id_kategori, url_foto: foto, deskripsi, diupload_oleh }, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal menyimpan data", error: err });
    res.status(201).json({ message: "Foto berhasil ditambahkan", id: result.insertId });
  });
};

// ✅ Update foto
exports.updateFoto = (req, res) => {
  const { id } = req.params;
  const { id_kategori, deskripsi } = req.body;
  const newFoto = req.file ? req.file.filename : null;

  fotoService.updateFoto(id, id_kategori, deskripsi, newFoto, (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Foto berhasil diperbarui" });
  });
};

// ✅ Hapus foto
exports.deleteFoto = (req, res) => {
  fotoService.deleteFoto(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Foto berhasil dihapus" });
  });
};

// ✅ Hitung total semua foto
exports.getFotoCount = (req, res) => {
  fotoService.getFotoCount((err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ total: result[0].total });
  });
};

// ✅ Generate PDF report
exports.generatePdfReport = (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  fotoService.generatePdfReport(limit, res, (err) => {
    if (err) return res.status(500).json({ message: "Gagal membuat laporan PDF" });
  });
};
