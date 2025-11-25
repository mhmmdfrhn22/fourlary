import { motion } from "framer-motion";
import fotovisiImage from "../../assets/fotovisi.JPG";


export default function Visimisi() {
  return (
    <motion.div
      className="relative isolate overflow-hidden bg-white px-6 py-24 lg:px-0"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          aria-hidden="true"
          className="absolute top-0 left-[max(50%,25rem)] h-256 w-512 -translate-x-1/2 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)] stroke-gray-200"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
            width="100%"
            height="100%"
            strokeWidth={0}
          />
        </svg>
      </div>

      {/* Bagian Visi */}
      <motion.div
        className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p className="text-lg font-semibold text-indigo-600">
                Visi Misi Sekolah SMKN 4 Bogor
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                Visi SMK Negeri 4 Bogor
              </h1>
              <p className="font-semibold mt-8 text-4xl text-gray-400">
                Visi sekolah SMK Negeri 4 Bogor adalah{" "}
                <span className="font-semibold mt-6 text-4xl text-gray-700">
                  “Terwujudnya sekolah yang tangguh dalam imtaq, terampil,
                  mandiri, berbasis Teknologi Informasi dan Komunikasi, dan
                  berwawasan lingkungan”
                </span>
              </p>
            </div>
          </div>
        </div>

        <motion.div
          className="-mt-12 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <img
            alt=""
            src={fotovisiImage}
            className="w-3xl max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-228"
          />
        </motion.div>
      </motion.div>

      {/* Bagian Misi */}
      <motion.div
        className="bg-white py-24 sm:py-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
              Misi Misi Sekolah SMK Negeri 4 Bogor
            </p>
            <p className="mt-6 text-lg/8 text-gray-700">
              Berikut adalah Misi Misi dari Sekolah SMKN Negeri 4 Bogor Sebagai
              Berikut
            </p>
          </div>

          <motion.dl
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {[
              {
                title: "Membentuk Karakter Pelajar Pancasila",
                desc: "Mewujudkan peserta didik yang beriman dan bertaqwa kepada Tuhan Yang Maha Esa, berakhlak mulia, berjiwa gotong royong, mandiri, kreatif, bernalar kritis, serta mampu beradaptasi dalam keberagaman global.",
                icon: (
                  <path
                    d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ),
              },
              {
                title: "Pengembangan Berbasis Teknologi Informasi",
                desc: "Mengembangkan pembelajaran dan pengelolaan sekolah dengan memanfaatkan Teknologi Informasi dan Komunikasi (TIK) untuk mendukung kualitas pendidikan.",
                icon: (
                  <path
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ),
              },
              {
                title: "Sekolah Berwawasan Lingkungan",
                desc: "Mengembangkan sekolah yang berwawasan Adiwiyata Mandiri dengan menanamkan kepedulian lingkungan dan prinsip pembangunan berkelanjutan.",
                icon: (
                  <path
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ),
              },
              {
                title: "Meningkatkan Kemandirian dan Daya Saing",
                desc: "Mengembangkan berbagai bidang usaha sekolah secara optimal agar memiliki kemandirian, inovasi, serta daya saing yang tinggi.",
                icon: (
                  <path
                    d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative pl-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 * index }}
              >
                <dt className="text-base/7 font-semibold text-gray-900">
                  <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                      className="size-6 text-white"
                    >
                      {item.icon}
                    </svg>
                  </div>
                  {item.title}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-600">{item.desc}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </motion.div>
    </motion.div>
  );
}
