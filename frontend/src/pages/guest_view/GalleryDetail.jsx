import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function GalleryDetail() {
  const { id } = useParams();
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = `https://backend-fourlary-production.up.railway.app/api/foto/${id}`;

  useEffect(() => {
    fetchFoto();
  }, []);

  const fetchFoto = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Gagal memuat data foto");
      const data = await res.json();
      setFoto(data);
    } catch (err) {
      console.error("Gagal memuat detail foto:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Efek loading dengan skeleton + spinner
  if (loading)
    return (
      <div className="w-full h-[70vh] flex flex-col items-center justify-center text-gray-600">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mb-4"></div>
        <p className="text-sm font-medium animate-pulse">
          Memuat detail foto...
        </p>
      </div>
    );

  if (!foto)
    return (
      <div className="w-full h-[50vh] flex justify-center items-center text-gray-500 text-lg">
        Foto tidak ditemukan.
      </div>
    );

  return (
    <div className="container mx-auto px-6 sm:px-10 lg:px-24 py-10">
      <Link
        to="/galeri"
        className="text-blue-600 hover:underline mb-6 inline-block text-sm font-medium"
      >
        ← Kembali ke Galeri
      </Link>

      <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
        <img
          src={foto.url_foto} // ✅ langsung pakai URL dari Cloudinary
          alt={foto.deskripsi || "Foto Galeri"}
          className="w-full max-h-[70vh] object-cover"
        />
      </div>

      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {foto.deskripsi || "Tanpa Deskripsi"}
        </h1>
        <p className="text-gray-600 text-sm mb-2">
          📸 Diunggah oleh{" "}
          <span className="font-medium text-gray-800">
            {foto.uploader?.username || "Admin"}
          </span>
        </p>
        {foto.kategori && (
          <p className="text-gray-500 text-sm italic">
            Kategori: {foto.kategori?.nama_kategori}
          </p>
        )}
      </div>
    </div>
  );
}
