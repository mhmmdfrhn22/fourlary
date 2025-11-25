'use client'

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../../context/AuthContext";

const API_URL = 'https://backend-fourlary-production.up.railway.app/api/user';

export default function LoginComponent({ className, ...props }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth(); // <-- ambil login dari context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Kirim email dan password
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          id: data.user.id,
          username: data.user.username,
          role_id: data.user.role_id,
        };

        login(userData, data.token); // ⬅️ pake context

        Swal.fire({
          icon: "success",
          title: "Login Berhasil!",
          text: "Selamat datang kembali!",
          confirmButtonText: "Lanjutkan",
        }).then(() => {
          if (userData.role_id === 2) {
            navigate("/dashboard"); // Admin
          } else if (userData.role_id === 3) {
            navigate("/dashboard-pdd"); // PDD
          } else {
            navigate("/"); // Guest
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Gagal!",
          text: data.message || "Email atau password salah",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan!",
        text: "Server tidak merespons, coba lagi nanti.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          Selamat Datang di <span className="text-blue-800">Fourlary 👋</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Masukkan email dan password Anda
        </p>
      </div>

      <div className="grid gap-6">
        {/* Email */}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Masukkan email Anda"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Masukkan password Anda"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Tombol login */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
        </Button>

        {/* Separator */}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Belum punya akun?
          </span>
        </div>

        {/* Tombol daftar */}
        <Link to="/register" className="w-full">
          <Button variant="outline" className="w-full">
            Daftar Sekarang
          </Button>
        </Link>
      </div>
    </form>
  );
}
