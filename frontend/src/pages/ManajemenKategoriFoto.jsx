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

// 🔹 Ganti endpoint ke kategori foto
const API_URL = "http://localhost:3000/api/kategori-foto"

export default function ManajemenKategoriFoto() {
  const [data, setData] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [editingKategori, setEditingKategori] = React.useState(null)

  // 🔹 Fetch kategori foto
  React.useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await fetch(API_URL)
        const kategori = await res.json()
        if (Array.isArray(kategori)) setData(kategori)
      } catch (err) {
        console.error("Fetch kategori foto error:", err.message)
      }
    }
    fetchKategori()
  }, [])

  // 🔎 Filter by search
  const filteredData = data.filter((kat) =>
    (kat.nama_kategori || "").toLowerCase().includes(search.toLowerCase())
  )

  // 🔹 Tambah kategori foto
  const handleAddSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const nama_kategori = formData.get("nama_kategori")

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_kategori }),
      })

      if (!res.ok) throw new Error("Gagal menambah kategori foto")

      const newKat = await res.json()
      setData([...data, newKat])
      Swal.fire("Tersimpan!", "Kategori foto berhasil ditambahkan.", "success")
    } catch (err) {
      console.error("Add kategori foto error:", err)
    }
  }

  // 🔹 Edit kategori foto
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const nama_kategori = formData.get("nama_kategori")

    try {
      const res = await fetch(`${API_URL}/${editingKategori.id_kategori}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_kategori }),
      })

      if (!res.ok) throw new Error("Gagal update kategori foto")

      setData(
        data.map((k) =>
          k.id_kategori === editingKategori.id_kategori ? { ...k, nama_kategori } : k
        )
      )
      setEditingKategori(null)
      Swal.fire("Tersimpan!", "Kategori foto berhasil diperbarui.", "success")
    } catch (err) {
      console.error("Edit kategori foto error:", err)
    }
  }

  // 🔹 Hapus kategori foto
  const handleDelete = (id_kategori) => {
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
          await fetch(`${API_URL}/${id_kategori}`, { method: "DELETE" })
          setData(data.filter((kat) => kat.id_kategori !== id_kategori))
          Swal.fire("Terhapus!", "Kategori foto berhasil dihapus.", "success")
        } catch (err) {
          console.error("Delete kategori foto error:", err)
        }
      }
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">Tabel Manajemen Kategori Foto</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9"
          />
        </div>

        {/* Tambah kategori foto */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-9">+ Tambah Kategori</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kategori Foto</DialogTitle>
              <DialogDescription>
                Masukkan nama kategori foto baru.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="nama_kategori">Nama Kategori</Label>
                  <Input id="nama_kategori" name="nama_kategori" required />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Simpan</Button>
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
              <TableHead>Nama Kategori</TableHead>
              <TableHead className="w-[200px] text-left">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((kat, index) => (
              <TableRow key={kat.id_kategori}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{kat.nama_kategori}</TableCell>
                <TableCell className="space-x-2">
                  {/* Edit */}
                  <Dialog
                    open={editingKategori?.id_kategori === kat.id_kategori}
                    onOpenChange={(open) =>
                      setEditingKategori(open ? kat : null)
                    }
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
                        <DialogTitle>Edit Kategori Foto</DialogTitle>
                        <DialogDescription>
                          Ubah nama kategori foto.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleEditSubmit}>
                        <div className="grid gap-4 py-2">
                          <div className="grid gap-2">
                            <Label htmlFor="nama_kategori">Nama Kategori</Label>
                            <Input
                              id="nama_kategori"
                              name="nama_kategori"
                              defaultValue={editingKategori?.nama_kategori}
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
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
                    onClick={() => handleDelete(kat.id_kategori)}
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