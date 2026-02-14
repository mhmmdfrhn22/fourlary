"use client"

import * as React from "react"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
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

// API URL
const API_URL = "https://backend-fourlary-production.up.railway.app/api/kategori"

export default function ManajemenKategori() {
  const [data, setData] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [editingKategori, setEditingKategori] = React.useState(null)

  // Kontrol dialog tambah
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)

  // Loading state untuk tombol submit
  const [addLoading, setAddLoading] = React.useState(false)
  const [editLoading, setEditLoading] = React.useState(false)

  // === FETCH KATEGORI (bisa dipanggil ulang kapan saja)
  const fetchKategori = async () => {
    try {
      const res = await fetch(API_URL)
      const kategori = await res.json()

      if (!Array.isArray(kategori)) {
        console.error("API tidak mengembalikan array:", kategori)
        setData([])
        return
      }

      setData(kategori)
    } catch (err) {
      console.error("Fetch kategori error:", err?.message || err)
      setData([])
    }
  }

  // Load awal
  React.useEffect(() => {
    fetchKategori()
  }, [])

  // Filter pencarian
  const filteredData = data.filter((kat) =>
    kat.judul.toLowerCase().includes(search.toLowerCase())
  )

  // === TAMBAH KATEGORI
  const handleAddSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const judul = formData.get("judul")

    try {
      setAddLoading(true)
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul }),
      })

      if (!res.ok) throw new Error("Gagal menambah kategori")

      // refresh data dari server
      await fetchKategori()

      // reset form & tutup dialog
      e.target.reset()
      setAddDialogOpen(false)

      Swal.fire("Tersimpan!", "Kategori berhasil ditambahkan.", "success")
    } catch (err) {
      console.error("Add kategori error:", err)
      Swal.fire("Error", "Gagal menambah kategori.", "error")
    } finally {
      setAddLoading(false)
    }
  }

  // === EDIT KATEGORI
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const judul = formData.get("judul")

    if (!editingKategori) return

    try {
      setEditLoading(true)
      const res = await fetch(`${API_URL}/${editingKategori.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul }),
      })

      if (!res.ok) throw new Error("Gagal update kategori")

      await fetchKategori()
      setEditingKategori(null) // ini juga menutup dialog edit karena open controlled via editingKategori
      Swal.fire("Tersimpan!", "Kategori berhasil diperbarui.", "success")
    } catch (err) {
      console.error("Edit kategori error:", err)
      Swal.fire("Error", "Gagal memperbarui kategori.", "error")
    } finally {
      setEditLoading(false)
    }
  }

  // === HAPUS KATEGORI
  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin mau hapus?",
      text: "Kategori ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`${API_URL}/${id}`, { method: "DELETE" })
          await fetchKategori()
          Swal.fire("Terhapus!", "Kategori berhasil dihapus.", "success")
        } catch (err) {
          console.error("Delete kategori error:", err)
          Swal.fire("Error", "Gagal menghapus kategori.", "error")
        }
      }
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">Tabel Manajemen Kategori</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9"
          />
        </div>

        {/* Tambah kategori (Dialog controlled) */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-9">+ Tambah Kategori</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kategori</DialogTitle>
              <DialogDescription>
                Isi judul kategori baru yang ingin ditambahkan.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="judul">Judul</Label>
                  <Input id="judul" name="judul" required />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" disabled={addLoading}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={addLoading}>
                  {addLoading ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-[500px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead className="w-[200px] text-left">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((kat, index) => (
              <TableRow key={kat.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{kat.judul}</TableCell>
                <TableCell className="space-x-2">
                  {/* EDIT (masih controlled via editingKategori) */}
                  <Dialog
                    open={editingKategori?.id === kat.id}
                    onOpenChange={(open) => setEditingKategori(open ? kat : null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-blue-600"
                        onClick={() => setEditingKategori(kat)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Kategori</DialogTitle>
                        <DialogDescription>
                          Ubah judul kategori.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleEditSubmit}>
                        <div className="grid gap-4 py-2">
                          <div className="grid gap-2">
                            <Label htmlFor={`judul-${kat.id}`}>Judul</Label>
                            <Input
                              id={`judul-${kat.id}`}
                              name="judul"
                              defaultValue={editingKategori?.judul}
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" disabled={editLoading}>Cancel</Button>
                          </DialogClose>
                          <Button type="submit" disabled={editLoading}>
                            {editLoading ? "Menyimpan..." : "Simpan"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* HAPUS */}
                  <Button
                    variant="link"
                    size="sm"
                    className="text-red-600"
                    onClick={() => handleDelete(kat.id)}
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
  )
}
