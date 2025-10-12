import React from "react";

export default function DashboardPDD() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Dashboard PDD Sekolah
        </h1>
        <p className="text-gray-600 mb-6">
          Selamat datang di dashboard khusus PDD Sekolah.  
          Fitur-fitur utama akan segera ditambahkan di sini.
        </p>
        <div className="border-t pt-4 text-gray-500 text-sm">
          © {new Date().getFullYear()} Fourlary. All rights reserved.
        </div>
      </div>
    </div>
  );
}