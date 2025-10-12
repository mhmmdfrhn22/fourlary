const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// ✅ Ambil semua guru
exports.getAllGuru = (req, res) => {
    const sql = 'SELECT * FROM guru_info';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data guru', error: err });
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

    const sql = `
    INSERT INTO guru_info (nama_guru, mata_pelajaran, deskripsi, link_sosial_media, foto_guru)
    VALUES (?, ?, ?, ?, ?)
  `;

    db.query(sql, [nama_guru, mata_pelajaran, deskripsi, link_sosial_media, foto_guru], (err, result) => {
        if (err) {
            console.error("Error insert guru:", err);
            return res.status(500).json({ message: "Gagal menambah guru", error: err.message });
        }
        res.status(201).json({
            id: result.insertId,
            nama_guru,
            mata_pelajaran,
            deskripsi,
            link_sosial_media,
            foto_guru
        });
    });
};

// ✅ Update guru
exports.updateGuru = (req, res) => {
    const { nama_guru, mata_pelajaran, deskripsi, link_sosial_media } = req.body;
    const foto_guru = req.file ? req.file.filename : req.body.foto_guru || null;

    const sql = `
    UPDATE guru_info
    SET nama_guru=?, mata_pelajaran=?, deskripsi=?, link_sosial_media=?, foto_guru=?
    WHERE id=?
  `;

    db.query(sql, [nama_guru, mata_pelajaran, deskripsi, link_sosial_media, foto_guru, req.params.id], (err) => {
        if (err) {
            console.error("Error update guru:", err);
            return res.status(500).json({ message: "Gagal memperbarui guru", error: err });
        }
        res.json({ message: "Guru berhasil diperbarui" });
    });
};

// ✅ Ambil guru by id
exports.getGuruById = (req, res) => {
    const sql = 'SELECT * FROM guru_info WHERE id=?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data guru', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Guru tidak ditemukan' });
        res.json(results[0]);
    });
};

// ✅ Hapus guru
exports.deleteGuru = (req, res) => {
    const { id } = req.params;

    // Ambil data guru dulu untuk tahu nama file-nya
    const getSql = 'SELECT foto_guru FROM guru_info WHERE id = ?';
    db.query(getSql, [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data guru', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Guru tidak ditemukan' });

        const fotoFile = results[0].foto_guru;
        if (fotoFile) {
            const fotoPath = path.join(__dirname, '../uploads/guru', fotoFile);
            if (fs.existsSync(fotoPath)) {
                fs.unlinkSync(fotoPath);
                console.log('🗑️ Foto dihapus:', fotoPath);
            }
        }

        // Hapus datanya dari database
        const deleteSql = 'DELETE FROM guru_info WHERE id = ?';
        db.query(deleteSql, [id], (err) => {
            if (err) return res.status(500).json({ message: 'Gagal menghapus data guru', error: err });
            res.json({ message: 'Guru berhasil dihapus' });
        });
    });
};