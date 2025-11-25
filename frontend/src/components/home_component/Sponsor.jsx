import { motion } from "framer-motion";

// Mengimpor gambar
import logo1 from "../../assets/1.png";
import logo2 from "../../assets/2.png";
import logo3 from "../../assets/3.png";
import logo4 from "../../assets/4.png";
import logo5 from "../../assets/5.png";
import logo6 from "../../assets/6.png";
import logo7 from "../../assets/7.png";
import logo8 from "../../assets/8.png";
import logo9 from "../../assets/9.png";
import logo10 from "../../assets/10.png";

export default function Sponsor() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="bg-white py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center text-xl/16 font-semibold text-gray-900"
        >
          SMK Negeri 4 Bogor Sudah Bekerja Sama Dengan Beberapa Industri dan Instansi Berikut
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.1,
                duration: 0.8,
              },
            },
          }}
          viewport={{ once: true }}
          className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5"
        >
          {[logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9, logo10].map((logo, i) => (
            <motion.img
              key={i}
              src={logo}
              alt={`Sponsor ${i + 1}`}
              width={158}
              height={48}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="col-span-2 h-20 w-full object-contain lg:col-span-1"
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
