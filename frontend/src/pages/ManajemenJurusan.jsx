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
import { Search } from "lucide-react";
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

// Ganti dengan endpoint API kamu
const API_URL = "http://localhost:3000/api/jurusan";

export default function ManajemenJurusan() {
  const [data, setData] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [editingJurusan, setEditingJurusan] = React.useState(null);

  // Fetch semua jurusan
  React.useEffect(() => {
    const fetchJurusan = async () => {
      try {
        const res = await fetch(API_URL);
        const jurusan = await res.json();
        if (Array.isArray(jurusan)) setData(jurusan);
      } catch (err) {
        console.error("Fetch jurusan error:", err.message);
      }
    };
    fetchJurusan();
  }, []);

  // Filter pencarian
  const filteredData = data.filter((jrs) =>
    jrs.nama_jurusan.toLowerCase().includes(search.toLowerCase())
  );

  // Tambah jurusan
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nama_jurusan = formData.get("nama_jurusan");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_jurusan }),
      });

      if (!res.ok) throw new Error("Gagal menambah jurusan");

      const newJurusan = await res.json();
      setData([...data, newJurusan]);
      Swal.fire("Tersimpan!", "Jurusan berhasil ditambahkan.", "success");
    } catch (err) {
      console.error("Add jurusan error:", err);
    }
  };

  // Edit jurusan
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nama_jurusan = formData.get("nama_jurusan");

    try {
      const res = await fetch(`${API_URL}/${editingJurusan.id_jurusan}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_jurusan }),
      });

      if (!res.ok) throw new Error("Gagal update jurusan");

      setData(
        data.map((j) =>
          j.id_jurusan === editingJurusan.id_jurusan
            ? { ...j, nama_jurusan }
            : j
        )
      );
      setEditingJurusan(null);
      Swal.fire("Tersimpan!", "Jurusan berhasil diperbarui.", "success");
    } catch (err) {
      console.error("Edit jurusan error:", err);
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
          await fetch(`${API_URL}/${id_jurusan}`, { method: "DELETE" });
          setData(data.filter((j) => j.id_jurusan !== id_jurusan));
          Swal.fire("Terhapus!", "Jurusan berhasil dihapus.", "success");
        } catch (err) {
          console.error("Delete jurusan error:", err);
        }
      }
    });
  };

  return (
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-9">+ Tambah Jurusan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Jurusan</DialogTitle>
              <DialogDescription>
                Masukkan nama jurusan baru.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="nama_jurusan">Nama Jurusan</Label>
                  <Input id="nama_jurusan" name="nama_jurusan" required />
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
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">No</TableHead>
              <TableHead>Nama Jurusan</TableHead>
              <TableHead className="text-center w-[180px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((jrs, index) => (
                <TableRow key={jrs.id_jurusan}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>{jrs.nama_jurusan}</TableCell>
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
                          <DialogDescription>
                            Ubah nama jurusan.
                          </DialogDescription>
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
                <TableCell colSpan={3} className="text-center text-gray-500 py-6">
                  Tidak ada jurusan ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}