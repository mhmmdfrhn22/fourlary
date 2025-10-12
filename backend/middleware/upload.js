const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Konfigurasi penyimpanan file dinamis
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const url = req.originalUrl || "";
    let folder = "uploads/general";

    // ✅ Cek endpoint dan arahkan foldernya
    if (url.includes("guru")) folder = "uploads/guru";
    else if (url.includes("foto")) folder = "uploads/galeri";
    else if (url.includes("posts")) folder = "uploads/berita";
    else if (url.includes("pembimbing")) folder = "uploads/pembimbing";
    else if (url.includes("pembinat")) folder = "uploads/pembinat";

    const uploadPath = path.join(__dirname, "../" + folder);

    // ✅ Buat folder jika belum ada
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

    console.log("➡️ Upload ke:", uploadPath);
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    // ✅ Buat nama file unik berdasarkan waktu
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/\s+/g, "_"); // hapus spasi
    cb(null, uniqueSuffix + "_" + safeName);
  },
});

// ✅ Hanya izinkan file gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("❌ Hanya file gambar (JPG, PNG, dsb) yang diperbolehkan!"), false);
};

// ✅ Inisialisasi multer
const upload = multer({ storage, fileFilter });

module.exports = upload;