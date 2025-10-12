import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// URL API Anda. Ganti dengan URL server Anda jika sudah di-deploy.
const API_URL = 'http://localhost:3000/api/user';

export function RegisterComponent({ className, ...props }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Set role_id secara default ke 1 (guest)
      const role = 1;

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role_id: role }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'Registrasi Gagal',
            text: errorData.errors ? errorData.errors[0].msg : 'Terjadi kesalahan pada data yang Anda masukkan.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Registrasi Gagal',
            text: 'Terjadi kesalahan server. Mohon coba lagi nanti.',
          });
        }
        return;
      }

      const data = await response.json();
      
      Swal.fire({
        icon: 'success',
        title: 'Registrasi Berhasil!',
        text: 'Sekarang Anda bisa login.',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      console.error('Register error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Terjadi kesalahan jaringan atau server tidak dapat dijangkau.',
      });
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleRegister} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Hallo, Selamat Datang Pengguna di <span className="text-blue-800">Fourlary 👋</span></h1>
        <p className="text-muted-foreground text-sm text-balance">
          Buat akun untuk masuk ke aplikasi
        </p>
      </div>

      <div className="grid gap-6">
        {/* Username */}
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Masukkan username Anda"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

        {/* Button Daftar */}
        <Button type="submit" className="w-full">
          Daftar
        </Button>

        {/* Separator */}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Sudah Punya Akun?
          </span>
        </div>

        {/* Button Masuk */}
        <Link to="/login" className="w-full">
          <Button variant="outline" className="w-full">
            Masuk Sekarang
          </Button>
        </Link>
      </div>
    </form>
  );
}