// src/components/SplashScreen.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import heroLogo from "../../assets/logofourlary.svg"; // pastikan path benar

const SplashScreen = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      // biarkan animasi fade-out selesai baru lanjut ke halaman
      setTimeout(() => {
        onFinish?.();
      }, 800); // sesuai durasi fade out
    }, 2000); // waktu tampil splash sebelum mulai menghilang
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 flex items-center justify-center bg-white z-[9999]"
        >
          <motion.img
            src={heroLogo}
            alt="Logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="w-36 h-auto select-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
