"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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

export function ChartComponentPDD({ userId: propUserId }) {
  const [userId, setUserId] = useState(null)
  const [timeRange, setTimeRange] = useState("7d")
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(false)

  // Ambil userId saat mount
  useEffect(() => {
    let uid = propUserId

    if (!uid) {
      const storedUser = localStorage.getItem("user")

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser)
          uid = parsed.id
        } catch {
          uid = 3
        }
      } else {
        uid = 3
      }
    }

    console.log("USER ID YANG DIPAKAI:", uid)
    setUserId(Number(uid))
  }, [propUserId])

  // Fetch data statistik
  useEffect(() => {
    if (!userId || isNaN(userId)) return

    async function fetchData() {
      setLoading(true)
      setChartData([])

      try {
        const url = `https://backend-fourlary-production.up.railway.app/api/like-foto/stats/${userId}?range=${timeRange}`
        console.log("Fetching:", url)

        const res = await fetch(url)
        if (!res.ok) throw new Error("Gagal fetch data")

        const data = await res.json()
        console.log("DATA DARI BACKEND:", data)

        const formatted = Array.isArray(data)
          ? data.map((item) => ({
            date: item.date,   // pakai format YYYY-MM-DD langsung
            likes: item.total ?? 0,
          }))
          : [];


        // Antisipasi data cuma satu titik
        if (formatted.length === 1) {
          formatted.push({ ...formatted[0] })
        }

        setChartData(formatted)
      } catch (error) {
        console.error("ERROR AMBIL DATA:", error)
        setChartData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId, timeRange])

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Grafik Perkembangan Like</CardTitle>
          <CardDescription>
            Menampilkan jumlah like yang diterima user ID {userId} dalam{" "}
            {timeRange === "7d"
              ? "7 Hari Terakhir"
              : timeRange === "14d"
                ? "14 Hari Terakhir"
                : "30 Hari Terakhir"}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
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
          <div className="flex items-center justify-center h-[250px] text-gray-500 animate-pulse">
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

              <CartesianGrid vertical={false} strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                interval={0} // tampilkan SEMUA tanggal, tidak diskip
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
                tickFormatter={(value) => {
                  const d = new Date(value + "T00:00:00")
                  return d.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })
                }}
              />

              {/* FIX UTAMA: grafik tidak terpotong & tidak masuk angka minus */}
              <YAxis
                allowDecimals={false}
                domain={[0, "auto"]}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toFixed(0)}  // tanpa koma
              />


              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value + "T00:00:00").toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />

              {/* FIX BESAR: NATURAL → MONOTONE */}
              <Area
                dataKey="likes"
                type="monotone"
                fill="url(#fillLikes)"
                stroke="var(--chart-2)"
                strokeWidth={2}
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
