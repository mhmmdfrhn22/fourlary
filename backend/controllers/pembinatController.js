const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// Lokasi folder upload
const uploadDir = path.join(__dirname, "../uploads/pembinat");

// ✅ GET semua pembinat
exports.getAllPembinat = (req, res) => {
  const sql = `
    SELECT p.*, j.nama_jurusan, b.nama AS nama_pembimbing
    FROM pembinat_pekerjaan p
    LEFT JOIN jurusan_sekolah j ON p.id_jurusan = j.id_jurusan
    LEFT JOIN pembimbing_profile b ON p.id_pembimbing = b.id_pembimbing
    ORDER BY p.created_at DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

// ✅ CREATE pembinat baru
exports.createPembinat = (req, res) => {
  const { nama_pekerjaan, deskripsi, id_jurusan, id_pembimbing } = req.body;
  const gambar_pekerjaan = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO pembinat_pekerjaan 
    (nama_pekerjaan, deskripsi, id_jurusan, id_pembimbing, gambar_pekerjaan)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [nama_pekerjaan, deskripsi, id_jurusan, id_pembimbing, gambar_pekerjaan],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "✅ Pembinat berhasil ditambahkan", id: result.insertId });
    }
  );
};

// ✅ UPDATE pembinat
exports.updatePembinat = (req, res) => {
  const { id } = req.params;
  const { nama_pekerjaan, deskripsi, id_jurusan, id_pembimbing } = req.body;
  const gambarBaru = req.file ? req.file.filename : null;

  db.query(
    "SELECT gambar_pekerjaan FROM pembinat_pekerjaan WHERE id_pekerjaan = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0)
        return res.status(404).json({ message: "Data tidak ditemukan" });

      const gambarLama = result[0].gambar_pekerjaan;

      let sql, params;
      if (gambarBaru) {
        sql = `
          UPDATE pembinat_pekerjaan 
          SET nama_pekerjaan=?, deskripsi=?, id_jurusan=?, id_pembimbing=?, gambar_pekerjaan=? 
          WHERE id_pekerjaan=?
        `;
        params = [nama_pekerjaan, deskripsi, id_jurusan, id_pembimbing, gambarBaru, id];
      } else {
        sql = `
          UPDATE pembinat_pekerjaan 
          SET nama_pekerjaan=?, deskripsi=?, id_jurusan=?, id_pembimbing=? 
          WHERE id_pekerjaan=?
        `;
        params = [nama_pekerjaan, deskripsi, id_jurusan, id_pembimbing, id];
      }

      db.query(sql, params, (err) => {
        if (err) return res.status(500).json({ message: err.message });

        // Hapus foto lama jika ada upload baru
        if (gambarBaru && gambarLama) {
          const oldPath = path.join(uploadDir, gambarLama);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        res.json({ message: "✅ Pembinat berhasil diperbarui" });
      });
    }
  );
};

// ✅ DELETE pembinat
exports.deletePembinat = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT gambar_pekerjaan FROM pembinat_pekerjaan WHERE id_pekerjaan = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0)
        return res.status(404).json({ message: "Data tidak ditemukan" });

      const gambar = result[0].gambar_pekerjaan;

      // Hapus data dari database
      db.query("DELETE FROM pembinat_pekerjaan WHERE id_pekerjaan = ?", [id], (err2) => {
        if (err2) return res.status(500).json({ message: err2.message });

        // Hapus file fisik dari folder
        if (gambar) {
          const filePath = path.join(uploadDir, gambar);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        res.json({ message: "🗑️ Pembinat dan fotonya berhasil dihapus" });
      });
    }
  );
};