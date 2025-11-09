const prisma = require("../config/db");
const path = require("path");
const fs = require("fs");

// ==============================
// AMBIL SEMUA POST (opsional filter by user_id)
// ==============================
exports.getAllPosts = async (user_id) => {
  const where = user_id ? { user_id: Number(user_id) } : {};

  const posts = await prisma.post.findMany({
    where,
    include: {
      kategori: { select: { judul: true } },
      user: { select: { username: true } },
    },
    orderBy: { created_at: "desc" },
  });

  return posts.map((p) => ({
    id: p.id,
    judul: p.judul,
    isi: p.isi,
    foto: p.foto,
    status: p.status,
    created_at: p.created_at,
    updated_at: p.updated_at,
    kategori: p.kategori?.judul || "-",
    penulis: p.user?.username || "-",
  }));
};

// ==============================
// AMBIL POST BY ID
// ==============================
exports.getPostById = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      kategori: { select: { judul: true } },
      user: { select: { username: true } },
    },
  });

  if (!post) return null;

  return {
    id: post.id,
    judul: post.judul,
    isi: post.isi,
    foto: post.foto,
    status: post.status,
    created_at: post.created_at,
    updated_at: post.updated_at,
    kategori: post.kategori?.judul || "-",
    penulis: post.user?.username || "-",
  };
};

// ==============================
// TAMBAH POST BARU
// ==============================
exports.createPost = async (data) => {
  const { judul, kategori_id, isi, user_id, status, foto } = data;

  const newPost = await prisma.post.create({
    data: {
      judul,
      kategori_id: Number(kategori_id),
      isi,
      user_id: Number(user_id),
      status: status || "draft",
      foto: foto || null,
    },
  });

  return newPost;
};

// ==============================
// UPDATE POST
// ==============================
exports.updatePost = async (id, data) => {
  const { judul, kategori_id, isi, user_id, status, foto } = data;

  const existing = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!existing) throw new Error("Post tidak ditemukan");

  // Hapus foto lama jika diganti
  if (foto && existing.foto && foto !== existing.foto) {
    const oldPath = path.join(__dirname, "../uploads/berita", existing.foto);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  const updated = await prisma.post.update({
    where: { id: Number(id) },
    data: {
      judul,
      kategori_id: Number(kategori_id),
      isi,
      user_id: Number(user_id),
      status,
      foto: foto || existing.foto,
    },
  });

  return updated;
};

// ==============================
// HAPUS POST
// ==============================
exports.deletePost = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) return { notFound: true };

  if (post.foto) {
    const fotoPath = path.join(__dirname, "../uploads/berita", post.foto);
    if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
  }

  await prisma.post.delete({
    where: { id: Number(id) },
  });

  return { success: true };
};

// ==============================
// HITUNG JUMLAH POST PUBLISHED
// ==============================
exports.getPostsCount = async () => {
  const count = await prisma.post.count({
    where: { status: "published" },
  });
  return count;
};

// ==============================
// HITUNG JUMLAH POST OLEH USER
// ==============================
exports.getPostCountByUser = async (user_id) => {
  const count = await prisma.post.count({
    where: { user_id: Number(user_id) },
  });
  return count;
};

// ==============================
// AMBIL POST OLEH USER
// ==============================
exports.getPostsByUser = async (user_id) => {
  const posts = await prisma.post.findMany({
    where: { user_id: Number(user_id) },
    orderBy: { id: "desc" },
  });
  return posts;
};