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
import { Search, Plus, Loader2 } from "lucide-react";
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL = "https://backend-fourlary-production.up.railway.app/api/posts";
const API_KATEGORI = "https://backend-fourlary-production.up.railway.app/api/kategori";

const getStatusBadge = (status) => {
  const s = status?.toLowerCase();
  if (s === "published")
    return <Badge className="bg-green-500/20 text-green-700">Published</Badge>;
  if (s === "draft")
    return <Badge className="bg-gray-500/20 text-gray-700">Draft</Badge>;
  return <Badge className="bg-blue-500/20 text-blue-700">{status || "-"}</Badge>;
};

export default function ManajemenBerita() {
  const [data, setData] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [adding, setAdding] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [editPost, setEditPost] = React.useState(null);
  const [kategoriId, setKategoriId] = React.useState("");
  const [status, setStatus] = React.useState("draft");
  const [loading, setLoading] = React.useState(false);

  // 🔹 Fetch Data
  const fetchPosts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let url = API_URL;
      if (user?.role === "pdd" || user?.role_id === 3) {
        url += `?user_id=${user.id}`;
      }
      const res = await fetch(url);
      const posts = await res.json();
      if (Array.isArray(posts)) setData(posts);
    } catch (err) {
      console.error("Fetch posts error:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(API_KATEGORI);
      const list = await res.json();
      if (Array.isArray(list)) setCategories(list);
    } catch (err) {
      console.error("Fetch kategori error:", err);
    }
  };

  React.useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const filteredData = data.filter((p) =>
    p.judul?.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Tambah Berita
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = JSON.parse(localStorage.getItem("user"));
    formData.append("user_id", user?.id);
    formData.append("kategori_id", kategoriId);
    formData.append("status", status);

    try {
      setAdding(false);
      await new Promise((r) => setTimeout(r, 200));
      setLoading(true);

      const res = await fetch(API_URL, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Gagal menambah berita");

      await fetchPosts();
      Swal.fire("Berhasil!", "Berita berhasil ditambahkan.", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Edit Berita
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();
    const judul = form.judul.value;
    const isi = form.isi.value;
    const file = form.foto.files[0];

    formData.append("judul", judul);
    formData.append("isi", isi);
    formData.append("kategori_id", kategoriId || editPost.kategori_id);
    formData.append("status", status || editPost.status);
    if (file) formData.append("foto", file);

    try {
      setEditing(false);
      await new Promise((r) => setTimeout(r, 200));
      setLoading(true);

      const res = await fetch(`${API_URL}/${editPost.id}`, {
        method: "PUT",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal mengedit berita");

      await fetchPosts();
      Swal.fire("Berhasil!", "Berita berhasil diperbarui.", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Hapus Berita
  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin mau hapus?",
      text: "Data berita tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
    }).then(async (r) => {
      if (r.isConfirmed) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        await fetchPosts();
        Swal.fire("Terhapus!", "Berita berhasil dihapus.", "success");
      }
    });
  };

  React.useEffect(() => {
    if (editPost) {
      setKategoriId(String(editPost.kategori_id || ""));
      setStatus(editPost.status || "draft");
    }
  }, [editPost]);

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold">Tabel Manajemen Berita</h2>
          <div className="flex items-center gap-2">
            {/* Tambah Berita */}
            <Dialog open={adding} onOpenChange={setAdding}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4" /> Tambah Berita
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Berita Baru</DialogTitle>
                  <DialogDescription>Isi data berita dengan lengkap</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleAddSubmit} encType="multipart/form-data">
                  <div className="grid gap-4">
                    <div>
                      <Label>Judul</Label>
                      <Input name="judul" required />
                    </div>

                    <div>
                      <Label>Kategori</Label>
                      <Select value={kategoriId} onValueChange={setKategoriId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.nama || c.nama_kategori || c.judul}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Isi</Label>
                      <textarea
                        name="isi"
                        required
                        className="border rounded-md p-2 h-28 w-full"
                      />
                    </div>

                    <div>
                      <Label>Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Gambar</Label>
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

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Cari berita..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gambar</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.map((post, i) => (
                <TableRow key={post.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{post.judul}</TableCell>
                  <TableCell>{post.kategori || "-"}</TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell>
                    {post.url_foto ? (
                      <img
                        src={post.url_foto}
                        alt="gambar"
                        className="h-14 w-20 object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-400">Tidak ada</span>
                    )}
                  </TableCell>

                  <TableCell className="space-x-2">
                    <Button
                      variant="link"
                      className="text-blue-600"
                      onClick={() => {
                        setEditPost(post);
                        setEditing(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      className="text-red-600"
                      onClick={() => handleDelete(post.id)}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Dialog Edit */}
        {editPost && (
          <Dialog open={editing} onOpenChange={setEditing}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Berita</DialogTitle>
                <DialogDescription>Perbarui data berita</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleEditSubmit} encType="multipart/form-data">
                <div className="grid gap-4">
                  <div>
                    <Label>Judul</Label>
                    <Input name="judul" defaultValue={editPost.judul} required />
                  </div>

                  <div>
                    <Label>Kategori</Label>
                    <Select value={kategoriId} onValueChange={setKategoriId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.nama || c.nama_kategori || c.judul}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Isi</Label>
                    <textarea
                      name="isi"
                      defaultValue={editPost.isi}
                      className="border rounded-md p-2 h-28 w-full"
                      required
                    />
                  </div>

                  <div>
                    <Label>Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Gambar</Label>
                    <Input type="file" name="foto" accept="image/*" />
                    {editPost.url_foto && (
                      <img
                        src={editPost.url_foto}
                        alt="foto"
                        className="h-20 mt-2 rounded-md object-cover"
                      />
                    )}
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button variant="outline">Batal</Button>
                  </DialogClose>
                  <Button type="submit">Simpan Perubahan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
