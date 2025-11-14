"use client"

import React, { useEffect, useState } from "react"
import { SectionCardPDD } from "@/components/SectionCardPDD"
import { ChartComponentPDD } from "@/components/ChartComponentPDD"

export default function DashboardHomePDD() {
  // ✅ Simulasikan userId (misalnya dari login, context, atau localStorage)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        console.log("User ditemukan, id:", parsed.id)
        setUserId(parsed.id)               // <-- FIX DISINI
      } catch {
        console.log("Gagal parse user, fallback ke 3")
        setUserId(3)
      }
    } else {
      console.log("Tidak ada user di localStorage, fallback 3")
      setUserId(3)
    }
  }, [])

  return (
    <div className="p-6 space-y-6">
      <SectionCardPDD userId={userId} />
      <ChartComponentPDD userId={userId} />
    </div>
  )
}