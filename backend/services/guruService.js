const prisma = require("../config/db");
const path = require("path");
const fs = require("fs");

// ==============================
// AMBIL SEMUA GURU
// ==============================
exports.getAllGuru = async () => {
  const guruList = await prisma.guruInfo.findMany({
    orderBy: { id: "desc" },
  });
  return guruList;
};

// ==============================
// TAMBAH GURU BARU
// ==============================
exports.addGuru = async (data) => {
  const { nama_guru, mata_pelajaran, deskripsi, link_sosial_media, foto_guru } = data;

  const guruBaru = await prisma.guruInfo.create({
    data: {
      nama_guru,
      mata_pelajaran,
      deskripsi: deskripsi || null,
      link_sosial_media: link_sosial_media || null,
      foto_guru: foto_guru || null,
    },
  });

  return guruBaru;
};

// ==============================
// UPDATE GURU
// ==============================
exports.updateGuru = async (id, data) => {
  const { nama_guru, mata_pelajaran, deskripsi, link_sosial_media, foto_guru } = data;

  const existingGuru = await prisma.guruInfo.findUnique({
    where: { id: Number(id) },
  });

  if (!existingGuru) throw new Error("Guru tidak ditemukan");

  // Hapus foto lama jika diganti
  if (foto_guru && existingGuru.foto_guru && foto_guru !== existingGuru.foto_guru) {
    const oldPath = path.join(__dirname, "../uploads/guru", existingGuru.foto_guru);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
      console.log("🗑️ Foto lama dihapus:", oldPath);
    }
  }

  const updatedGuru = await prisma.guruInfo.update({
    where: { id: Number(id) },
    data: {
      nama_guru,
      mata_pelajaran,
      deskripsi,
      link_sosial_media,
      foto_guru: foto_guru || existingGuru.foto_guru,
    },
  });

  return updatedGuru;
};

// ==============================
// AMBIL GURU BERDASARKAN ID
// ==============================
exports.getGuruById = async (id) => {
  const guru = await prisma.guruInfo.findUnique({
    where: { id: Number(id) },
  });
  return guru;
};

// ==============================
// HAPUS GURU (BESERTA FOTO)
// ==============================
exports.deleteGuru = async (id) => {
  const guru = await prisma.guruInfo.findUnique({
    where: { id: Number(id) },
  });

  if (!guru) throw new Error("Guru tidak ditemukan");

  if (guru.foto_guru) {
    const fotoPath = path.join(__dirname, "../uploads/guru", guru.foto_guru);
    if (fs.existsSync(fotoPath)) {
      fs.unlinkSync(fotoPath);
      console.log("🗑️ Foto dihapus:", fotoPath);
    }
  }

  await prisma.guruInfo.delete({
    where: { id: Number(id) },
  });

  return { success: true };
};