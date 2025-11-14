import { motion } from "framer-motion";

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
          {[
            "https://tailwindcss.com/plus-assets/img/logos/158x48/transistor-logo-gray-900.svg",
            "https://tailwindcss.com/plus-assets/img/logos/158x48/reform-logo-gray-900.svg",
            "https://tailwindcss.com/plus-assets/img/logos/158x48/tuple-logo-gray-900.svg",
            "https://tailwindcss.com/plus-assets/img/logos/158x48/savvycal-logo-gray-900.svg",
            "https://tailwindcss.com/plus-assets/img/logos/158x48/statamic-logo-gray-900.svg",
            "https://tailwindcss.com/plus-assets/img/logos/158x48/laravel-logo-gray-900.svg",
            "https://tailwindcss.com/plus-assets/img/logos/158x48/mirage-logo-gray-900.svg",
            "https://tailwindcss.com/plus-assets/img/logos/158x48/statamic-logo-gray-900.svg",
            "https://tailwindcss.com/plus-assets/img/logos/158x48/transistor-logo-gray-900.svg",
            "https://tailwindcss.com/plus-assets/img/logos/158x48/reform-logo-gray-900.svg",
          ].map((logo, i) => (
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
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
