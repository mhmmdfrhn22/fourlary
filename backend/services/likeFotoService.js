const prisma = require("../config/db");

// ==============================
// Dapatkan jumlah like untuk satu foto
// ==============================
exports.getLikeCount = async (id_foto) => {
  const count = await prisma.likeFoto.count({
    where: { id_foto: Number(id_foto) },
  });
  return { total_like: count };
};

// ==============================
// Dapatkan jumlah total like di semua foto yang diupload user
// ==============================
exports.getLikeCountByUser = async (user_id) => {
  const total = await prisma.likeFoto.count({
    where: {
      foto: {
        diupload_oleh: Number(user_id),
      },
    },
  });
  return { total };
};

// ==============================
// Statistik like berdasarkan tanggal (interval dalam hari)
// ==============================
exports.getLikeStats = async (userId, interval) => {
  // Ambil semua like di foto yang diupload oleh user dalam rentang waktu tertentu
  const since = new Date();
  since.setDate(since.getDate() - interval);

  const likes = await prisma.likeFoto.groupBy({
    by: ["tanggal_like"],
    _count: { id_like: true },
    where: {
      foto: { diupload_oleh: Number(userId) },
      tanggal_like: { gte: since },
    },
    orderBy: { tanggal_like: "asc" },
  });

  return likes.map((l) => ({
    date: l.tanggal_like.toISOString().split("T")[0],
    total: l._count.id_like,
  }));
};

// ==============================
// Cek apakah user sudah like foto tertentu
// ==============================
exports.checkUserLike = async (id_foto, id_user) => {
  const like = await prisma.likeFoto.findUnique({
    where: {
      id_foto_id_user: {
        id_foto: Number(id_foto),
        id_user: Number(id_user),
      },
    },
  });
  return like ? true : false;
};

// ==============================
// Tambahkan like baru (hindari duplikasi otomatis oleh Prisma)
// ==============================
exports.addLike = async (id_foto, id_user) => {
  try {
    const like = await prisma.likeFoto.create({
      data: {
        id_foto: Number(id_foto),
        id_user: Number(id_user),
      },
    });
    return { success: true, like };
  } catch (err) {
    if (err.code === "P2002") {
      // Unique constraint failed (user sudah like)
      return { success: false, message: "User sudah memberikan like" };
    }
    throw err;
  }
};

// ==============================
// Hapus like
// ==============================
exports.removeLike = async (id_foto, id_user) => {
  await prisma.likeFoto.delete({
    where: {
      id_foto_id_user: {
        id_foto: Number(id_foto),
        id_user: Number(id_user),
      },
    },
  });
  return { success: true };
};

// ==============================
// Alias fungsi checkLike (sama seperti checkUserLike)
// ==============================
exports.checkLike = async (id_foto, id_user) => {
  return await exports.checkUserLike(id_foto, id_user);
};