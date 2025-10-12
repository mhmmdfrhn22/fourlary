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
import { Plus, Search } from "lucide-react";
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

const API_URL = "http://localhost:3000/api/pembimbing";

export default function ManajemenPembimbing() {
  const [data, setData] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [editing, setEditing] = React.useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);

  // Fetch Data
  const fetchPembimbing = async () => {
    try {
      const res = await fetch(API_URL);
      const pembimbing = await res.json();
      if (Array.isArray(pembimbing)) setData(pembimbing);
    } catch (err) {
      console.error("Fetch pembimbing error:", err);
    }
  };

  React.useEffect(() => {
    fetchPembimbing();
  }, []);

  const filteredData = data.filter((p) =>
    (p.nama || "").toLowerCase().includes(search.toLowerCase())
  );

  // Tambah Pembimbing
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Gagal menambah pembimbing");
      await fetchPembimbing();
      setOpenAddDialog(false);
      Swal.fire("Berhasil!", "Data pembimbing berhasil ditambahkan.", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // Edit Pembimbing
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const res = await fetch(`${API_URL}/${editing.id_pembimbing}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Gagal memperbarui pembimbing");
      await fetchPembimbing();
      setEditing(null);
      Swal.fire("Tersimpan!", "Data pembimbing berhasil diperbarui.", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // Hapus Pembimbing
  const handleDelete = (id_pembimbing) => {
    Swal.fire({
      title: "Yakin mau hapus?",
      text: "Data ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`${API_URL}/${id_pembimbing}`, { method: "DELETE" });
          await fetchPembimbing();
          Swal.fire("Terhapus!", "Pembimbing berhasil dihapus.", "success");
        } catch (err) {
          Swal.fire("Error", err.message, "error");
        }
      }
    });
  };

  return (
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
                    <Input name="deskripsi" placeholder="Masukkan deskripsi singkat" />
                  </div>
                  <div>
                    <Label>Foto</Label>
                    <Input type="file" name="foto_pembimbing" accept="image/*" />
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
                      src={`http://localhost:3000/uploads/pembimbing/${p.foto_pembimbing}`}
                      alt={p.nama}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">
                      No Img
                    </div>
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

      {/* Edit Dialog */}
      {editing && (
        <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Pembimbing</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} encType="multipart/form-data">
              <div className="grid gap-4">
                <div>
                  <Label>Nama</Label>
                  <Input name="nama" defaultValue={editing.nama} required />
                </div>
                <div>
                  <Label>Nomor WhatsApp</Label>
                  <Input name="nomor_wa" defaultValue={editing.nomor_wa} required />
                </div>
                <div>
                  <Label>Link WhatsApp</Label>
                  <Input name="link_wa" defaultValue={editing.link_wa} />
                </div>
                <div>
                  <Label>Jabatan</Label>
                  <Input name="jabatan" defaultValue={editing.jabatan} />
                </div>
                <div>
                  <Label>Deskripsi</Label>
                  <Input name="deskripsi" defaultValue={editing.deskripsi} />
                </div>
                <div>
                  <Label>Foto (kosongkan jika tidak diganti)</Label>
                  <Input type="file" name="foto_pembimbing" accept="image/*" />
                  {editing.foto_pembimbing && (
                    <img
                      src={`http://localhost:3000/uploads/pembimbing/${editing.foto_pembimbing}`}
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
  );
}
