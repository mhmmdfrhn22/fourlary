import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { useNavigate } from "react-router-dom"

export default function BeritaView() {
  const [beritaData, setBeritaData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [kategoriFilter, setKategoriFilter] = useState("Semua")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const res = await fetch("https://backend-fourlary-production.up.railway.app/api/posts")
        const data = await res.json()
        const publishedOnly = data.filter(
          (item) => item.status?.toLowerCase() === "published"
        )
        setBeritaData(publishedOnly)
      } catch (error) {
        console.error("Gagal mengambil data berita:", error)
      }
    }
    fetchBerita()
  }, [])

  const safeSrc = (fotoPath) => {
    if (!fotoPath) {
      return "https://res.cloudinary.com/dprywyfwm/image/upload/v1762822108/uploads/placeholder-berita.png";
    }

    if (fotoPath.startsWith("https://res.cloudinary.com")) {
      return fotoPath;
    }

    // fallback kalau backend cuma kirim nama file
    return `https://res.cloudinary.com/dprywyfwm/image/upload/v1762826959/uploads/berita/${fotoPath}`;
  };

  const filteredBerita = useMemo(() => {
    return beritaData.filter((b) => {
      const cocokSearch =
        b.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.isi.toLowerCase().includes(searchTerm.toLowerCase())
      const cocokKategori =
        kategoriFilter === "Semua" || b.kategori === kategoriFilter
      return cocokSearch && cocokKategori
    })
  }, [beritaData, searchTerm, kategoriFilter])

  const totalPages = Math.max(1, Math.ceil(filteredBerita.length / pageSize))
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredBerita.slice(start, start + pageSize)
  }, [currentPage, filteredBerita])

  const kategoriList = useMemo(() => {
    const all = beritaData.map((b) => b.kategori).filter(Boolean)
    return ["Semua", ...new Set(all)]
  }, [beritaData])

  return (
    <div className="container mx-auto px-6 sm:px-10 lg:px-24 py-10">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Berita Sekolah
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            placeholder="Cari berita..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:w-[240px]"
          />
          <Select value={kategoriFilter} onValueChange={setKategoriFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {kategoriList.map((kat) => (
                <SelectItem key={kat} value={kat}>
                  {kat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid Berita */}
      {pageItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pageItems.map((berita) => (
            <Card
              key={berita.id}
              className="p-0 rounded-2xl border border-gray-100 hover:shadow-lg transition-all bg-white"
            >
              <CardContent className="p-5 flex flex-col text-left">
                <div className="relative w-full h-[250px] rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={
                      berita.url_foto
                        ? berita.url_foto
                        : safeSrc(berita.foto)
                    }
                    alt={berita.judul}
                    className="w-full h-full object-cover"
                  />

                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm border border-gray-200">
                    {berita.kategori || "Umum"}
                  </span>
                </div>

                <h3 className="font-semibold text-[16px] mt-3 line-clamp-2 text-gray-900">
                  {berita.judul}
                </h3>
                <p className="text-gray-500 text-[14px] mt-1 line-clamp-3">
                  {berita.isi?.slice(0, 100)}...
                </p>

                <Button
                  className="mt-4 w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                  onClick={() => navigate(`/berita/${berita.id}`)}
                >
                  Baca Selengkapnya →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-10">
          Tidak ada berita ditemukan.
        </p>
      )}

      {/* Pagination */}
      {filteredBerita.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ‹ Sebelumnya
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Selanjutnya ›
          </Button>
        </div>
      )}
    </div>
  )
}
