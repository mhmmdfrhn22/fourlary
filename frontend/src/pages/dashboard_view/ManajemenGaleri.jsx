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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Heart, Download, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const API_URL = "https://backend-fourlary-production.up.railway.app/api/foto";
const API_KATEGORI = "https://backend-fourlary-production.up.railway.app/api/kategori-foto";

export default function ManajemenGaleri() {
  const [data, setData] = React.useState([]);
  const [kategori, setKategori] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [editingGaleri, setEditingGaleri] = React.useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [selectedKategori, setSelectedKategori] = React.useState("");
  const [selectedEditKategori, setSelectedEditKategori] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false); // 🟡 NEW
  const galeriPerPage = 6;

  // -----------------------
  // FETCH DATA
  // -----------------------
  const fetchGaleri = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let url = API_URL;

      if (user?.role === "pdd" || user?.role_id === 3) {
        url += `?uploader_id=${user.id}`;
      }

      const res = await fetch(url);
      const galeri = await res.json();
      if (Array.isArray(galeri)) setData(galeri);
    } catch (err) {
      console.error("Fetch galeri error:", err);
    }
  };

  const fetchKategori = async () => {
    try {
      const res = await fetch(API_KATEGORI);
      const list = await res.json();
      if (Array.isArray(list)) setKategori(list);
    } catch (err) {
      console.error("Fetch kategori error:", err);
    }
  };

  React.useEffect(() => {
    fetchGaleri();
    fetchKategori();
  }, []);

  // -----------------------
  // ADD FOTO
  // -----------------------
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (!selectedKategori) {
      Swal.fire("Error", "Kategori harus dipilih", "error");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    formData.append("id_kategori", selectedKategori);
    formData.append("diupload_oleh", user?.id || 1);

    try {
      // ✅ Tutup modal dulu sebelum loading
      setOpenAddDialog(false);

      // ✅ Tambahkan sedikit delay agar modal sempat animasi tutup
      await new Promise((r) => setTimeout(r, 200));

      setLoading(true); // 🌀 Baru mulai loading

      const res = await fetch(API_URL, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Gagal menambah foto");

      await fetchGaleri();
      Swal.fire("Berhasil!", "Foto berhasil ditambahkan", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // EDIT FOTO
  // -----------------------
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData();
    const deskripsi = form.deskripsi.value;
    const idKategori = selectedEditKategori || editingGaleri.id_kategori;
    const file = form.foto.files[0];

    formData.append("deskripsi", deskripsi);
    formData.append("id_kategori", idKategori);
    if (file) formData.append("foto", file);

    try {
      // ✅ Tutup modal dulu sebelum loading
      setEditingGaleri(null);

      // ✅ Delay kecil untuk animasi tutup
      await new Promise((r) => setTimeout(r, 200));

      setLoading(true);

      const res = await fetch(`${API_URL}/${editingGaleri.id_foto}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui foto");

      await fetchGaleri();
      Swal.fire("Berhasil!", "Foto berhasil diperbarui", "success");
    } catch (err) {
      console.error("❌ Edit error:", err);
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };


  // -----------------------
  // DELETE FOTO
  // -----------------------
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus foto ini?",
      text: "Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
    }).then(async (r) => {
      if (r.isConfirmed) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        await fetchGaleri();
        Swal.fire("Terhapus!", "Foto dihapus.", "success");
      }
    });
  };

  // -----------------------
  // DOWNLOAD LAPORAN PDF
  // -----------------------
  const downloadReport = async (limit = 10) => {
    try {
      const res = await fetch(`${API_URL}/laporan/pdf?limit=${limit}`);
      if (!res.ok) throw new Error("Gagal membuat laporan");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan_foto_top_${limit}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      Swal.fire("Error", "Gagal mengunduh laporan PDF", "error");
    }
  };

  // -----------------------
  // FILTER & PAGINATION
  // -----------------------
  const filtered = data.filter((item) =>
    (item.deskripsi || "").toLowerCase().includes(search.toLowerCase())
  );
  const indexOfLast = currentPage * galeriPerPage;
  const current = filtered.slice(indexOfLast - galeriPerPage, indexOfLast);
  const totalPages = Math.ceil(filtered.length / galeriPerPage);

  // -----------------------
  // UI
  // -----------------------
  return (
    <div className="relative">
      {/* 🌀 Overlay Loading */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-all">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-2" />
          <p className="text-sm text-gray-600 animate-pulse">Mengunggah data...</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Tabel Manajemen Galeri</h2>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => downloadReport(10)} size="sm" className="gap-1">
              <Download size={16} /> Download Laporan
            </Button>

            {/* Tambah Foto */}
            <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus size={16} /> Tambah
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Foto</DialogTitle>
                  <DialogDescription>Masukkan data foto baru.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSubmit} encType="multipart/form-data">
                  <div className="grid gap-4">
                    <div>
                      <Label>Kategori</Label>
                      <Select value={selectedKategori} onValueChange={setSelectedKategori}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {kategori.map((k) => (
                            <SelectItem key={k.id_kategori} value={String(k.id_kategori)}>
                              {k.nama_kategori}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Deskripsi</Label>
                      <Input name="deskripsi" required />
                    </div>
                    <div>
                      <Label>Foto</Label>
                      <Input type="file" name="foto" accept="image/*" required />
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">Batal</Button>
                    </DialogClose>
                    <Button type="submit">Simpan</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-gray-400" />
              <Input
                placeholder="Cari foto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Foto</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Uploader</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {current.map((g, i) => (
                <TableRow key={g.id_foto}>
                  <TableCell>{i + 1 + (currentPage - 1) * galeriPerPage}</TableCell>
                  <TableCell>
                    <img
                      src={g.url_foto}
                      alt={g.deskripsi}
                      className="w-16 h-16 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell>{g.deskripsi}</TableCell>
                  <TableCell>{g.nama_kategori}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Heart size={16} className="text-red-500" /> {g.like_count || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-600">{g.uploader}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setEditingGaleri(g);
                        setSelectedEditKategori(String(g.id_kategori));
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDelete(g.id_foto)}
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
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              size="sm"
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
          </Button>
        </div>

        {/* Dialog Edit */}
        {editingGaleri && (
          <Dialog open={!!editingGaleri} onOpenChange={() => setEditingGaleri(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Foto</DialogTitle>
                <DialogDescription>Ubah data foto di bawah ini.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} encType="multipart/form-data">
                <div className="grid gap-4">
                  <div>
                    <Label>Kategori</Label>
                    <Select
                      value={selectedEditKategori}
                      onValueChange={setSelectedEditKategori}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {kategori.map((k) => (
                          <SelectItem key={k.id_kategori} value={String(k.id_kategori)}>
                            {k.nama_kategori}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Deskripsi</Label>
                    <Input
                      name="deskripsi"
                      defaultValue={editingGaleri.deskripsi}
                      required
                    />
                  </div>
                  <div>
                    <Label>Foto (opsional)</Label>
                    <Input type="file" name="foto" accept="image/*" />
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button variant="outline">Batal</Button>
                  </DialogClose>
                  <Button type="submit">Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
