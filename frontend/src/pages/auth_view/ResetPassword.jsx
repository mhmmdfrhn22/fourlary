import React, { useState } from 'react'; // <-- Pastikan untuk mengimpor useState
import Swal from 'sweetalert2';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_URL = 'https://backend-fourlary-production.up.railway.app/api/user';

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');  // State untuk newPassword
    const [confirmPassword, setConfirmPassword] = useState('');  // State untuk confirmPassword
    const token = new URLSearchParams(window.location.search).get('token');  // Ambil token dari URL

    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Validasi konfirmasi password
        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password tidak cocok',
                text: 'Password baru dan konfirmasi password harus sama.',
            });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword, confirmPassword, token }),  // Kirim token dan newPassword
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Berhasil Direset!',
                    text: 'Anda sekarang dapat login dengan password baru.',
                }).then(() => {
                    window.location.href = '/login'; // Redirect ke halaman login
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Reset Password Gagal',
                    text: data.message || 'Terjadi kesalahan dalam proses reset password.',
                });
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Terjadi kesalahan jaringan atau server tidak dapat dijangkau.',
            });
        }
    };

    return (
        <div className="min-h-screen flex items-stretch bg-gray-50">
            {/* 🔹 FORM DI KANAN */}
            <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
                <div className="w-full max-w-xs">
                    <div className="flex flex-col gap-6">
                        <form onSubmit={handleResetPassword}>
                            <div className="flex flex-col items-center gap-1 text-center">
                                <h1 className="text-2xl font-bold">Reset Password</h1>
                                <p className="text-muted-foreground text-sm">
                                    Masukkan password baru Anda
                                </p>
                            </div>
                            <br />
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="newPassword">Password Baru</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="Masukkan password baru"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="p-3 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Masukkan konfirmasi password baru"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="p-3 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <Button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
                                    Reset Password
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
                    alt="Reset Password Illustration"
                    className="absolute inset-0 w-full h-full object-cover filter saturate-0"
                />
            </div>
        </div>
    );
}
