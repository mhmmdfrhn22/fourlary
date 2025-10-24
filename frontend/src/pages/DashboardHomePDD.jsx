"use client"

import React, { useEffect, useState } from "react"
import { SectionCardPDD } from "@/components/SectionCardPDD"
import { ChartComponentPDD } from "@/components/ChartComponentPDD"

export default function DashboardHomePDD() {
  // ✅ Simulasikan userId (misalnya dari login, context, atau localStorage)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    // contoh ambil userId dari localStorage
    const storedUserId = localStorage.getItem("userId")
    if (storedUserId) {
      console.log("✅ User ID ditemukan dari localStorage:", storedUserId)
      setUserId(storedUserId)
    } else {
      console.warn("⚠️ Tidak ada userId di localStorage — gunakan id default 3")
      setUserId(3) // fallback sementara
    }
  }, [])

  return (
    <div className="p-6 space-y-6">
      <SectionCardPDD userId={userId} />
      <ChartComponentPDD userId={userId} />
    </div>
  )
}