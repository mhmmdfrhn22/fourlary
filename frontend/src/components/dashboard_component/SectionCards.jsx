import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { IconUsers, IconPhoto, IconNews, IconCamera } from "@tabler/icons-react"

export function SectionCards() {
  const [counts, setCounts] = useState({
    users: 0,
    posts: 0,
    publikasi: 0,
    foto: 0,
  })

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [usersRes, postsRes, publikasiRes, photosRes] = await Promise.all([
          fetch("https://backend-fourlary-production.up.railway.app/api/user/count").then(res => res.json()),
          fetch("https://backend-fourlary-production.up.railway.app/api/posts/count").then(res => res.json()),
          fetch("https://backend-fourlary-production.up.railway.app/api/user/publikasi/count").then(res => res.json()),
          fetch("https://backend-fourlary-production.up.railway.app/api/foto/count").then(res => res.json()),
        ])

        setCounts({
          users: usersRes.total || 0,
          posts: postsRes.total || 0,
          publikasi: publikasiRes.total || 0,
          foto: photosRes.total || 0,
        })
      } catch (err) {
        console.error("Failed to fetch counts:", err)
      }
    }

    fetchCounts()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 lg:px-6">
      {/* Total User */}
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between px-8 py-1">
          <div>
            <CardDescription>Jumlah Total Pengguna</CardDescription>
            <CardTitle className="text-2xl font-semibold text-blue-600">
              {counts.users}
            </CardTitle>
            <div className="text-muted-foreground text-base font-semibold tracking-wide">
              Pengguna Yang Sudah Di daftarkan
            </div>
          </div>
          <IconUsers className="h-10 w-10 text-blue-500" />
        </CardHeader>
      </Card>

      {/* Total Berita */}
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between px-8 py-1">
          <div>
            <CardDescription>Jumlah Total Berita</CardDescription>
            <CardTitle className="text-2xl font-semibold text-blue-600">
              {counts.posts}
            </CardTitle>
            <div className="text-muted-foreground text-base font-semibold tracking-wide">
              Berita Di Publikasi
            </div>
          </div>
          <IconNews className="h-10 w-10 text-blue-500" />
        </CardHeader>
      </Card>

      {/* Total Tim Publikasi */}
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between px-8 py-1">
          <div>
            <CardDescription>Jumlah Tim Publikasi</CardDescription>
            <CardTitle className="text-2xl font-semibold text-blue-600">
              {counts.publikasi}
            </CardTitle>
            <div className="text-muted-foreground text-base font-semibold tracking-wide">
              Yang Bertugas Mempublikasi
            </div>
          </div>
          <IconCamera className="h-10 w-10 text-blue-500" />
        </CardHeader>
      </Card>

      {/* Total Foto */}
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between px-8 py-1">
          <div>
            <CardDescription>Jumlah Total Foto di Galeri</CardDescription>
            <CardTitle className="text-2xl font-semibold text-blue-600">
              {counts.foto}
            </CardTitle>
            <div className="text-muted-foreground text-base font-semibold tracking-wide">
              Yang Berhasil Di Abadikan
            </div>
          </div>
          <IconPhoto className="h-10 w-10 text-blue-500" />
        </CardHeader>
      </Card>
    </div>
  )
}