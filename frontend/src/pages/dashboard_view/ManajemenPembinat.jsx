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

const API_URL = "https://backend-fourlary-production.up.railway.app/api/pembinat";

export default function ManajemenPembinat() {
  const [data, setData] = React.useState([]);
  const [jurusan, setJurusan] = React.useState([]);
  const [pembimbing, setPembimbing] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [editing, setEditing] = React.useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // ✅ Fetch semua pembinat
  const fetchPembinat = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const pembinat = await res.json();
      if (Array.isArray(pembinat)) setData(pembinat);
    } catch (err) {
      console.error("Fetch pembinat error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch jurusan
  const fetchJurusan = async () => {
    try {
      const res = await fetch("https://backend-fourlary-production.up.railway.app/api/jurusan");
      const jurusan = await res.json();
      if (Array.isArray(jurusan)) setJurusan(jurusan);
    } catch (err) {
      console.error("Fetch jurusan error:", err);
    }
  };

  // ✅ Fetch pembimbing
  const fetchPembimbing = async () => {
    try {
      const res = await fetch("https://backend-fourlary-production.up.railway.app/api/pembimbing");
      const pembimbing = await res.json();
      if (Array.isArray(pembimbing)) setPembimbing(pembimbing);
    } catch (err) {
      console.error("Fetch pembimbing error:", err);
    }
  };

  React.useEffect(() => {
    fetchPembinat();
    fetchJurusan();
    fetchPembimbing();
  }, []);

  const filteredData = data.filter((p) =>
    (p.nama_pekerjaan || "").toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Tambah pembinat
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
      if (!res.ok) throw new Error("Gagal menambah pembinat");

      await fetchPembinat();
      Swal.fire("Berhasil!", "Data pembinat berhasil ditambahkan.", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit pembinat
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setEditing(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/${editing.id_pekerjaan}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Gagal memperbarui pembinat");

      await fetchPembinat();
      Swal.fire("Tersimpan!", "Data pembinat berhasil diperbarui.", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Hapus pembinat
  const handleDelete = (id_pekerjaan) => {
    Swal.fire({
      title: "Yakin mau hapus?",
      text: "Data ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await fetch(`${API_URL}/${id_pekerjaan}`, { method: "DELETE" });
          await fetchPembinat();
          Swal.fire("Terhapus!", "Pembinat berhasil dihapus.", "success");
        } catch (err) {
          Swal.fire("Error", err.message, "error");
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
          <h2 className="text-xl font-semibold">Tabel Manajemen Pembinat</h2>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tambah Pembinat */}
            <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus size={16} /> Tambahkan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Pembinat</DialogTitle>
                  <DialogDescription>
                    Masukkan data pembinat baru.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSubmit} encType="multipart/form-data">
                  <div className="grid gap-4">
                    <div>
                      <Label>Nama Pekerjaan</Label>
                      <Input name="nama_pekerjaan" required />
                    </div>
                    <div>
                      <Label>Deskripsi</Label>
                      <Input name="deskripsi" placeholder="Masukkan deskripsi singkat" />
                    </div>
                    <div>
                      <Label>Jurusan</Label>
                      <select
                        name="id_jurusan"
                        required
                        className="w-full border rounded-md h-9 px-2"
                      >
                        <option value="">Pilih Jurusan</option>
                        {jurusan.map((j) => (
                          <option key={j.id_jurusan} value={j.id_jurusan}>
                            {j.nama_jurusan}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Pembimbing</Label>
                      <select
                        name="id_pembimbing"
                        required
                        className="w-full border rounded-md h-9 px-2"
                      >
                        <option value="">Pilih Pembimbing</option>
                        {pembimbing.map((b) => (
                          <option key={b.id_pembimbing} value={b.id_pembimbing}>
                            {b.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Gambar</Label>
                      <Input type="file" name="gambar_pekerjaan" accept="image/*" />
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
                placeholder="Cari pembinat..."
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
                <TableHead>Gambar</TableHead>
                <TableHead>Nama Pekerjaan</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Jurusan</TableHead>
                <TableHead>Pembimbing</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((p, index) => (
                <TableRow key={p.id_pekerjaan}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {p.gambar_pekerjaan ? (
                      <img
                        src={p.gambar_pekerjaan}
                        alt={p.nama_pekerjaan}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">
                        No Img
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{p.nama_pekerjaan}</TableCell>
                  <TableCell className="max-w-[250px] truncate">
                    {p.deskripsi || "-"}
                  </TableCell>
                  <TableCell>{p.nama_jurusan || "-"}</TableCell>
                  <TableCell>{p.nama_pembimbing || "-"}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-blue-600"
                      onClick={() => setEditing(p)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDelete(p.id_pekerjaan)}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        {editing && (
          <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Pembinat</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} encType="multipart/form-data">
                <div className="grid gap-4">
                  <div>
                    <Label>Nama Pekerjaan</Label>
                    <Input name="nama_pekerjaan" defaultValue={editing.nama_pekerjaan} required />
                  </div>
                  <div>
                    <Label>Deskripsi</Label>
                    <Input name="deskripsi" defaultValue={editing.deskripsi} />
                  </div>
                  <div>
                    <Label>Jurusan</Label>
                    <select
                      name="id_jurusan"
                      defaultValue={editing.id_jurusan}
                      className="w-full border rounded-md h-9 px-2"
                      required
                    >
                      {jurusan.map((j) => (
                        <option key={j.id_jurusan} value={j.id_jurusan}>
                          {j.nama_jurusan}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Pembimbing</Label>
                    <select
                      name="id_pembimbing"
                      defaultValue={editing.id_pembimbing}
                      className="w-full border rounded-md h-9 px-2"
                      required
                    >
                      {pembimbing.map((b) => (
                        <option key={b.id_pembimbing} value={b.id_pembimbing}>
                          {b.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Gambar (kosongkan jika tidak diganti)</Label>
                    <Input type="file" name="gambar_pekerjaan" accept="image/*" />
                    {editing.gambar_pekerjaan && (
                      <img
                        src={editing.gambar_pekerjaan}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded-md mt-2"
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
        )}
      </div>
    </div>
  );
}
