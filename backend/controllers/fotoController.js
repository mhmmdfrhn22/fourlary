// controllers/fotoController.js
const db = require("../config/db");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

// ✅ Ambil semua foto + kategori + uploader + jumlah like
exports.getAllFoto = (req, res) => {
  const sql = `
    SELECT 
      f.id_foto,
      f.id_kategori,
      f.url_foto,
      f.deskripsi,
      f.tanggal_upload,
      COALESCE(k.nama_kategori, '-') AS nama_kategori,
      COALESCE(u.username, 'Admin') AS uploader,
      COUNT(l.id_like) AS like_count
    FROM foto_galeri f
    LEFT JOIN kategori_foto k ON f.id_kategori = k.id_kategori
    LEFT JOIN user u ON f.diupload_oleh = u.id
    LEFT JOIN like_foto l ON f.id_foto = l.id_foto
    GROUP BY f.id_foto
    ORDER BY f.tanggal_upload DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("🚨 SQL Error:", err);
      return res.status(500).json({ message: err.message });
    }
    res.json(result);
  });
};

// ✅ Ambil foto berdasarkan ID
exports.getFotoById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      f.*, 
      COALESCE(k.nama_kategori, '-') AS nama_kategori, 
      COALESCE(u.username, 'Admin') AS uploader
    FROM foto_galeri f
    LEFT JOIN kategori_foto k ON f.id_kategori = k.id_kategori
    LEFT JOIN user u ON f.diupload_oleh = u.id
    WHERE f.id_foto = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "Foto tidak ditemukan" });
    res.json(result[0]);
  });
};

// ✅ Tambah foto baru
exports.createFoto = (req, res) => {
  try {
    const { id_kategori, deskripsi, diupload_oleh } = req.body;
    const foto = req.file ? req.file.filename : null;

    if (!foto) {
      return res.status(400).json({ message: "Foto wajib diupload" });
    }

    const sql = `
      INSERT INTO foto_galeri (id_kategori, url_foto, deskripsi, diupload_oleh)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [id_kategori, foto, deskripsi, diupload_oleh], (err, result) => {
      if (err) {
        console.error("❌ Error saat insert foto:", err);
        return res.status(500).json({ message: "Gagal menyimpan data", error: err });
      }

      res.status(201).json({ message: "Foto berhasil ditambahkan", id: result.insertId });
    });
  } catch (error) {
    console.error("Error createFoto:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// ✅ Update foto
exports.updateFoto = (req, res) => {
  const { id } = req.params;
  const { id_kategori, deskripsi } = req.body;
  const newFoto = req.file ? req.file.filename : null;

  db.query("SELECT url_foto FROM foto_galeri WHERE id_foto = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Foto tidak ditemukan" });

    const oldFoto = result[0].url_foto;
    const fotoToSave = newFoto || oldFoto;

    // Jika ada file baru, hapus foto lama
    if (newFoto && oldFoto) {
      const oldPath = path.join(__dirname, "../uploads/galeri", oldFoto);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const sql = `
      UPDATE foto_galeri 
      SET id_kategori = ?, url_foto = ?, deskripsi = ?
      WHERE id_foto = ?
    `;
    db.query(sql, [id_kategori, fotoToSave, deskripsi, id], (err2) => {
      if (err2) return res.status(500).json({ message: err2.message });
      res.json({ message: "Foto berhasil diperbarui" });
    });
  });
};

// ✅ Hapus foto
exports.deleteFoto = (req, res) => {
  const { id } = req.params;

  db.query("SELECT url_foto FROM foto_galeri WHERE id_foto = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Foto tidak ditemukan" });

    const foto = result[0].url_foto;
    const fotoPath = path.join(__dirname, "../uploads/galeri", foto);

    if (fs.existsSync(fotoPath)) {
      fs.unlinkSync(fotoPath);
      console.log("✅ File dihapus:", fotoPath);
    } else {
      console.warn("⚠️ File tidak ditemukan di path:", fotoPath);
    }

    db.query("DELETE FROM foto_galeri WHERE id_foto = ?", [id], (err2) => {
      if (err2) return res.status(500).json({ message: err2.message });
      res.json({ message: "Foto berhasil dihapus" });
    });
  });
};

// ✅ Hitung total semua foto
exports.getFotoCount = (req, res) => {
  const sql = `SELECT COUNT(*) AS total FROM foto_galeri`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("🚨 SQL Error:", err);
      return res.status(500).json({ message: err.message });
    }
    res.json({ total: result[0].total });
  });
};

/**
 * GENERATE PDF REPORT — top N foto berdasar jumlah like
 * Endpoint: GET /api/foto/laporan/pdf
 * Query param (optional): ?limit=10
 */
