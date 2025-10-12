"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, Share2 } from "lucide-react"

export default function GalleryModal({ open, onClose, fotoId }) {
  const [foto, setFoto] = useState(null)
  const [komentar, setKomentar] = useState([])
  const [newKomentar, setNewKomentar] = useState("")
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const userId = 1 // nanti ganti dengan id user login

  useEffect(() => {
    if (open && fotoId) fetchData()
  }, [fotoId, open])

  const fetchData = async () => {
    try {
      const [fotoRes, komentarRes, likeRes, checkLike] = await Promise.all([
        fetch(`http://localhost:3000/api/foto/${fotoId}`).then(r => r.json()),
        fetch(`http://localhost:3000/api/komentar/${fotoId}`).then(r => r.json()),
        fetch(`http://localhost:3000/api/like/${fotoId}`).then(r => r.json()),
        fetch(`http://localhost:3000/api/like/check/${fotoId}/${userId}`).then(r => r.json()),
      ])

      setFoto(fotoRes)
      setKomentar(komentarRes)
      setLikeCount(likeRes.total_like)
      setLiked(checkLike.liked)
    } catch (err) {
      console.error("Gagal memuat detail:", err)
    }
  }

  const toggleLike = async () => {
    setLiked(!liked)
    setLikeCount(prev => prev + (liked ? -1 : 1))
    const url = liked ? "remove" : "add"

    await fetch(`http://localhost:3000/api/like/${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_foto: fotoId, id_user: userId }),
    })
  }

  const sendKomentar = async (e) => {
    e.preventDefault()
    if (!newKomentar.trim()) return

    await fetch("http://localhost:3000/api/komentar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_foto: fotoId, id_user: userId, isi_komentar: newKomentar }),
    })
    setNewKomentar("")
    fetchData()
  }

  if (!foto) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden rounded-2xl shadow-2xl animate-in fade-in-50 duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[80vh]">
          {/* Foto */}
          <div className="bg-black flex justify-center items-center">
            <img
              src={`http://localhost:3000/uploads/galeri/${foto.url_foto}`}
              alt={foto.deskripsi}
              className="object-contain max-h-full w-full"
            />
          </div>

          {/* Detail */}
          <div className="flex flex-col bg-white">
            <DialogHeader className="px-5 py-4 border-b">
              <DialogTitle className="text-lg font-semibold flex justify-between items-center">
                <span>{foto.deskripsi}</span>
                <Badge>{foto.nama_kategori}</Badge>
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Diunggah oleh <span className="font-semibold">{foto.uploader}</span>
              </p>
            </DialogHeader>

            <ScrollArea className="flex-1 p-5 pr-3">
              {komentar.length > 0 ? (
                komentar.map((k, i) => (
                  <div key={i} className="mb-3">
                    <p className="text-sm">
                      <span className="font-semibold">{k.username}</span> {k.isi_komentar}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(k.tanggal_komentar).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center mt-10">Belum ada komentar.</p>
              )}
            </ScrollArea>

            <Separator />

            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={toggleLike}>
                  <Heart
                    className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </Button>
                <span className="text-sm">{likeCount} suka</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  navigator.share?.({ title: foto.deskripsi, url: window.location.href })
                }
              >
                <Share2 className="h-5 w-5 text-gray-600" />
              </Button>
            </div>

            <Separator />

            <form onSubmit={sendKomentar} className="p-4 flex items-center gap-2 border-t">
              <Input
                placeholder="Tambahkan komentar..."
                value={newKomentar}
                onChange={(e) => setNewKomentar(e.target.value)}
              />
              <Button type="submit">Kirim</Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}