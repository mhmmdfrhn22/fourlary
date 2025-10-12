// components/ManajemenGaleri.jsx  (atau halaman yang kamu gunakan)
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
import { Plus, Search, Heart, Download } from "lucide-react";
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

const API_URL = "http://localhost:3000/api/foto";
const API_KATEGORI = "http://localhost:3000/api/kategori-foto";

export default function ManajemenGaleri() {
  const [data, setData] = React.useState([]);
  const [kategori, setKategori] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [editingGaleri, setEditingGaleri] = React.useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [selectedKategori, setSelectedKategori] = React.useState("");
  const [selectedEditKategori, setSelectedEditKategori] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const galeriPerPage = 6;

  const fetchGaleri = async () => {
    try {
      const res = await fetch(API_URL);
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

  const filtered = data.filter((item) =>
    (item.deskripsi || "").toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * galeriPerPage;
  const current = filtered.slice(indexOfLast - galeriPerPage, indexOfLast);
  const totalPages = Math.ceil(filtered.length / galeriPerPage);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("id_kategori", selectedKategori);
    const user = JSON.parse(localStorage.getItem("user"));
    formData.append("diupload_oleh", user?.id || 1);

    try {
      const res = await fetch(API_URL, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Gagal menambah foto");
      await fetchGaleri();
      setOpenAddDialog(false);
      Swal.fire("Berhasil!", "Foto berhasil ditambahkan", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("id_kategori", selectedEditKategori || editingGaleri.id_kategori);

    try {
      const res = await fetch(`${API_URL}/${editingGaleri.id_foto}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Gagal memperbarui foto");
      await fetchGaleri();
      setEditingGaleri(null);
      Swal.fire("Berhasil!", "Foto diperbarui", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

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
  // DOWNLOAD PDF REPORT
  // -----------------------
  const downloadReport = async (limit = 10) => {
    try {
      const res = await fetch(`${API_URL}/laporan/pdf?limit=${limit}`, {
        method: "GET",
      });
      if (!res.ok) throw new Error("Gagal membuat laporan");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan_foto_top_${limit}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download report error:", err);
      Swal.fire("Error", "Gagal mengunduh laporan PDF", "error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Tabel Manajemen Galeri</h2>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => downloadReport(10)} size="sm" className="gap-1">
            <Download size={16} /> Download Laporan (Top 10)
          </Button>

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
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <img
                    src={`http://localhost:3000/uploads/galeri/${g.url_foto}`}
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

      {/* Edit Dialog (sama seperti sebelumnya) */}
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
                  <img
                    src={`http://localhost:3000/uploads/galeri/${editingGaleri.url_foto}`}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded mt-2"
                  />
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
  );
}