exports.generatePdfReport = (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;

  // Ambil top foto berdasarkan jumlah like
  const sql = `
    SELECT 
      f.id_foto,
      f.url_foto,
      f.deskripsi,
      COALESCE(k.nama_kategori, '-') AS nama_kategori,
      COALESCE(u.username, 'Admin') AS uploader,
      COUNT(l.id_like) AS like_count,
      f.tanggal_upload
    FROM foto_galeri f
    LEFT JOIN kategori_foto k ON f.id_kategori = k.id_kategori
    LEFT JOIN user u ON f.diupload_oleh = u.id
    LEFT JOIN like_foto l ON f.id_foto = l.id_foto
    GROUP BY f.id_foto
    ORDER BY like_count DESC, f.tanggal_upload DESC
    LIMIT ?
  `;

  db.query(sql, [limit], (err, rows) => {
    if (err) {
      console.error("Error fetching top photos:", err);
      return res.status(500).json({ message: "Gagal mengambil data laporan" });
    }

    try {
      // Create PDF document
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      // Set filename
      const filename = `laporan_foto_top_${limit}.pdf`;
      // Headers so browser treats as attachment
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Type", "application/pdf");

      // Pipe PDF to response directly
      doc.pipe(res);

      // Title
      doc.fontSize(18).font("Helvetica-Bold").text("Laporan Foto: Top " + limit, { align: "center" });
      doc.moveDown(0.5);
      doc.fontSize(10).font("Helvetica").text(`Tanggal: ${new Date().toLocaleString()}`, { align: "center" });
      doc.moveDown(1.2);

      // If there is at least one photo, show the top photo big
      if (rows.length > 0) {
        const top = rows[0];
        const imagePath = path.join(__dirname, "../uploads/galeri", top.url_foto || "");
        if (top.url_foto && fs.existsSync(imagePath)) {
          // add top image with max height 220 keep aspect ratio
          try {
            doc.image(imagePath, { fit: [480, 260], align: "center", valign: "center" });
            doc.moveDown(0.5);
            doc.fontSize(12).font("Helvetica-Bold").text(top.deskripsi || "(Tanpa deskripsi)", { align: "center" });
            doc.moveDown(0.5);
            doc.fontSize(10).font("Helvetica").text(`Likes: ${top.like_count}  •  Kategori: ${top.nama_kategori}  •  Uploader: ${top.uploader}`, { align: "center" });
            doc.moveDown(1);
          } catch (imgErr) {
            console.warn("Gagal menambahkan gambar ke PDF:", imgErr);
            doc.fontSize(12).text("(Gagal menampilkan gambar teratas)", { align: "center" });
            doc.moveDown(1);
          }
        }
      } else {
        doc.fontSize(12).text("Tidak ada data foto untuk dilaporkan.", { align: "center" });
        doc.end();
        return;
      }

      // Table header
      doc.moveDown(0.5);
      const tableTop = doc.y;
      const columnPositions = {
        no: 40,
        deskripsi: 80,
        kategori: 290,
        likes: 380,
        uploader: 440,
        tanggal: 520,
      };

      doc.fontSize(10).font("Helvetica-Bold");
      doc.text("No", columnPositions.no, tableTop);
      doc.text("Deskripsi", columnPositions.deskripsi, tableTop);
      doc.text("Kategori", columnPositions.kategori, tableTop);
      doc.text("Likes", columnPositions.likes, tableTop);
      doc.text("Uploader", columnPositions.uploader, tableTop);
      doc.text("Tanggal", columnPositions.tanggal, tableTop);

      // draw a line
      doc.moveTo(40, tableTop + 15).lineTo(560, tableTop + 15).stroke();

      doc.font("Helvetica").fontSize(9);
      let y = tableTop + 20;
      rows.forEach((r, idx) => {
        // wrap deskripsi if long
        const no = idx + 1;
        doc.text(String(no), columnPositions.no, y, { width: 30 });
        doc.text(r.deskripsi ? (r.deskripsi.length > 40 ? r.deskripsi.slice(0, 37) + "..." : r.deskripsi) : "-", columnPositions.deskripsi, y, { width: 200 });
        doc.text(r.nama_kategori || "-", columnPositions.kategori, y, { width: 80 });
        doc.text(String(r.like_count || 0), columnPositions.likes, y, { width: 40 });
        doc.text(r.uploader || "-", columnPositions.uploader, y, { width: 80 });
        const t = r.tanggal_upload ? new Date(r.tanggal_upload).toLocaleDateString() : "-";
        doc.text(t, columnPositions.tanggal, y, { width: 80 });

        y += 18;
        // pagination: if y too low, add new page and reprint header
        if (y > 750) {
          doc.addPage();
          y = 50;
        }
      });

      doc.moveDown(2);
      doc.fontSize(10).text("Catatan: Laporan dihasilkan otomatis.", { align: "left" });

      // finalize
      doc.end();
      // no need to call res.end(); pdfkit will finish pipe
    } catch (pdfErr) {
      console.error("Error generating PDF:", pdfErr);
      return res.status(500).json({ message: "Gagal membuat laporan PDF" });
    }
  });
};