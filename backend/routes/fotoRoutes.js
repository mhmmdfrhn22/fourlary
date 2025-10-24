// routes/fotoRoutes.js
const express = require("express");
const router = express.Router();
const fotoCtrl = require("../controllers/fotoController");
const upload = require("../middleware/upload");

// ✅ Routes
router.get("/count", fotoCtrl.getFotoCount);
router.get("/", fotoCtrl.getAllFoto);
router.get("/laporan/pdf", fotoCtrl.generatePdfReport); // <- laporan PDF (top N, optional ?limit=10)
router.get("/:id", fotoCtrl.getFotoById);
router.post("/", upload.single("foto"), fotoCtrl.createFoto);
router.put("/:id", upload.single("foto"), fotoCtrl.updateFoto);
router.delete("/:id", fotoCtrl.deleteFoto);
router.get("/user", fotoCtrl.getFotoByUploader);// 🔹 Ambil foto berdasarkan uploader
router.get("/count/:user_id", fotoCtrl.getFotoCountByUser);

module.exports = router;
