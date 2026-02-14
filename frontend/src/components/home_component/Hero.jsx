import { motion } from "framer-motion";
import { Link } from 'react-router-dom'; // Import Link from React Router

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative isolate px-6 pt-14 lg:px-8"
    >
      {/* Background Shape Atas */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] 
          -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] 
          to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
        />
      </div>

      {/* Isi Hero */}
      <div className="mx-auto max-w-3xl py-20 sm:py-28 lg:py-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="hidden sm:mb-8 sm:flex sm:justify-center"
        >
          <div className="relative rounded-full px-3 py-1 text-base text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Selamat datang di <span className="font-semibold">Fourlary✨</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
            Jelajahi Bersama Galeri SMK Negeri 4 Bogor Dengan{" "}
            <span className="text-blue-800">Fourlary👋</span>
          </h1>
          <p className="mt-8 text-lg font-normal text-gray-500 sm:text-xl">
            Temukan informasi seputar sekolah, galeri kegiatan, prestasi,
            hingga cari bakat mu di SMK Negeri 4 Kota Bogor Bersama Fourlary.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {/* Ganti dengan Link dari React Router */}
            <Link
              to="/gallery"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Lihat Galeri
            </Link>
            <Link to="/about" className="text-base font-semibold text-gray-900">
              Tentang Sekolah <span aria-hidden="true">→</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Video Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-16 flex justify-center"
      >
        <video
          className="w-full max-w-7xl rounded-2xl shadow-lg"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/sekolah.mp4" type="video/mp4" />
          Browser kamu tidak mendukung video.
        </video>
      </motion.div>

      {/* Background Shape Bawah */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36rem] 
          -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] 
          opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72rem]"
        />
      </div>
    </motion.div>
  );
}
