const db = require("../config/db");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads/pembimbing");

// GET all pembimbing
exports.getAllPembimbing = (req, res) => {
  db.query("SELECT * FROM pembimbing_profile ORDER BY nama ASC", (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

// GET single pembimbing by id
exports.getPembimbingById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM pembimbing_profile WHERE id_pembimbing = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!result || result.length === 0) return res.status(404).json({ message: "Pembimbing tidak ditemukan" });
    res.json(result[0]);
  });
};

// CREATE pembimbing
exports.createPembimbing = (req, res) => {
  const { nama, nomor_wa, link_wa, jabatan, deskripsi } = req.body;
  const foto_pembimbing = req.file ? req.file.filename : null;

  const sql = `INSERT INTO pembimbing_profile (nama, nomor_wa, link_wa, foto_pembimbing, jabatan, deskripsi)
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [nama, nomor_wa, link_wa, foto_pembimbing, jabatan, deskripsi], (err, result) => {
    if (err) {
      console.error("createPembimbing error:", err);
      return res.status(500).json({ message: err.message });
    }
    res.status(201).json({ message: "Pembimbing berhasil ditambahkan", id: result.insertId });
  });
};

// UPDATE pembimbing
exports.updatePembimbing = (req, res) => {
  const { id } = req.params;
  const { nama, nomor_wa, link_wa, jabatan, deskripsi } = req.body;
  const fotoBaru = req.file ? req.file.filename : null;

  // ambil foto lama
  db.query("SELECT foto_pembimbing FROM pembimbing_profile WHERE id_pembimbing = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!rows || rows.length === 0) return res.status(404).json({ message: "Pembimbing tidak ditemukan" });

    const fotoLama = rows[0].foto_pembimbing;

    let sql, params;
    if (fotoBaru) {
      sql = `UPDATE pembimbing_profile SET nama=?, nomor_wa=?, link_wa=?, jabatan=?, deskripsi=?, foto_pembimbing=? WHERE id_pembimbing=?`;
      params = [nama, nomor_wa, link_wa, jabatan, deskripsi, fotoBaru, id];
    } else {
      sql = `UPDATE pembimbing_profile SET nama=?, nomor_wa=?, link_wa=?, jabatan=?, deskripsi=? WHERE id_pembimbing=?`;
      params = [nama, nomor_wa, link_wa, jabatan, deskripsi, id];
    }

    db.query(sql, params, (err2) => {
      if (err2) {
        console.error("updatePembimbing error:", err2);
        return res.status(500).json({ message: err2.message });
      }

      // jika ada foto baru, hapus foto lama file
      if (fotoBaru && fotoLama) {
        const oldPath = path.join(uploadDir, fotoLama);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) { console.warn("Gagal hapus foto lama:", e); }
        }
      }

      res.json({ message: "Pembimbing berhasil diperbarui" });
    });
  });
};

// DELETE pembimbing
exports.deletePembimbing = (req, res) => {
  const { id } = req.params;

  // ambil foto dulu
  db.query("SELECT foto_pembimbing FROM pembimbing_profile WHERE id_pembimbing = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!rows || rows.length === 0) return res.status(404).json({ message: "Pembimbing tidak ditemukan" });

    const foto = rows[0].foto_pembimbing;

    db.query("DELETE FROM pembimbing_profile WHERE id_pembimbing = ?", [id], (err2) => {
      if (err2) return res.status(500).json({ message: err2.message });

      if (foto) {
        const filePath = path.join(uploadDir, foto);
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) { console.warn("Gagal hapus file:", e); }
        }
      }

      res.json({ message: "Pembimbing berhasil dihapus" });
    });
  });
};