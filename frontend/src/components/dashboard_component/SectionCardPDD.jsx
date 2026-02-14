import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { IconPhoto, IconNews, IconHeart, IconMessageCircle } from "@tabler/icons-react"

export function SectionCardPDD() {
    const [stats, setStats] = useState({
        foto: 0,
        berita: 0,
        likes: 0,
        komentar: 0,
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const rawUser = localStorage.getItem("user")
                if (!rawUser) {
                    console.warn("Tidak ada user di localStorage")
                    return
                }

                const user = JSON.parse(rawUser)
                const userId = user?.id
                if (!userId) {
                    console.warn("User ID tidak ditemukan")
                    return
                }

                console.log("Mengambil data untuk user:", userId)

                const [beritaRes, fotoRes, likesRes, komentarRes] = await Promise.all([
                    fetch(`https://backend-fourlary-production.up.railway.app/api/posts/count/${userId}`).then(r => r.json()),
                    fetch(`https://backend-fourlary-production.up.railway.app/api/foto/count/${userId}`).then(r => r.json()),
                    fetch(`https://backend-fourlary-production.up.railway.app/api/like-foto/count/${userId}`).then(r => r.json()),
                    fetch(`https://backend-fourlary-production.up.railway.app/api/komentar-foto/count/${userId}`).then(r => r.json()),
                ]);

                console.log("Respon berita:", beritaRes)

                setStats({
                    foto: fotoRes.total || 0,
                    berita: beritaRes.total || 0,
                    likes: likesRes.total || 0,
                    komentar: komentarRes.total || 0,
                });

            } catch (err) {
                console.error("Gagal mengambil data perkembangan PDD:", err)
            }
        }

        fetchStats()
    }, [])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 lg:px-6">
            {/* Foto */}
            <Card className="@container/card">
                <CardHeader className="flex flex-row items-center justify-between px-8 py-2">
                    <div>
                        <CardDescription>Total Foto yang Diupload</CardDescription>
                        <CardTitle className="text-2xl font-semibold text-blue-600">
                            {stats.foto}
                        </CardTitle>
                        <div className="text-muted-foreground text-base font-semibold tracking-wide">
                            Foto yang telah dibagikan olehmu
                        </div>
                    </div>
                    <IconPhoto className="h-10 w-10 text-blue-500" />
                </CardHeader>
            </Card>

            {/* Berita */}
            <Card className="@container/card">
                <CardHeader className="flex flex-row items-center justify-between px-8 py-2">
                    <div>
                        <CardDescription>Total Berita yang Dipublikasikan</CardDescription>
                        <CardTitle className="text-2xl font-semibold text-blue-600">
                            {stats.berita}
                        </CardTitle>
                        <div className="text-muted-foreground text-base font-semibold tracking-wide">
                            Jumlah berita yang kamu unggah
                        </div>
                    </div>
                    <IconNews className="h-10 w-10 text-blue-500" />
                </CardHeader>
            </Card>

            {/* Likes */}
            <Card className="@container/card">
                <CardHeader className="flex flex-row items-center justify-between px-8 py-2">
                    <div>
                        <CardDescription>Total Like yang Didapatkan</CardDescription>
                        <CardTitle className="text-2xl font-semibold text-blue-600">
                            {stats.likes}
                        </CardTitle>
                        <div className="text-muted-foreground text-base font-semibold tracking-wide">
                            Total pengguna yang menyukai postinganmu
                        </div>
                    </div>
                    <IconHeart className="h-10 w-10 text-blue-500" />
                </CardHeader>
            </Card>

            {/* Komentar */}
            <Card className="@container/card">
                <CardHeader className="flex flex-row items-center justify-between px-8 py-2">
                    <div>
                        <CardDescription>Total Komentar yang Diterima</CardDescription>
                        <CardTitle className="text-2xl font-semibold text-blue-600">
                            {stats.komentar}
                        </CardTitle>
                        <div className="text-muted-foreground text-base font-semibold tracking-wide">
                            Komentar dari pengguna lain di postinganmu
                        </div>
                    </div>
                    <IconMessageCircle className="h-10 w-10 text-blue-500" />
                </CardHeader>
            </Card>
        </div>
    )
}
