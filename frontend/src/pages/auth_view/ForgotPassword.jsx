'use client'

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_URL = 'https://backend-fourlary-production.up.railway.app/api/user';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // Kirim email untuk OTP
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "OTP Telah Dikirim!",
          text: "Cek email Anda untuk mendapatkan OTP.",
        }).then(() => {
          // Redirect ke halaman reset password
          window.location.href = '/login';
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Mengirim OTP",
          text: data.message || "Terjadi kesalahan saat mengirim OTP.",
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      Swal.fire({
        icon: "error",
        title: "Error Occurred",
        text: "Terjadi kesalahan jaringan atau server tidak dapat dijangkau.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-gray-50">
      {/* 🔹 FORM DI KANAN */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-xs">
          <div className="flex flex-col gap-6">
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Lupa Password?</h1>
                <p className="text-muted-foreground text-sm">
                  Masukkan email Anda untuk menerima OTP.
                </p>
              </div>
              <br />
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email Anda"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
                >
                  Kirim OTP
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* LEFT IMAGE */}
      <div className="relative hidden lg:block w-1/2">
        <img
          src="/frame_6262403.png"
          alt="Forgot Password Illustration"
          className="absolute inset-0 w-full h-full object-cover filter saturate-0"
        />
      </div>
    </div>
  );
}
