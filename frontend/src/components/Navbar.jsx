'use client'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  SquaresPlusIcon,
  XMarkIcon,
  UserGroupIcon,
  NewspaperIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
  CursorArrowRaysIcon,
  ChartPieIcon,
} from '@heroicons/react/20/solid'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const products = [
  { name: 'Tentang Sekolah', description: 'Pengenalan Profile dan Sejarah Sekolah', href: '/about', icon: CursorArrowRaysIcon },
  { name: 'Visi Misi', description: 'Lihat Visi dan Misi SMK Negeri 4 Bogor', href: '/visimisi', icon: ChartPieIcon },
  { name: 'Jurusan Sekolah', description: 'Jurusan Yang Terdapat di SMKN 4 Bogor', href: '/JurusanSekolah', icon: SquaresPlusIcon },
  { name: 'Tenaga Pengajar', description: 'Kenali Para Tenaga Pendidik di SMKN 4 Bogor', href: '/GuruView', icon: UserGroupIcon },
  { name: 'Berita Sekolah', description: 'Lihat Berita Terbaru di SMKN 4 Bogor', href: '/BeritaView', icon: NewspaperIcon },
]

const callsToAction = [
  { name: 'Lihat Video Sekolah', href: 'https://www.youtube.com/watch?v=auya1s3yif4', icon: PlayCircleIcon },
  { name: 'Kontak Kami', href: '/contact', icon: PhoneIcon },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigate('/')
  }

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/70"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Fourlary</span>
            <img className="flex w-32" src="/src/assets/logofourlary.svg" alt="Logo" />
          </Link>
        </div>

        {/* Tombol Mobile */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-900"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        {/* Desktop menu */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Link to="/" className="text-base font-semibold text-gray-900">Beranda</Link>

          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-2 text-base font-semibold text-gray-900">
              Informasi Umum
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
            </PopoverButton>
            <PopoverPanel className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 rounded-3xl bg-white shadow">
              <div className="p-4">
                {products.map((item) => (
                  <div key={item.name} className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm hover:bg-gray-50">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                    </div>
                    <div className="flex-auto">
                      <Link to={item.href} className="block font-semibold text-gray-900">
                        {item.name}
                        <span className="absolute inset-0" />
                      </Link>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                {callsToAction.map((item) => (
                  <a key={item.name} href={item.href} className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold text-gray-900 hover:bg-gray-100">
                    <item.icon aria-hidden="true" className="size-5 text-gray-400" />
                    {item.name}
                  </a>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          <Link to="/PembinatView" className="text-base font-semibold text-gray-900">Pembinat</Link>
          <Link to="/gallery" className="text-base font-semibold text-gray-900">Galeri Sekolah</Link>
        </PopoverGroup>

        {/* Desktop user menu */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {!user ? (
            <Link to="/login" className="text-base font-semibold text-gray-900">
              Masuk Sekarang <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : user.role_id === 2 ? (
            <Link to="/dashboard" className="text-base font-semibold text-gray-900">
              Dashboard <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : user.role_id === 3 ? (
            <Link to="/dashboard-pdd" className="text-base font-semibold text-gray-900">
              Dashboard PDD <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : (
            <Popover className="relative">
              <PopoverButton className="flex items-center gap-x-2 text-base font-semibold text-gray-900">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span>{user.username}</span>
              </PopoverButton>
              <PopoverPanel className="absolute right-0 z-10 mt-3 w-48 rounded-3xl bg-white shadow">
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="group flex w-full items-center gap-x-2 rounded-lg p-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    <ArrowRightOnRectangleIcon aria-hidden="true" className="size-5 text-gray-400 group-hover:text-indigo-600" />
                    Log Out
                  </button>
                </div>
              </PopoverPanel>
            </Popover>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-200">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <img className="h-8 w-auto" src="/src/assets/logofourlary.svg" alt="Logo" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 px-3 text-base font-semibold text-gray-900 hover:bg-gray-50">
                    Informasi Umum
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...products, ...callsToAction].map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <Link to="/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">Beranda</Link>
                <Link to="/PembinatView" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">Pembinat</Link>
                <Link to="/gallery" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">Galeri Sekolah</Link>
              </div>
              <div className="py-6">
                {!user ? (
                  <Link to="/login" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">
                    Masuk Sekarang
                  </Link>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="-mx-3 block w-full rounded-lg px-3 py-2 text-left text-base font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Log Out
                  </button>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </motion.header>
  )
}
