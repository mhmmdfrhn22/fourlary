const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads/pembinat");

// 🔹 GET semua pembinat
exports.getAllPembinat = async () => {
  try {
    const pembinat = await prisma.pembinatPekerjaan.findMany({
      include: {
        jurusan: { select: { nama_jurusan: true } },
        pembimbing: { select: { nama: true } },
      },
      orderBy: { created_at: "desc" },
    });

    // Bentuk data mirip seperti SQL JOIN versi lama
    return pembinat.map((p) => ({
      ...p,
      nama_jurusan: p.jurusan ? p.jurusan.nama_jurusan : null,
      nama_pembimbing: p.pembimbing ? p.pembimbing.nama : null,
    }));
  } catch (err) {
    throw err;
  }
};

// 🔹 CREATE pembinat
exports.createPembinat = async (data) => {
  const { nama_pekerjaan, deskripsi, id_jurusan, id_pembimbing, gambar_pekerjaan } = data;

  try {
    const pembinat = await prisma.pembinatPekerjaan.create({
      data: {
        nama_pekerjaan,
        deskripsi,
        gambar_pekerjaan,
        id_jurusan: id_jurusan ? Number(id_jurusan) : null,
        id_pembimbing: id_pembimbing ? Number(id_pembimbing) : null,
      },
    });

    return pembinat.id_pekerjaan;
  } catch (err) {
    throw err;
  }
};

// 🔹 UPDATE pembinat
exports.updatePembinat = async (id, data) => {
  const { nama_pekerjaan, deskripsi, id_jurusan, id_pembimbing, gambarBaru } = data;

  try {
    const existing = await prisma.pembinatPekerjaan.findUnique({
      where: { id_pekerjaan: Number(id) },
    });

    if (!existing) return null;

    // hapus gambar lama jika ada gambar baru
    if (gambarBaru && existing.gambar_pekerjaan) {
      const oldPath = path.join(uploadDir, existing.gambar_pekerjaan);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.warn("⚠️ Gagal hapus gambar lama:", e);
        }
      }
    }

    await prisma.pembinatPekerjaan.update({
      where: { id_pekerjaan: Number(id) },
      data: {
        nama_pekerjaan,
        deskripsi,
        id_jurusan: id_jurusan ? Number(id_jurusan) : null,
        id_pembimbing: id_pembimbing ? Number(id_pembimbing) : null,
        ...(gambarBaru && { gambar_pekerjaan: gambarBaru }),
      },
    });

    return true;
  } catch (err) {
    throw err;
  }
};

// 🔹 DELETE pembinat
exports.deletePembinat = async (id) => {
  try {
    const existing = await prisma.pembinatPekerjaan.findUnique({
      where: { id_pekerjaan: Number(id) },
    });
    if (!existing) return null;

    await prisma.pembinatPekerjaan.delete({
      where: { id_pekerjaan: Number(id) },
    });

    // hapus file gambar jika ada
    if (existing.gambar_pekerjaan) {
      const filePath = path.join(uploadDir, existing.gambar_pekerjaan);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn("⚠️ Gagal hapus file:", e);
        }
      }
    }

    return true;
  } catch (err) {
    throw err;
  }
};