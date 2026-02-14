"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

const API_URL = "https://backend-fourlary-production.up.railway.app/api/jurusan";

export default function ManajemenJurusan() {
  const [data, setData] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [editingJurusan, setEditingJurusan] = React.useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Fetch semua jurusan
  const fetchJurusan = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const jurusan = await res.json();
      if (Array.isArray(jurusan)) setData(jurusan);
    } catch (err) {
      console.error("Fetch jurusan error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchJurusan();
  }, []);

  // Filter pencarian
  const filteredData = data.filter((jrs) =>
    jrs.nama_jurusan?.toLowerCase().includes(search.toLowerCase())
  );

  // Tambah jurusan
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nama_jurusan = formData.get("nama_jurusan");
    const deskripsi = formData.get("deskripsi");

    setOpenAddDialog(false); // ✅ Tutup dialog langsung

    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_jurusan, deskripsi }),
      });

      if (!res.ok) throw new Error("Gagal menambah jurusan");

      await fetchJurusan();
      Swal.fire("Tersimpan!", "Jurusan berhasil ditambahkan.", "success");
      e.target.reset();
    } catch (err) {
      console.error("Add jurusan error:", err);
      Swal.fire("Error", "Gagal menambahkan jurusan.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Edit jurusan
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nama_jurusan = formData.get("nama_jurusan");
    const deskripsi = formData.get("deskripsi");

    setEditingJurusan(null); // ✅ Tutup dialog langsung

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${editingJurusan.id_jurusan}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_jurusan, deskripsi }),
      });

      if (!res.ok) throw new Error("Gagal update jurusan");

      await fetchJurusan();
      Swal.fire("Tersimpan!", "Jurusan berhasil diperbarui.", "success");
    } catch (err) {
      console.error("Edit jurusan error:", err);
      Swal.fire("Error", "Gagal memperbarui jurusan.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Hapus jurusan
  const handleDelete = (id_jurusan) => {
    Swal.fire({
      title: "Yakin mau hapus?",
      text: "Jurusan ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await fetch(`${API_URL}/${id_jurusan}`, { method: "DELETE" });
          setData(data.filter((j) => j.id_jurusan !== id_jurusan));
          Swal.fire("Terhapus!", "Jurusan berhasil dihapus.", "success");
        } catch (err) {
          console.error("Delete jurusan error:", err);
        } finally {
          setLoading(false);
        }
      }
    });
  };

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
          <h2 className="text-xl font-semibold">Tabel Manajemen Jurusan</h2>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari jurusan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9"
            />
          </div>

          {/* Tambah Jurusan */}
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button className="h-9">+ Tambah Jurusan</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Jurusan</DialogTitle>
                <DialogDescription>Masukkan data jurusan baru.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSubmit}>
                <div className="grid gap-4 py-2">
                  <div className="grid gap-2">
                    <Label htmlFor="nama_jurusan">Nama Jurusan</Label>
                    <Input id="nama_jurusan" name="nama_jurusan" required />
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
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Batal</Button>
                  </DialogClose>
                  <Button type="submit">Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center">No</TableHead>
                <TableHead>Nama Jurusan</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-center w-[180px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((jrs, index) => (
                  <TableRow key={jrs.id_jurusan}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>{jrs.nama_jurusan}</TableCell>
                    <TableCell>{jrs.deskripsi || "-"}</TableCell>
                    <TableCell className="text-center space-x-2">
                      {/* Edit */}
                      <Dialog
                        open={editingJurusan?.id_jurusan === jrs.id_jurusan}
                        onOpenChange={(open) =>
                          setEditingJurusan(open ? jrs : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-blue-600"
                            onClick={() => setEditingJurusan(jrs)}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Jurusan</DialogTitle>
                            <DialogDescription>Ubah data jurusan.</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleEditSubmit}>
                            <div className="grid gap-4 py-2">
                              <div className="grid gap-2">
                                <Label htmlFor="nama_jurusan">Nama Jurusan</Label>
                                <Input
                                  id="nama_jurusan"
                                  name="nama_jurusan"
                                  defaultValue={editingJurusan?.nama_jurusan}
                                  required
                                />
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <textarea
                                  id="deskripsi"
                                  name="deskripsi"
                                  defaultValue={editingJurusan?.deskripsi}
                                  className="border rounded-md p-2 h-24"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Batal</Button>
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
                        onClick={() => handleDelete(jrs.id_jurusan)}
                      >
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-6">
                    Tidak ada jurusan ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
