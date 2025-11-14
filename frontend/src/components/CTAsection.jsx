import { motion } from "framer-motion";

export default function Example() {
  // Animasi container dan child (biar fade + slide + stagger)
  const container = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      className="bg-white"
    >
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative isolate overflow-hidden bg-gray-0 px-6 pt-16 shadow-md outline-solid outline-gray-50 sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0"
        >
          {/* Background Gradient */}
          <motion.svg
            variants={item}
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-y-1/2 mask-[radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
          >
            <circle
              r={512}
              cx={512}
              cy={512}
              fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </motion.svg>

          {/* Bagian teks */}
          <motion.div
            variants={item}
            className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left"
          >
            <motion.h2
              variants={item}
              className="text-3xl font-semibold tracking-tight text-balance text-gray-900 sm:text-4xl"
            >
              Ayo Mulai Jelajahi SMK Negeri 4 Bogor Bersama{" "}
              <span className="text-blue-800">Fourlary 👀</span>
            </motion.h2>

            <motion.p
              variants={item}
              className="mt-6 text-lg/8 text-pretty text-gray-500"
            >
              Jelajahi semua konten profil sekolah SMKN 4 Bogor yang tersedia di
              Fourlary.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start"
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                href="#"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all"
              >
                Lihat Galeri
              </motion.a>

              <motion.a
                whileHover={{ x: 4 }}
                href="/login"
                className="text-sm/6 font-semibold text-gray-500 hover:text-gray-900"
              >
                Login Sekarang <span aria-hidden="true">→</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Gambar Hero */}
          <motion.div
            variants={item}
            className="relative mt-16 h-80 lg:mt-12"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <motion.img
              alt="App screenshot"
              src="/src/assets/hero.png"
              width={1824}
              height={1080}
              className="absolute top-0 left-0 w-228 max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
