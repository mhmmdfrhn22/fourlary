"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const FloatingInstallButton = () => {
    const downloadLink =
        "https://drive.google.com/uc?export=download&id=1zOt7wXI3i4yVNqk79SnMDv_jDC082cyg";

    const [showHint, setShowHint] = useState(false);
    const [shake, setShake] = useState(false);

    // Hint buat pengguna ngeliat
    useEffect(() => {
        const interval = setInterval(() => {
            setShowHint(true);
            setShake(true);
            const timeout = setTimeout(() => {
                setShowHint(false);
                setShake(false);
            }, 3000);
            return () => clearTimeout(timeout);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    // animasi shake tipis tipis 
    const shakeVariants = {
        shake: {
            x: [0, -5, 5, -3, 3, 0],
            transition: { duration: 0.5, ease: "easeInOut" },
        },
    };

    // Animasi muncul pertama kali
    const appearVariants = {
        hidden: { opacity: 0, scale: 0.7, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <motion.div
                    className="fixed z-50 flex flex-col items-center 
                        bottom-10 right-10 
                        sm:bottom-14 sm:right-14"
                    variants={appearVariants}
                    initial="hidden"
                    animate="visible"
                    whileInView="visible"
                >
                    <motion.div
                        animate={shake ? "shake" : ""}
                        variants={shakeVariants}
                    >
                        {/* Hint bubble */}
                        <AnimatePresence>
                            {showHint && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 
                                        bg-white text-black shadow-md rounded-2xl 
                                        px-3 py-2 text-xs sm:text-sm font-medium border border-gray-100 
                                        max-w-[220px] sm:max-w-[240px] text-center"
                                >
                                    💬 Ingin mencoba{" "}
                                    <span className="font-semibold text-blue-600">Fourlary</span> di Handphone Anda?
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Tombol utama */}
                        <Button
                            variant="default"
                            size="icon"
                            className="rounded-full shadow-lg shadow-blue-200/40 
                                bg-blue-600 hover:bg-blue-700 transition-all duration-300 
                                flex items-center justify-center 
                                w-[60px] h-[60px] sm:w-[64px] sm:h-[64px]"
                        >
                            <img
                                src="/src/assets/logo.png"
                                alt="Fourlary Logo"
                                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                            />
                        </Button>
                    </motion.div>
                </motion.div>
            </DialogTrigger>

            {/* Modal */}
            <DialogContent className="max-w-sm text-center">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Install Aplikasi Kami
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 mt-2">
                        Dapatkan pengalaman lebih baik melalui aplikasi mobile kami.
                        Klik tombol di bawah untuk mengunduh file APK.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <Button
                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => window.open(downloadLink, "_blank")}
                    >
                        Download APK
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FloatingInstallButton;
