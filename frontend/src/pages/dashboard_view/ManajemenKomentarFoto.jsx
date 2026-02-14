"use client"

import * as React from "react"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Swal from "sweetalert2"

const API_URL = "https://backend-fourlary-production.up.railway.app/api/komentar-foto"

export default function ManajemenKomentarFoto() {
  const [data, setData] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  // 🔹 Fetch semua komentar
  React.useEffect(() => {
    const fetchKomentar = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        let url = API_URL;

        // 🔹 Kalau PDD → ambil hanya komentar di foto miliknya
        if (user?.role === "pdd" || user?.role_id === 3) {
          url += `?uploader_id=${user.id}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Gagal memuat data komentar");
        const komentar = await res.json();
        if (Array.isArray(komentar)) setData(komentar);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKomentar();
  }, []);


  // 🔎 Filter by search
  const filteredData = data.filter(
    (komen) =>
    (komen.username?.toLowerCase().includes(search.toLowerCase()) ||
      komen.isi_komentar?.toLowerCase().includes(search.toLowerCase()))
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  // 🔹 Hapus komentar
  const handleDelete = React.useCallback((id_komentar) => {
    Swal.fire({
      title: "Yakin mau hapus komentar ini?",
      text: "Komentar yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_URL}/${id_komentar}`, { method: "DELETE" })
          if (!res.ok) throw new Error("Gagal menghapus komentar")
          setData((prev) => prev.filter((komen) => komen.id_komentar !== id_komentar))
          Swal.fire("Terhapus!", "Komentar berhasil dihapus.", "success")
        } catch (err) {
          console.error(err)
          Swal.fire("Gagal!", err.message, "error")
        }
      }
    })
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">Tabel Manajemen Komentar Galeri</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari komentar atau pengguna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center py-6 text-gray-500">Loading komentar...</p>
      ) : error ? (
        <p className="text-center py-6 text-red-500">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Nama Pengguna</TableHead>
                  <TableHead>Isi Komentar</TableHead>
                  <TableHead>Foto</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="w-[150px] text-left">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((komen, index) => (
                  <TableRow key={komen.id_komentar || index}>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>{komen.username || "Anonim"}</TableCell>
                    <TableCell>{komen.isi_komentar}</TableCell>
                    <TableCell>{komen.nama_foto || `#${komen.id_foto}`}</TableCell>
                    <TableCell>
                      {komen.tanggal_komentar
                        ? new Date(komen.tanggal_komentar).toLocaleDateString("id-ID")
                        : "-"}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="link"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDelete(komen.id_komentar)}
                      >
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
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
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
