const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads/pembimbing");

// 🔹 Ambil semua pembimbing
exports.getAllPembimbing = async () => {
  try {
    const pembimbing = await prisma.pembimbingProfile.findMany({
      orderBy: { nama: "asc" },
    });
    return pembimbing;
  } catch (err) {
    throw err;
  }
};

// 🔹 Ambil pembimbing berdasarkan ID
exports.getPembimbingById = async (id) => {
  try {
    const pembimbing = await prisma.pembimbingProfile.findUnique({
      where: { id_pembimbing: Number(id) },
    });
    return pembimbing;
  } catch (err) {
    throw err;
  }
};

// 🔹 Tambah pembimbing baru
exports.createPembimbing = async (data) => {
  try {
    const pembimbing = await prisma.pembimbingProfile.create({
      data: {
        nama: data.nama,
        nomor_wa: data.nomor_wa,
        link_wa: data.link_wa,
        foto_pembimbing: data.foto_pembimbing,
        jabatan: data.jabatan,
        deskripsi: data.deskripsi,
      },
    });
    return pembimbing.id_pembimbing;
  } catch (err) {
    throw err;
  }
};

// 🔹 Update pembimbing
exports.updatePembimbing = async (id, data) => {
  const { nama, nomor_wa, link_wa, jabatan, deskripsi, fotoBaru } = data;

  try {
    const existing = await prisma.pembimbingProfile.findUnique({
      where: { id_pembimbing: Number(id) },
    });
    if (!existing) return null;

    // hapus foto lama jika ada foto baru
    if (fotoBaru && existing.foto_pembimbing) {
      const oldPath = path.join(uploadDir, existing.foto_pembimbing);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.warn("⚠️ Gagal hapus foto lama:", e);
        }
      }
    }

    await prisma.pembimbingProfile.update({
      where: { id_pembimbing: Number(id) },
      data: {
        nama,
        nomor_wa,
        link_wa,
        jabatan,
        deskripsi,
        ...(fotoBaru && { foto_pembimbing: fotoBaru }),
      },
    });

    return true;
  } catch (err) {
    throw err;
  }
};

// 🔹 Hapus pembimbing
exports.deletePembimbing = async (id) => {
  try {
    const existing = await prisma.pembimbingProfile.findUnique({
      where: { id_pembimbing: Number(id) },
    });
    if (!existing) return null;

    await prisma.pembimbingProfile.delete({
      where: { id_pembimbing: Number(id) },
    });

    // hapus file foto jika ada
    if (existing.foto_pembimbing) {
      const filePath = path.join(uploadDir, existing.foto_pembimbing);
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