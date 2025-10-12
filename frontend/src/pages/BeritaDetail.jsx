import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BeritaDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [berita, setBerita] = useState(null)
  const [beritaTerkini, setBeritaTerkini] = useState([])
  const [loading, setLoading] = useState(true)

  const safeSrc = (path) =>
    path
      ? `http://localhost:3000/uploads/berita/${path}`
      : "http://localhost:3000/uploads/placeholder-berita.png"

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Detail berita
        const res = await fetch(`http://localhost:3000/api/posts/${id}`)
        const data = await res.json()
        setBerita(data)

        // Berita terkini
        const resAll = await fetch("http://localhost:3000/api/posts")
        const allData = await resAll.json()
        setBeritaTerkini(allData.slice(0, 3)) // ambil 3 berita terbaru
      } catch (err) {
        console.error("Gagal mengambil data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500">Memuat berita...</p>
      </div>
    )
  }

  if (!berita) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500">Berita tidak ditemukan</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* === KONTEN BERITA === */}
      <div className="lg:col-span-2">
        <Card className="shadow-sm border border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            {/* Gambar Utama */}
            <div className="w-full h-[320px] sm:h-[400px] overflow-hidden rounded-2xl">
              <img
                src={safeSrc(berita.foto)}
                alt={berita.judul}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Judul */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-6 mb-3 leading-snug">
              {berita.judul}
            </h1>

            {/* Info Penulis & Kategori */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-6">
              <div className="flex items-center gap-1">
                <span className="font-semibold">{berita.penulis}</span>
              </div>
              <span className="text-gray-400">|</span>
              <span>
                {new Date(berita.created_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {berita.kategori && (
                <span className="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {berita.kategori}
                </span>
              )}
            </div>

            {/* Isi Berita */}
            <div
              className="text-gray-700 leading-relaxed text-[15px] sm:text-base"
              dangerouslySetInnerHTML={{ __html: berita.isi }}
            />

            <Button
              className="mt-8 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm"
              onClick={() => navigate("/BeritaView")}
            >
              ← Kembali ke Berita
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* === SIDEBAR BERITA TERKINI === */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Berita Terkini
        </h3>
        {beritaTerkini.map((item) => (
          <Card
            key={item.id}
            className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <CardContent className="p-0">
              <div className="relative w-full h-[150px] bg-gray-100 overflow-hidden">
                <img
                  src={safeSrc(item.foto)}
                  alt={item.judul}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-white text-gray-800 text-[12px] font-semibold px-3 py-1 rounded-full shadow-sm">
                  {item.kategori || "Umum"}
                </span>
              </div>

              <div className="p-4">
                <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">
                  {item.judul}
                </h4>
                <p className="text-gray-500 text-xs mt-1 line-clamp-3">
                  {item.isi?.slice(0, 90)}...
                </p>

                <Button
                  className="mt-3 w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs"
                  onClick={() => navigate(`/berita/${item.id}`)}
                >
                  Baca Selengkapnya →
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}