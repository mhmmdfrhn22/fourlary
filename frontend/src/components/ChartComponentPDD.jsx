"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartConfig = {
  likes: {
    label: "Like",
    color: "var(--chart-2)",
  },
}

export function ChartComponentPDD({ userId }) {
  const [timeRange, setTimeRange] = useState("7d")
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // ✅ Debug: pastikan userId benar-benar terkirim dari parent
    console.log("🧩 [ChartComponentPDD] Diterima userId:", userId)

    if (!userId) {
      console.warn("⚠️ [ChartComponentPDD] userId tidak ditemukan, hentikan fetch data grafik.")
      setChartData([]) // kosongkan agar tidak error
      return
    }

    async function fetchData() {
      setLoading(true)
      try {
        const url = `http://localhost:3000/api/like-foto/stats/${userId}?range=${timeRange}`
        console.log("🌐 [ChartComponentPDD] Fetching data dari:", url)

        const res = await fetch(url)
        if (!res.ok) throw new Error("Gagal mengambil data perkembangan like")

        const data = await res.json()
        console.log("🧩 [ChartComponentPDD] Data mentah dari backend:", data)

        // Pastikan data berbentuk array
        const safeData = Array.isArray(data) ? data : [data]

        // Format data untuk chart
        const formatted = safeData.map((item) => {
          const date = item.date ? new Date(item.date) : new Date()
          return {
            date: date.toISOString().split("T")[0], // format YYYY-MM-DD
            likes: item.total ?? 0, // total dari backend
          }
        })

        // Tambahkan 1 titik dummy jika hanya ada satu data biar grafik terlihat
        if (formatted.length === 1) {
          formatted.push({
            date: formatted[0].date,
            likes: formatted[0].likes,
          })
        }

        console.log("📊 [ChartComponentPDD] Data final untuk chart:", formatted)
        setChartData(formatted)
      } catch (error) {
        console.error("❌ [ChartComponentPDD] Gagal fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange, userId])

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Grafik Perkembangan Like</CardTitle>
          <CardDescription>
            Menampilkan jumlah like yang diterima user dalam {timeRange}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Pilih range waktu"
          >
            <SelectValue placeholder="Pilih range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7d">7 Hari Terakhir</SelectItem>
            <SelectItem value="14d">14 Hari Terakhir</SelectItem>
            <SelectItem value="30d">30 Hari Terakhir</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex items-center justify-center h-[250px] text-gray-500">
            Memuat grafik...
          </div>
        ) : chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillLikes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("id-ID", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("id-ID", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />

              <Area
                dataKey="likes"
                type="natural"
                fill="url(#fillLikes)"
                stroke="var(--chart-2)"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-gray-400">
            Tidak ada data untuk ditampilkan
          </div>
        )}
      </CardContent>
    </Card>
  )
}