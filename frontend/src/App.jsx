import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import GalleryDetail from "./pages/GalleryDetail";
import Contact from "./pages/Contact";
import Visimisi from "./pages/Visimisi";
import GuruView from "./pages/GuruView";
import BeritaView from "./pages/BeritaView";
import PembinatView from "./pages/PembinatView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Dashboard Admin
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import DashboardHomePDD from "./pages/DashboardHomePDD";
import ManajemenUser from "./pages/ManajemenUser";
import ManajemenGaleri from "./pages/ManajemenGaleri";
import ManajemenBerita from "./pages/ManajemenBerita";
import ManajemenKategori from "./pages/ManajemenKategori";
import ManajemenKategoriFoto from "./pages/ManajemenKategoriFoto";
import ManajemenKomentarFoto from "./pages/ManajemenKomentarFoto";
import ManajemenJurusan from "./pages/ManajemenJurusan";
import ManajemenPembimbing from "./pages/ManajemenPembimbing";
import ManajemenPembinat from "./pages/ManajemenPembinat";
import ManajemenGuru from "./pages/ManajemenGuru";

// Dashboard PDD
import DashboardPDD from "./pages/DashboardPDD";

// Komponen lainnya
import ProtectedRoute from "./components/ProtectedRoute";
import BeritaDetail from "./pages/BeritaDetail";
import JurusanSekolah from "./pages/JurusanSekolah";

function App() {
  const location = useLocation();

  // Sembunyikan Navbar & Footer di halaman dashboard, login, register
  const hideLayout =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/dashboard-pdd") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        {/* Halaman Utama */}
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/visimisi" element={<Visimisi />} />
        <Route path="/GuruView" element={<GuruView />} />
        <Route path="/BeritaView" element={<BeritaView />} />
        <Route path="/PembinatView" element={<PembinatView />} />
        <Route path="/JurusanSekolah" element={<JurusanSekolah />} />
        <Route path="/berita/:id" element={<BeritaDetail />} />
        <Route path="/galeri/:id" element={<GalleryDetail />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===================== */}
        {/* DASHBOARD ADMIN (Role 2) */}
        {/* ===================== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={[2]}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="ManajemenUser" element={<ManajemenUser />} />
          <Route path="ManajemenGuru" element={<ManajemenGuru />} />
          <Route path="ManajemenPembinat" element={<ManajemenPembinat />} />
          <Route path="ManajemenJurusan" element={<ManajemenJurusan />} />
          <Route path="ManajemenPembimbing" element={<ManajemenPembimbing />} />
          <Route path="ManajemenGaleri" element={<ManajemenGaleri />} />
          <Route path="ManajemenKategoriFoto" element={<ManajemenKategoriFoto />} />
          <Route path="ManajemenKomentarFoto" element={<ManajemenKomentarFoto />} />
          <Route path="ManajemenBerita" element={<ManajemenBerita />} />
          <Route path="ManajemenKategori" element={<ManajemenKategori />} />
        </Route>

        {/* ===================== */}
        {/* DASHBOARD PDD SEKOLAH (Role 3) */}
        {/* ===================== */}
        <Route
          path="/dashboard-pdd"
          element={
            <ProtectedRoute roles={[3]}>
              <DashboardPDD />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHomePDD />} />
          <Route path="ManajemenGaleri" element={<ManajemenGaleri />} />
          <Route path="ManajemenKategoriFoto" element={<ManajemenKategoriFoto />} />
          <Route path="ManajemenKomentarFoto" element={<ManajemenKomentarFoto />} />
          <Route path="ManajemenBerita" element={<ManajemenBerita />} />
          <Route path="ManajemenKategori" element={<ManajemenKategori />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

export default App;