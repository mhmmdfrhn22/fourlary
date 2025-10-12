import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import GalleryDetailModal from "@/components/detailGaleryModal";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Heart, Share2 } from "lucide-react";

export default function Gallery() {
  const API_URL = "http://localhost:3000/api/foto";
  const { user, isLoading } = useAuth();
  const userId = user?.id_user ?? user?.id ?? null;

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState(["Semua"]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [selectedFotoId, setSelectedFotoId] = useState(null);

  const [detail, setDetail] = useState(null);
  const [komentarList, setKomentarList] = useState([]);
  const [newKomentar, setNewKomentar] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [detailLoading, setDetailLoading] = useState(false);

  const [openLoginAlert, setOpenLoginAlert] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Gagal memuat galeri");
      const data = await res.json();

      const formatted = (Array.isArray(data) ? data : []).map((it) => ({
        id: it.id_foto,
        src: `http://localhost:3000/uploads/galeri/${it.url_foto}`,
        title: it.deskripsi || "Tanpa Deskripsi",
        uploader: it.uploader || "Admin",
        category: it.nama_kategori || "Tanpa Kategori",
        likes: it.like_count || 0,
        tanggal_upload: it.tanggal_upload || null,
      }));

      const uniqueCategories = [
        "Semua",
        ...Array.from(new Set(formatted.map((f) => f.category))),
      ];

      setImages(formatted);
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("fetchGallery error:", err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(
    () =>
      images.filter(
        (img) =>
          (filter === "Semua" || img.category === filter) &&
          img.title.toLowerCase().includes(search.toLowerCase())
      ),
    [images, filter, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentImages = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const closeModal = () => {
    setOpenModal(false);
    setSelectedFotoId(null);
    setDetail(null);
    setKomentarList([]);
    setNewKomentar("");
    setLiked(false);
    setLikeCount(0);
  };

  const openDetailModal = async (fotoId) => {
    setSelectedFotoId(fotoId);
    setOpenModal(true);
    await loadDetail(fotoId);
  };

  const loadDetail = async (fotoId) => {
    setDetailLoading(true);
    try {
      const [fotoRes, komentarRes, likeRes, checkLikeRes] = await Promise.all([
        fetch(`${API_URL}/${fotoId}`).then((r) => r.json()),
        fetch(`http://localhost:3000/api/komentar-foto/${fotoId}`).then((r) =>
          r.ok ? r.json() : []
        ),
        fetch(`http://localhost:3000/api/like-foto/${fotoId}`).then((r) =>
          r.ok ? r.json() : { total_like: 0 }
        ),
        userId
          ? fetch(
              `http://localhost:3000/api/like-foto/${fotoId}/${userId}`
            ).then((r) => (r.ok ? r.json() : { liked: false }))
          : Promise.resolve({ liked: false }),
      ]);

      setDetail({
        id: fotoRes.id_foto,
        src: `http://localhost:3000/uploads/galeri/${fotoRes.url_foto}`,
        title: fotoRes.deskripsi || "Tanpa Deskripsi",
        uploader: fotoRes.uploader || "Admin",
        category: fotoRes.nama_kategori || "Tanpa Kategori",
        tanggal_upload: fotoRes.tanggal_upload || null,
      });

      setKomentarList(komentarRes);
      setLikeCount(likeRes?.total_like ?? 0);
      setLiked(checkLikeRes?.liked ?? false);
    } catch (err) {
      console.error("loadDetail error:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const toggleLike = async () => {
    if (!userId) {
      setOpenLoginAlert(true);
      return;
    }

    if (!selectedFotoId) return;

    const willLike = !liked;
    setLiked(willLike);
    setLikeCount((c) => c + (willLike ? 1 : -1));

    setImages((prev) =>
      prev.map((img) =>
        img.id === selectedFotoId
          ? { ...img, likes: img.likes + (willLike ? 1 : -1) }
          : img
      )
    );

    try {
      const method = willLike ? "POST" : "DELETE";
      await fetch("http://localhost:3000/api/like-foto/", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_foto: selectedFotoId, id_user: userId }),
      });
    } catch (err) {
      console.error("toggleLike error:", err);
      setLiked((prev) => !prev);
      setLikeCount((c) => c + (willLike ? -1 : 1));
    }
  };

  const sendKomentar = async (e) => {
    e.preventDefault();
    if (!userId) {
      setOpenLoginAlert(true);
      return;
    }

    if (!newKomentar.trim() || !selectedFotoId) return;
    const body = {
      id_foto: selectedFotoId,
      id_user: userId,
      isi_komentar: newKomentar.trim(),
    };

    try {
      await fetch(`http://localhost:3000/api/komentar-foto/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const komentarRes = await fetch(
        `http://localhost:3000/api/komentar-foto/${selectedFotoId}`
      );
      const komentarData = komentarRes.ok ? await komentarRes.json() : [];
      setKomentarList(komentarData);

      setNewKomentar("");
    } catch (err) {
      console.error("sendKomentar error:", err);
    }
  };

  return (
    <div className="container mx-auto px-6 sm:px-10 lg:px-24 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Galeri Sekolah
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            placeholder="Cari foto..."
            className="sm:w-64"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <Select
            value={filter}
            onValueChange={(val) => {
              setFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Filter Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat, idx) => (
                <SelectItem key={idx} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Gallery Grid */}
      {currentImages.length === 0 ? (
        <p className="text-center text-gray-500">
          Tidak ada foto ditemukan.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentImages.map((img) => (
            <Card
              key={img.id}
              onClick={() => openDetailModal(img.id)}
              className="p-0 relative overflow-hidden cursor-pointer group transition-transform duration-300 hover:scale-[102%]"
            >
              <CardHeader className="p-0">
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-64 object-cover"
                />
              </CardHeader>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-between p-4 pointer-events-none">
                <div className="flex justify-end pointer-events-auto">
                  <Badge className="bg-white text-gray-800 font-semibold shadow-sm px-3 py-1 rounded-full">
                    {img.category}
                  </Badge>
                </div>
                <div className="flex justify-between text-white items-end pointer-events-auto">
                  <div>
                    <h2 className="text-lg font-bold">{img.title}</h2>
                    <p className="text-sm mt-1">
                      Diunggah oleh{" "}
                      <span className="font-semibold">{img.uploader}</span>
                    </p>
                  </div>
                  <Badge className="bg-white text-gray-800 font-medium shadow-sm px-4 py-1 rounded-full">
                    ❤️ {img.likes}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal with Details */}
      <GalleryDetailModal
        openModal={openModal}
        closeModal={closeModal}
        detailLoading={detailLoading}
        detail={detail}
        komentarList={komentarList}
        likeCount={likeCount}
        liked={liked}
        toggleLike={toggleLike}
        sendKomentar={sendKomentar}
        newKomentar={newKomentar}
        setNewKomentar={setNewKomentar}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lt; Sebelumnya
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
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Selanjutnya &gt;
          </Button>
        </div>
      )}

      {/* Login Alert Dialog */}
      <AlertDialog open={openLoginAlert} onOpenChange={setOpenLoginAlert}>
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg font-bold text-gray-800">
              Login Diperlukan
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 mt-2">
              Kamu harus login terlebih dahulu untuk memberikan{" "}
              <strong>like</strong> atau menulis <strong>komentar</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex justify-center gap-3 mt-6">
            <AlertDialogCancel
              className="rounded-full px-6 bg-gray-200 hover:bg-gray-300 transition"
              onClick={() => setOpenLoginAlert(false)}
            >
              Nanti Saja
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpenLoginAlert(false);
                window.location.href = "/login";
              }}
              className="rounded-full px-6 bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Login Sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}