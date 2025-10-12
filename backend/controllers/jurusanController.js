const db = require("../config/db");

exports.getAllJurusan = (req, res) => {
  db.query("SELECT * FROM jurusan_sekolah", (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

exports.createJurusan = (req, res) => {
  const { nama_jurusan } = req.body;
  db.query(
    "INSERT INTO jurusan_sekolah (nama_jurusan) VALUES (?)",
    [nama_jurusan],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Jurusan berhasil ditambahkan" });
    }
  );
};

exports.updateJurusan = (req, res) => {
  const { id } = req.params;
  const { nama_jurusan } = req.body;
  db.query(
    "UPDATE jurusan_sekolah SET nama_jurusan = ? WHERE id_jurusan = ?",
    [nama_jurusan, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Jurusan berhasil diubah" });
    }
  );
};

exports.deleteJurusan = (req, res) => {
  const { id } = req.params;
  db.query(
    "DELETE FROM jurusan_sekolah WHERE id_jurusan = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Jurusan berhasil dihapus" });
    }
  );
};