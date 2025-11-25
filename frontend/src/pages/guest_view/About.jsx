"use client";
import { motion } from "framer-motion";
// Mengimpor gambar
import loginImage from "../../assets/loginimage.JPG";
import djiImage from "../../assets/DJI_0105.JPG";
import CTAsection from "../../components/home_component/CTAsection";

const stats = [
  { name: "Jumlah peserta didik (siswa)", value: "1300+" },
  { name: "Akreditasi", value: "A" },
  { name: "Jumlah rombongan belajar (kelas)", value: "30" },
  { name: "Jumlah PTK (Guru)", value: "76" },
];

// Variants reusable
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: "easeOut" },
  },
});

export default function About() {
  return (
    <div className="relative isolate overflow-hidden bg-white px-6 py-24 lg:px-0">
      {/* Section 1 */}
      <motion.div
        variants={fadeUp(0.1)}
        initial="hidden"
        animate="visible"
        className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10"
      >
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p className="text-lg/7 font-semibold text-indigo-600">
                Apa Itu SMKN 4 Bogor?
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                Tentang SMKN 4 Bogor
              </h1>
            </div>
          </div>
        </div>

        <motion.div
          variants={fadeUp(0.3)}
          initial="hidden"
          animate="visible"
          className="-mt-12 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden"
        >
          {/* Menggunakan gambar yang diimport */}
          <img
            alt="SMKN 4 Bogor"
            src={loginImage} // Gambar login
            className="w-3xl max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-228"
          />
        </motion.div>

        <motion.div
          variants={fadeUp(0.5)}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8"
        >
          <div className="lg:pr-4">
            <div className="max-w-xl text-xl text-gray-500 lg:max-w-lg">
              <p>
                SMK Negeri 4 Kota Bogor merupakan sekolah menengah kejuruan berbasis Teknologi Informasi dan Komunikasi.
                Sekolah ini didirikan dan dirintis pada tahun 2008 kemudian dibuka pada tahun 2009 yang saat ini
                terakreditasi A. Terletak di Jalan Raya Tajur Kp.Buntar, Muarasai, Bogor, sekolah ini berdiri di atas
                lahan seluas 12.724 m2 dengan berbagai fasilitas pendukung di dalamnya. Terdapat 54 staff pengajar dan 22
                orang staff tata usaha, dikepalai oleh Drs. Joni Alwis, sekolah ini merupakan investasi pendidikan yang
                tepat untuk putra/putri anda.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <br /> <br /> <br /> <br />

      {/* Section 2 */}
      <motion.div
        variants={fadeUp(0.2)}
        initial="hidden"
        animate="visible"
        className="relative isolate overflow-hidden bg-white py-24 sm:py-40"
      >
        {/* Menggunakan gambar yang diimport */}
        <img
          alt="SMKN 4 Bogor"
          src={djiImage} // Gambar DJI
          className="absolute inset-0 -z-10 size-full object-cover object-right opacity-10 md:object-center"
        />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div variants={fadeUp(0.3)} initial="hidden" animate="visible" className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
              Statistik Singkat SMKN 4 Bogor
            </h2>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-700 sm:text-xl/8">
              Berikut adalah statistik singkat SMK Negeri 4 Bogor mulai dari Jumlah PTK (guru + tenaga kependidikan),
              Jumlah rombongan belajar (kelas), Akreditasi, dan Jumlah peserta didik (siswa)
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp(0.5)}
            initial="hidden"
            animate="visible"
            className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none"
          >
            <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.name}
                  variants={fadeUp(0.6 + i * 0.1)}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col-reverse gap-1"
                >
                  <dt className="text-base/7 text-gray-700">{stat.name}</dt>
                  <dd className="text-4xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp(0.4)} initial="hidden" animate="visible">
        <CTAsection />
      </motion.div>
    </div>
  );
}
