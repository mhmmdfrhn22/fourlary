import {
  PhotoIcon,
  PaperClipIcon,
  NewspaperIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline'

// data fitur → gampang diubah nanti
const features = [
  {
    name: 'Profil Sekolah',
    description:
      'Menampilkan informasi lengkap mengenai identitas sekolah, visi misi, serta data penting yang dapat diakses oleh calon siswa, orang tua, maupun masyarakat.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Detail Jurusan',
    description:
      'Berisi deskripsi tiap jurusan yang ada di sekolah beserta keunggulannya, termasuk prospek karier yang relevan.',
    icon: PaperClipIcon,
  },
  {
    name: 'Berita Sekolah',
    description:
      'Fitur untuk publikasi berita terbaru, pengumuman resmi, dan informasi kegiatan sekolah sehingga audiens selalu mendapatkan update.',
    icon: NewspaperIcon,
  },
  {
    name: 'Galeri Sekolah',
    description:
      'Menyajikan dokumentasi kegiatan sekolah dalam bentuk foto maupun video yang dapat diakses dengan tampilan interaktif.',
    icon: PhotoIcon,
  },
]

export default function Features() {
  return (
    <section className="bg-white py-24 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* heading */}
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold text-indigo-600">
            Fitur Fitur Aplikasi
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Ada Apa Saja Ada di <span className="text-blue-800">Fourlary🤔</span>
          </p>
          <p className="mt-6 text-lg text-gray-700">
            Quis tellus eget adipiscing convallis sit sit eget aliquet quis.
            Suspendisse eget egestas a elementum pulvinar et feugiat blandit at.
          </p>
        </div>

        {/* daftar fitur */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold text-gray-900">
                  <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon aria-hidden="true" className="h-6 w-6 text-white" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}