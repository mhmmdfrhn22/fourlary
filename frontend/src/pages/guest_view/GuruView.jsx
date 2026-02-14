'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export default function GuruView() {
  const [guruData, setGuruData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://backend-fourlary-production.up.railway.app/api/guru')
        if (!res.ok) throw new Error('Gagal mengambil data guru')
        const data = await res.json()

        // Normalisasi agar struktur datanya konsisten
        const mapped = Array.isArray(data)
          ? data.map((g) => ({
              id: g.id,
              nama: g.nama_guru || g.nama,
              mapel: g.mata_pelajaran || g.mapel,
              deskripsi: g.deskripsi || '',
              sosmed: g.link_sosial_media || g.sosmed || '',
              foto: g.foto_guru || g.foto || '',
            }))
          : []

        setGuruData(mapped)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalPages = Math.max(1, Math.ceil(guruData.length / pageSize))
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return guruData.slice(start, start + pageSize)
  }, [currentPage, guruData])

  // ✅ Fix: kalau foto Cloudinary langsung pakai URL aslinya
  const safeSrc = (path) => {
    if (!path || path.trim() === '') {
      return 'https://backend-fourlary-production.up.railway.app/uploads/guru/placeholder-guru.png'
    }
    return path.startsWith('http')
      ? path
      : `https://backend-fourlary-production.up.railway.app/uploads/guru/${path}`
  }

  if (loading)
    return <p className="text-gray-500 text-center py-10">Memuat data guru...</p>

  if (error)
    return (
      <p className="text-red-500 text-center py-10">
        Terjadi kesalahan: {error}
      </p>
    )

  return (
    <div className="p-6 flex flex-col items-center gap-10 max-w-6xl mx-auto">
      {/* Judul */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Guru</h1>
        <p className="text-gray-500 text-sm">
          Kenali para guru yang menginspirasi dan membimbing setiap langkah siswa.
        </p>
      </div>

      {/* Grid Guru */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pageItems.map((guru) => (
          <Card
            key={guru.id}
            className="p-1 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="w-full h-[220px] rounded-xl overflow-hidden bg-gray-50">
                <img
                  src={safeSrc(guru.foto)}
                  alt={guru.nama}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <h3 className="font-semibold text-[15px] mt-4 flex items-center gap-1 justify-center text-gray-800">
                <span>{guru.nama}</span>
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </h3>

              <p className="text-gray-500 text-[13px] mt-1 leading-tight min-h-[38px]">
                {guru.deskripsi || 'Tidak ada deskripsi.'}
              </p>

              {guru.sosmed && (
                <a
                  href={guru.sosmed}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full"
                >
                  <Button className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm">
                    Lihat Sosial Media
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Sebelumnya
        </Button>

        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  )
}
