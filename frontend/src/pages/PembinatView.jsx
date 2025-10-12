"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X } from "lucide-react";

export default function PembinatView() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [jurusanFilter, setJurusanFilter] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState(null);
  const [pembimbing, setPembimbing] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/pembinat");
        const result = await res.json();
        setData(result || []);
      } catch (error) {
        console.error("Gagal memuat data pembinat:", error);
      }
    };
    fetchData();
  }, []);

  // ketika selectedItem berubah, fetch pembimbing detail jika ada id_pembimbing
  useEffect(() => {
    if (!selectedItem) {
      setPembimbing(null);
      return;
    }
    const idPembimbing = selectedItem.id_pembimbing;
    if (!idPembimbing) {
      setPembimbing(null);
      return;
    }
    let mounted = true;
    fetch(`http://localhost:3000/api/pembimbing/${idPembimbing}`)
      .then((r) => {
        if (!r.ok) throw new Error("Gagal memuat pembimbing");
        return r.json();
      })
      .then((json) => {
        if (mounted) setPembimbing(json);
      })
      .catch((err) => {
        console.warn("fetch pembimbing error:", err);
        if (mounted) setPembimbing(null);
      });
    return () => (mounted = false);
  }, [selectedItem]);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const cocokSearch =
        (item.nama_pekerjaan || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (item.deskripsi || "").toLowerCase().includes(searchTerm.toLowerCase());
      const cocokJurusan =
        jurusanFilter === "Semua" || item.nama_jurusan === jurusanFilter;
      return cocokSearch && cocokJurusan;
    });
  }, [data, searchTerm, jurusanFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [currentPage, filtered]);

  const safeSrc = (path) =>
    path
      ? `http://localhost:3000/uploads/pembinat/${path}`
      : "http://localhost:3000/uploads/placeholder.png";

  const safePembimbingImg = (path) =>
    path
      ? `http://localhost:3000/uploads/pembimbing/${path}`
      : "http://localhost:3000/uploads/default-user.png";

  const jurusanList = useMemo(() => {
    const all = data.map((d) => d.nama_jurusan).filter(Boolean);
    return ["Semua", ...new Set(all)];
  }, [data]);

  return (
    <div className="container mx-auto px-6 sm:px-10 lg:px-24 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Pembinat Pekerjaan
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            placeholder="Cari pekerjaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:w-[240px]"
          />
          <Select value={jurusanFilter} onValueChange={setJurusanFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Pilih jurusan" />
            </SelectTrigger>
            <SelectContent>
              {jurusanList.map((j) => (
                <SelectItem key={j} value={j}>
                  {j}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {pageItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pageItems.map((item) => (
            <Card
              key={item.id_pekerjaan}
              className="p-0 rounded-2xl border border-gray-100 hover:shadow-lg transition-all bg-white cursor-pointer"
              onClick={() => {
                setSelectedItem(item);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <CardContent className="p-5 flex flex-col text-left">
                <div className="relative w-full h-[250px] rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={safeSrc(item.gambar_pekerjaan)}
                    alt={item.nama_pekerjaan}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm border border-gray-200">
                    {item.nama_jurusan || "Umum"}
                  </span>
                </div>

                <h3 className="font-semibold text-[16px] mt-3 line-clamp-2 text-gray-900">
                  {item.nama_pekerjaan}
                </h3>
                <p className="text-gray-500 text-[14px] mt-1 line-clamp-3">
                  {item.deskripsi?.slice(0, 100)}...
                </p>

                <Button className="mt-4 w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium">
                  Lihat Detail →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-10">Tidak ada pembinat ditemukan.</p>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ‹ Sebelumnya
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Selanjutnya ›
          </Button>
        </div>
      )}

      {/* Modal Detail */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        {selectedItem && (
          <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 overflow-hidden">
            {/* Header */}
            <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {selectedItem.nama_pekerjaan}
                </DialogTitle>
                {/* Single close button top-right */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedItem(null)}
                  className="ml-4"
                  title="Tutup"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </Button>
              </div>

              {/* Gambar */}
              <div className="w-full h-[250px] rounded-xl overflow-hidden mb-5">
                <img
                  src={safeSrc(selectedItem.gambar_pekerjaan)}
                  alt={selectedItem.nama_pekerjaan}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Deskripsi */}
              <DialogDescription className="text-gray-600 text-[15px] leading-relaxed mb-6">
                {selectedItem.deskripsi}
              </DialogDescription>

              {/* Pembimbing */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Pembimbing</h3>

                {pembimbing ? (
                  <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                    <img
                      src={safePembimbingImg(pembimbing.foto_pembimbing)}
                      alt={pembimbing.nama}
                      className="w-14 h-14 rounded-full object-cover border border-gray-200"
                    />
                    <div className="flex-1">
                      <p className="text-base font-medium text-gray-900">{pembimbing.nama}</p>
                      <p className="text-sm text-gray-500">{pembimbing.jabatan || "Guru Pembimbing"}</p>
                      {pembimbing.deskripsi && <p className="text-xs text-gray-500 mt-1">{pembimbing.deskripsi}</p>}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Data pembimbing belum tersedia.</p>
                )}
              </div>

              {/* Jurusan + WA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6">
                <p className="text-sm text-gray-500">
                  Jurusan:{" "}
                  <span className="font-medium text-gray-800">{selectedItem.nama_jurusan || "Tidak ada"}</span>
                </p>

                <Button
                  onClick={() => {
                    const pemb = pembimbing;
                    const link = pemb?.link_wa
                      ? pemb.link_wa
                      : pemb?.nomor_wa
                      ? `https://wa.me/${pemb.nomor_wa}`
                      : `https://wa.me/6280000000000`;
                    window.open(link, "_blank");
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                >
                  💬 Kontak Sekarang
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}