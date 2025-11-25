import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useLocation, useNavigate } from 'react-router-dom';

const API_URL = 'https://backend-fourlary-production.up.railway.app/api/user';

export default function VerifyEmail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (!state?.userId) {
      navigate('/login');
    }
  }, [state, navigate]);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    const otpString = otp.toUpperCase().trim();

    try {
      const response = await fetch(`${API_URL}/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp: otpString,
          userId: state?.userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Email Berhasil Diverifikasi!',
          text: 'Sekarang Anda bisa login.',
        }).then(() => navigate('/login'));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Verifikasi Gagal',
          text: data.message || 'OTP salah.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Server tidak dapat dijangkau.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-gray-50">
      {/* 🔹 FORM DI KANAN */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-xs">
          <div className="flex flex-col gap-6">
            <form onSubmit={handleVerifyEmail}>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Ayo Cek Email Anda Dan Verifikasi OTP Disini 😏</h1>
                <p className="text-muted-foreground text-sm">
                  Masukkan kode OTP yang dikirim ke email Anda.
                </p>
              </div>
              <br />
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="otp">Kode OTP</Label>
                  <InputOTP
                    id="otp"
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value.toUpperCase())}
                    required
                  >
                    <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                    </InputOTPGroup>

                    <InputOTPSeparator />

                    <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>

                    <InputOTPSeparator />

                    <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
                >
                  Verifikasi
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
          alt="Authentication Illustration"
          className="absolute inset-0 w-full h-full object-cover filter saturate-0"
        />
      </div>
    </div>
  );
}
