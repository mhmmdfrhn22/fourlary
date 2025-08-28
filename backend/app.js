require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

// Import dan pasang route Role
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');
const kategoriRoutes = require('./routes/kategori');
const postsRoutes = require('./routes/posts');
const galeryRoutes = require('./routes/galery');
const fotoRoutes = require('./routes/foto');
const profileRoutes = require('./routes/profile');
const pembinatJurusanRoutes = require('./routes/pembinatJurusan');
const pembinatLoreRoutes = require('./routes/pembinatLore');
const pembinatAhliRoutes = require('./routes/pembinatAhli');

// Import dan pasang route Role
app.use('/api/user', userRoutes);   
app.use('/api/role', roleRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/galery', galeryRoutes);
app.use('/api/foto', fotoRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/pembinat-jurusan', pembinatJurusanRoutes);
app.use('/api/pembinat-lore', pembinatLoreRoutes);
app.use('/api/pembinat-ahli', pembinatAhliRoutes);

app.listen(3000, () => console.log('Cihuyyyy'));
