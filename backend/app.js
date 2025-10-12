require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// Middleware umum
app.use(cors());
app.use(express.json());

// ✅ Static folder untuk file upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import semua routes
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');
const kategoriRoutes = require('./routes/kategori');
const postsRoutes = require('./routes/posts');
const profileRoutes = require('./routes/profile');
const jurusanRoutes = require("./routes/jurusanRoutes");
const pembimbingRoutes = require("./routes/pembimbingRoutes");
const pembinatRoutes = require("./routes/pembinatRoutes");
const uploadRoutes = require('./routes/upload');
const fotoRoutes = require('./routes/fotoRoutes');
const kategoriFotoRoutes = require('./routes/kategoriFotoRoutes');
const komentarFotoRoutes = require('./routes/komentarFotoRoutes');
const likeFotoRoutes = require('./routes/likeFotoRoutes');
const guruRoutes = require('./routes/guruRoute');

// Gunakan routes
app.use('/api/komentar-foto', komentarFotoRoutes);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', userRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/profile', profileRoutes);
app.use("/api/jurusan", jurusanRoutes);
app.use("/api/pembimbing", pembimbingRoutes);
app.use("/api/pembinat", pembinatRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/foto', fotoRoutes);
app.use('/api/kategori-foto', kategoriFotoRoutes);
app.use('/api/komentar-foto', komentarFotoRoutes);
app.use('/api/like-foto', likeFotoRoutes);
app.use('/api/guru', guruRoutes); 

// Jalankan server
app.listen(port, () => {
  console.log(`✅ Server berjalan di http://localhost:${port}`);
  console.log('Cihuyyyy 🚀');
});