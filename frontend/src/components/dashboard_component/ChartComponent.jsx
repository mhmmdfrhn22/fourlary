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
  users: {
    label: "Pengguna",
    color: "var(--chart-1)",
  },
}

export function ChartComponent() {
  const [timeRange, setTimeRange] = useState("7d")
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`https://backend-fourlary-production.up.railway.app/api/user/stats?range=${timeRange}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        // Generate the full list of dates for the selected range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30));
        const dateList = [];

        // Generate an array of dates (e.g., 7 days back)
        for (let i = 0; i < (timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30); i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          dateList.push(date.toISOString().split('T')[0]);  // format as YYYY-MM-DD
        }

        // Fill missing data for each day with zero
        const formattedData = dateList.map(date => {
          const matchingData = data.find(item => item.date === date);
          return {
            date: date,
            users: matchingData ? matchingData.total : 0,  // if no data, set users to 0
          };
        });

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchData();
  }, [timeRange]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Grafik Pertumbuhan Pengguna</CardTitle>
          <CardDescription>
            Menampilkan jumlah pengguna baru dalam {timeRange}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
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
        <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={16}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                });
              }}
              height={60}
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
              dataKey="users"
              type="monotone"
              fill="url(#fillUsers)"
              stroke="var(--chart-1)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
