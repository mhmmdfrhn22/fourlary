import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function GalleryDetail() {
  const { id } = useParams();
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = `http://localhost:3000/api/foto/${id}`;

  useEffect(() => {
    fetchFoto();
  }, []);

  const fetchFoto = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setFoto(data);
      setLoading(false);
    } catch (err) {
      console.error("Gagal memuat detail foto:", err);
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="w-full h-[50vh] flex justify-center items-center text-gray-500 text-lg">
        Memuat detail foto...
      </div>
    );

  if (!foto)
    return (
      <div className="w-full h-[50vh] flex justify-center items-center text-gray-500 text-lg">
        Foto tidak ditemukan.
      </div>
    );

  return (
    <div className="container mx-auto px-8 sm:px-12 lg:px-24 py-8">
      <Link
        to="/galeri"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Kembali ke Galeri
      </Link>

      <div className="rounded-xl overflow-hidden shadow-lg">
        <img
          src={`http://localhost:3000/uploads/galeri/${foto.url_foto}`}
          alt={foto.judul}
          className="w-full max-h-[70vh] object-cover"
        />
      </div>

      <h1 className="text-2xl font-bold mt-4">{foto.judul}</h1>
      <p className="text-gray-600 mt-1">📸 {foto.nama_uploader}</p>
      <p className="mt-3 text-gray-700">{foto.deskripsi || "Tidak ada deskripsi."}</p>
    </div>
  );
}

export default GalleryDetail;