"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Code,
  Network,
  Car,
  Hammer,
  CheckCircle,
} from "lucide-react"

// Mengimpor gambar untuk jurusan
import PPLGImage from "../../assets/PPLG.jpg";
import TJKTImage from "../../assets/TJKT.jpg";
import TOImage from "../../assets/TO.jpg";
import TPImage from "../../assets/TP.jpg";

export default function JurusanSekolah() {
  const jurusanList = [
    {
      nama: "PPLG (Pengembangan Perangkat Lunak dan Gim)",
      icon: Code,
      pelajaran: [
        "Pemrograman",
        "Desain UI/UX",
        "Basis Data",
        "Game Development",
      ],
      fakta: [
        "Menerapkan profesionalisme dan etika kerja bidang Rekayasa Perangkat Lunak.",
        "Berkomunikasi efektif dalam tim lintas bidang dan stakeholder.",
        "Mengikuti perkembangan teknologi baru di software engineering.",
        "Bekerja sama secara efektif sebagai anggota maupun tim proyek.",
        "Memiliki jiwa kewirausahaan di bidang industri kreatif digital.",
      ],
      gambar: PPLGImage, // Menggunakan gambar yang diimpor
    },
    {
      nama: "TJKT (Teknik Jaringan Komputer dan Telekomunikasi)",
      icon: Network,
      pelajaran: [
        "Jaringan Komputer",
        "Server & Cloud",
        "Keamanan Jaringan",
        "Fiber Optic",
      ],
      fakta: [
        "Menguasai konsep jaringan komputer dari LAN hingga WAN.",
        "Mampu merancang dan mengkonfigurasi jaringan berbasis kabel dan nirkabel.",
        "Memahami dasar-dasar keamanan jaringan dan troubleshooting sistem.",
        "Mampu mengelola server berbasis Linux dan Windows Server.",
        "Mengetahui dasar-dasar teknologi fiber optic dan instalasinya.",
      ],
      gambar: TJKTImage, // Menggunakan gambar yang diimpor
    },
    {
      nama: "Teknik Otomotif",
      icon: Car,
      pelajaran: [
        "Mesin Kendaraan",
        "Sistem Kelistrikan",
        "Diagnosa Mobil",
        "Perawatan Mesin",
      ],
      fakta: [
        "Menguasai sistem mekanik dan kelistrikan kendaraan bermotor.",
        "Mampu melakukan perawatan, perbaikan, dan diagnosa kerusakan kendaraan.",
        "Mengenal teknologi otomotif terkini termasuk kendaraan listrik.",
        "Mampu membaca dan memahami diagram sistem otomotif modern.",
        "Menjaga keselamatan kerja dan menerapkan standar industri otomotif.",
      ],
      gambar: TOImage, // Menggunakan gambar yang diimpor
    },
    {
      nama: "Teknik Pengelasan",
      icon: Hammer,
      pelajaran: [
        "Proses Pengelasan",
        "Desain Konstruksi",
        "Fabrikasi Logam",
      ],
      fakta: [
        "Mampu melakukan berbagai teknik pengelasan dengan alat modern.",
        "Mengetahui standar keamanan kerja dalam bidang industri logam.",
        "Mampu membaca gambar teknik dan menerjemahkannya ke dalam hasil kerja.",
        "Menguasai fabrikasi logam untuk berbagai kebutuhan industri.",
        "Siap bersaing di dunia industri manufaktur dan konstruksi.",
      ],
      gambar: TPImage, // Menggunakan gambar yang diimpor
    },
  ]

  return (
    <div className="min-h-screen py-20">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto text-center mb-16 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-4xl font-semibold text-gray-700"
        >
          Jurusan SMK Negeri 4 Bogor
        </motion.h1>
        <p className="text-gray-600 mt-4 text-sm md:text-lg">
          Empat jurusan unggulan yang membekali siswa dengan keahlian siap industri dan siap masa depan.
        </p>
      </div>

      {/* Grid Jurusan */}
      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-2 px-6">
        {jurusanList.map((item, index) => (
          <motion.div
            key={item.nama}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <Card className="p-1 overflow-hidden border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl bg-white">
              {/* Image Section */}
              <div className="rounded-2xl relative h-62 overflow-hidden">
                <img
                  src={item.gambar} // Gambar yang sudah diimpor
                  alt={item.nama}
                  className="rounded-2xl object-cover w-full h-full transform hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-blue-700/20"></div>
              </div>

              {/* Content Section */}
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-blue-700">
                  <item.icon className="h-5 w-5" />
                  {item.nama}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 pb-6">
                {/* Label Pelajaran */}
                <div className="flex flex-wrap gap-2">
                  {item.pelajaran.map((mapel, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 text-xs px-2 py-1 rounded-full"
                    >
                      {mapel}
                    </Badge>
                  ))}
                </div>

                {/* Fakta Kejuruan */}
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  {item.fakta.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="text-blue-600 w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
