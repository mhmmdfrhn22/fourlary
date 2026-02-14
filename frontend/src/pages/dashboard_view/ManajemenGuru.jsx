"use client"

import * as React from "react"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Swal from "sweetalert2"

const API_URL = "https://backend-fourlary-production.up.railway.app/api/guru"

export default function ManajemenGuru() {
  const [data, setData] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [editingGuru, setEditingGuru] = React.useState(null)
  const [openAddDialog, setOpenAddDialog] = React.useState(false)
  const [loading, setLoading] = React.useState(false) // 🌀 Loading state baru

  // Ambil data guru dari backend
  const fetchGuru = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_URL)
      let guruList = await res.json()

      if (Array.isArray(guruList)) {
        guruList = guruList.map((g) => ({
          id: g.id,
          nama: g.nama_guru,
          mapel: g.mata_pelajaran,
          deskripsi: g.deskripsi,
          sosmed: g.link_sosial_media,
          foto: g.foto_guru,
        }))
        setData(guruList)
      }
    } catch (err) {
      console.error("Fetch guru error:", err.message)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchGuru()
  }, [])

  // Filter data
  const filteredData = data.filter((g) =>
    (g.nama || "").toLowerCase().includes(search.toLowerCase())
  )

  // Tambah guru
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // ✅ Tutup dialog langsung ketika tombol Simpan diklik
    setOpenAddDialog(false);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Gagal menambah guru");

      await res.json();
      await fetchGuru(); // 🔄 Refresh data
      Swal.fire("Berhasil!", "Guru baru berhasil ditambahkan.", "success");
      e.target.reset();
    } catch (err) {
      console.error("Add guru error:", err);
      Swal.fire("Error", "Gagal menambahkan guru.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Edit guru
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // ✅ Tutup dialog langsung ketika tombol Simpan diklik
    setEditingGuru(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/${editingGuru.id}`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) throw new Error("Gagal update guru");

      await res.json();
      await fetchGuru();
      Swal.fire("Tersimpan!", "Data guru berhasil diperbarui.", "success");
    } catch (err) {
      console.error("Edit guru error:", err);
      Swal.fire("Error", "Gagal memperbarui guru.", "error");
    } finally {
      setLoading(false);
    }
  };


  // Hapus guru
  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin mau hapus?",
      text: "Data guru tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true)
          await fetch(`${API_URL}/${id}`, { method: "DELETE" })
          setData(data.filter((g) => g.id !== id))
          Swal.fire("Terhapus!", "Data guru berhasil dihapus.", "success")
        } catch (err) {
          console.error("Delete guru error:", err)
        } finally {
          setLoading(false)
        }
      }
    })
  }

  return (
    <div className="relative">
      {/* 🌀 Overlay Loading */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-all">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-2" />
          <p className="text-sm text-gray-600 animate-pulse">Memproses data...</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold">Tabel Manajemen Guru</h2>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tambah Guru */}
            <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus size={16} /> Tambahkan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Guru</DialogTitle>
                  <DialogDescription>Masukkan data guru baru.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSubmit}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nama_guru">Nama Guru</Label>
                      <Input id="nama_guru" name="nama_guru" required />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="mata_pelajaran">Mata Pelajaran</Label>
                      <Input id="mata_pelajaran" name="mata_pelajaran" required />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="deskripsi">Deskripsi</Label>
                      <textarea
                        id="deskripsi"
                        name="deskripsi"
                        required
                        className="border rounded-md p-2 h-24"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="link_sosial_media">Link Sosial Media</Label>
                      <Input id="link_sosial_media" name="link_sosial_media" placeholder="https://instagram.com/..." />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="foto_guru">Foto Guru</Label>
                      <Input id="foto_guru" name="foto_guru" type="file" accept="image/*" />
                    </div>
                  </div>

                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Simpan</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Cari guru..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Guru</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Sosial Media</TableHead>
                <TableHead>Foto</TableHead>
                <TableHead className="text-left">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((guru, index) => (
                <TableRow key={guru.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{guru.nama}</TableCell>
                  <TableCell>{guru.mapel}</TableCell>
                  <TableCell>{guru.deskripsi}</TableCell>
                  <TableCell>
                    {guru.sosmed ? (
                      <a href={guru.sosmed} target="_blank" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {guru.foto ? (
                      <img
                        src={
                          guru.foto?.startsWith("http")
                            ? guru.foto
                            : `https://backend-fourlary-production.up.railway.app/uploads/guru/${guru.foto}`
                        }
                        alt={guru.nama}
                        className="h-14 w-20 object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-400">Tidak ada</span>
                    )}
                  </TableCell>

                  <TableCell className="space-x-2">
                    {/* Edit */}
                    <Dialog
                      open={editingGuru?.id === guru.id}
                      onOpenChange={(open) => {
                        if (!open) setEditingGuru(null); // ✅ Tutup dialog manual
                        else setEditingGuru(guru);
                      }}
                    >

                      <DialogTrigger asChild>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-blue-600"
                          onClick={() => setEditingGuru(guru)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Guru</DialogTitle>
                          <DialogDescription>Ubah data guru.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit}>
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="nama_guru">Nama Guru</Label>
                              <Input id="nama_guru" name="nama_guru" defaultValue={editingGuru?.nama} required />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="mata_pelajaran">Mata Pelajaran</Label>
                              <Input id="mata_pelajaran" name="mata_pelajaran" defaultValue={editingGuru?.mapel} required />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="deskripsi">Deskripsi</Label>
                              <textarea
                                id="deskripsi"
                                name="deskripsi"
                                defaultValue={editingGuru?.deskripsi}
                                className="border rounded-md p-2 h-24"
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="link_sosial_media">Link Sosial Media</Label>
                              <Input
                                id="link_sosial_media"
                                name="link_sosial_media"
                                defaultValue={editingGuru?.sosmed}
                                placeholder="https://instagram.com/..."
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="foto_guru">Foto Guru</Label>
                              <Input id="foto_guru" name="foto_guru" type="file" accept="image/*" />
                              {editingGuru?.foto && (
                                <img
                                  src={
                                    editingGuru.foto?.startsWith("http")
                                      ? editingGuru.foto
                                      : `https://backend-fourlary-production.up.railway.app/uploads/guru/${editingGuru.foto}`
                                  }
                                  alt="preview"
                                  className="h-20 w-28 object-cover rounded-md mt-2"
                                />
                              )}
                            </div>
                          </div>

                          <DialogFooter className="mt-4">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Simpan</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>

                    {/* Hapus */}
                    <Button
                      variant="link"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDelete(guru.id)}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
