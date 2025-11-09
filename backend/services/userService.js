const prisma = require('../config/db'); // pastikan ini import PrismaClient instance

// ✅ CREATE user
exports.createUser = async (username, hashedPassword, role_id) => {
  const result = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role_id,
    },
  });
  return result;
};

// ✅ GET user by username
exports.getUserByUsername = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  return user;
};

// ✅ GET semua user
exports.getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: { role: true }, // optional: ikutkan relasi role
    orderBy: { id: 'asc' },
  });
  return users;
};

// ✅ GET user by id
exports.getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { role: true },
  });
  return user;
};

// ✅ UPDATE user
exports.updateUser = async (id, username, hashedPassword, role_id) => {
  const result = await prisma.user.update({
    where: { id: Number(id) },
    data: {
      username,
      password: hashedPassword,
      role_id,
    },
  });
  return result;
};

// ✅ DELETE user
exports.deleteUser = async (id) => {
  const result = await prisma.user.delete({
    where: { id: Number(id) },
  });
  return result;
};

// ✅ COUNT semua user
exports.getUsersCount = async () => {
  const count = await prisma.user.count();
  return count;
};

// ✅ COUNT tim publikasi (role_id = 3)
exports.getPublikasiTeamCount = async () => {
  const count = await prisma.user.count({
    where: { role_id: 3 },
  });
  return count;
};

// ✅ Statistik user berdasarkan tanggal (range 7/14/30 hari)
exports.getUserStats = async (range = '7d') => {
  let interval = 7;
  if (range === '14d') interval = 14;
  else if (range === '30d') interval = 30;

  const rows = await prisma.$queryRaw`
    SELECT DATE(created_at) AS date, COUNT(*) AS total
    FROM user
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ${interval} DAY)
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;
  return rows;
};