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
import { Plus, Search, Loader2 } from "lucide-react";
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

const API_URL = "https://backend-fourlary-production.up.railway.app/api/pembimbing";

export default function ManajemenPembimbing() {
  const [data, setData] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [editing, setEditing] = React.useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // ✅ Ambil data pembimbing dari backend
  const fetchPembimbing = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const pembimbingList = await res.json();

      if (Array.isArray(pembimbingList)) setData(pembimbingList);
    } catch (err) {
      console.error("Fetch pembimbing error:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPembimbing();
  }, []);

  // Filter pencarian
  const filteredData = data.filter((p) =>
    (p.nama || "").toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Tambah Pembimbing
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setOpenAddDialog(false);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Gagal menambah pembimbing");

      await res.json();
      await fetchPembimbing();
      Swal.fire("Berhasil!", "Data pembimbing berhasil ditambahkan.", "success");
    } catch (err) {
      console.error("Add pembimbing error:", err);
      Swal.fire("Error", "Gagal menambahkan pembimbing.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit Pembimbing
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setEditing(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/${editing.id_pembimbing}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Gagal memperbarui pembimbing");

      await res.json();
      await fetchPembimbing();
      Swal.fire("Tersimpan!", "Data pembimbing berhasil diperbarui.", "success");
    } catch (err) {
      console.error("Edit pembimbing error:", err);
      Swal.fire("Error", "Gagal memperbarui pembimbing.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Hapus Pembimbing
  const handleDelete = (id_pembimbing) => {
    Swal.fire({
      title: "Yakin mau hapus?",
      text: "Data ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await fetch(`${API_URL}/${id_pembimbing}`, { method: "DELETE" });
          setData((prev) =>
            prev.filter((p) => p.id_pembimbing !== id_pembimbing)
          );
          Swal.fire("Terhapus!", "Pembimbing berhasil dihapus.", "success");
        } catch (err) {
          console.error("Delete pembimbing error:", err);
          Swal.fire("Error", "Gagal menghapus pembimbing.", "error");
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
          <h2 className="text-xl font-semibold">Tabel Manajemen Pembimbing</h2>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tambah Pembimbing */}
            <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus size={16} /> Tambahkan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Pembimbing</DialogTitle>
                  <DialogDescription>
                    Masukkan data pembimbing baru.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSubmit} encType="multipart/form-data">
                  <div className="grid gap-4">
                    <div>
                      <Label>Nama</Label>
                      <Input name="nama" required />
                    </div>
                    <div>
                      <Label>Nomor WhatsApp</Label>
                      <Input name="nomor_wa" required />
                    </div>
                    <div>
                      <Label>Link WhatsApp</Label>
                      <Input name="link_wa" placeholder="https://wa.me/62..." />
                    </div>
                    <div>
                      <Label>Jabatan</Label>
                      <Input name="jabatan" placeholder="Contoh: Guru BK" />
                    </div>
                    <div>
                      <Label>Deskripsi</Label>
                      <Input
                        name="deskripsi"
                        placeholder="Masukkan deskripsi singkat"
                      />
                    </div>
                    <div>
                      <Label>Foto</Label>
                      <Input
                        type="file"
                        name="foto_pembimbing"
                        accept="image/*"
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

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Cari pembimbing..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Foto</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((p, index) => (
                <TableRow key={p.id_pembimbing}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {p.foto_pembimbing ? (
                      <img
                        src={p.foto_pembimbing}
                        alt={p.nama}
                        className="h-14 w-20 object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-400">Tidak ada</span>
                    )}
                  </TableCell>
                  <TableCell>{p.nama}</TableCell>
                  <TableCell>
                    <a
                      href={p.link_wa || `https://wa.me/${p.nomor_wa}`}
                      target="_blank"
                      className="text-green-600 underline"
                      rel="noreferrer"
                    >
                      {p.nomor_wa}
                    </a>
                  </TableCell>
                  <TableCell>{p.jabatan || "-"}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {p.deskripsi || "-"}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Dialog
                      open={editing?.id_pembimbing === p.id_pembimbing}
                      onOpenChange={(open) => {
                        if (!open) setEditing(null);
                        else setEditing(p);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-blue-600"
                          onClick={() => setEditing(p)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Pembimbing</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={handleEditSubmit}
                          encType="multipart/form-data"
                        >
                          <div className="grid gap-4">
                            <div>
                              <Label>Nama</Label>
                              <Input
                                name="nama"
                                defaultValue={editing?.nama}
                                required
                              />
                            </div>
                            <div>
                              <Label>Nomor WhatsApp</Label>
                              <Input
                                name="nomor_wa"
                                defaultValue={editing?.nomor_wa}
                                required
                              />
                            </div>
                            <div>
                              <Label>Link WhatsApp</Label>
                              <Input
                                name="link_wa"
                                defaultValue={editing?.link_wa}
                              />
                            </div>
                            <div>
                              <Label>Jabatan</Label>
                              <Input
                                name="jabatan"
                                defaultValue={editing?.jabatan}
                              />
                            </div>
                            <div>
                              <Label>Deskripsi</Label>
                              <Input
                                name="deskripsi"
                                defaultValue={editing?.deskripsi}
                              />
                            </div>
                            <div>
                              <Label>Foto (kosongkan jika tidak diganti)</Label>
                              <Input
                                type="file"
                                name="foto_pembimbing"
                                accept="image/*"
                              />
                              {editing?.foto_pembimbing && (
                                <img
                                  src={editing.foto_pembimbing}
                                  alt="preview"
                                  className="h-20 w-28 object-cover rounded-md mt-2"
                                />
                              )}
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

                    <Button
                      variant="link"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDelete(p.id_pembimbing)}
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
  );
}
