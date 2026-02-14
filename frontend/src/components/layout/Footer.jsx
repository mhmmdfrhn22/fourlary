import Logo from "../../assets/logofourlary.svg";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        
        {/* Bagian atas */}
        <div className="flex flex-col items-center justify-between gap-8 border-b border-gray-200 pb-8 md:flex-row">
          {/* Logo */}
          <div className="flex items-center">
              <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img src={Logo} alt="Logo" className="h-8 w-auto" />
              </a>
          </div>

          {/* Menu tengah */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-black">Beranda</a>
            <a href="#" className="hover:text-black">Kontak Kami</a>
            <a href="#" className="hover:text-black">Pembinat</a>
            <a href="#" className="hover:text-black">Galeri Sekolah</a>
          </div>

          {/* Sosial Media */}
          <div className="flex gap-x-6">
            <a href="#" className="text-gray-500 hover:text-black">
              <span className="sr-only">Twitter</span>
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 19c7.5 0 11.6-6.2 11.6-11.6v-.5A8.3 8.3 0 0022 4.3a8.2 8.2 0 01-2.4.7 4.1 4.1 0 001.8-2.3 8.2 8.2 0 01-2.6 1 4.1 4.1 0 00-7 3.7 11.6 11.6 0 01-8.4-4.3 4.1 4.1 0 001.3 5.5A4 4 0 012 8.8v.1a4.1 4.1 0 003.3 4 4 4 0 01-1.9.1 4.1 4.1 0 003.8 2.8A8.3 8.3 0 012 18.6a11.6 11.6 0 006.3 1.8" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-black">
              <span className="sr-only">Facebook</span>
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.3 3h-1.9v7A10 10 0 0022 12" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-black">
              <span className="sr-only">Instagram</span>
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.6 0 3 1.4 3 3v10c0 1.6-1.4 3-3 3H7c-1.6 0-3-1.4-3-3V7c0-1.6 1.4-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.8-.9a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bagian bawah */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-500">
            © Copyright Fourlary 2025, All Rights Reserved
          </p>
          <div className="flex gap-x-8 text-sm text-gray-500">
            <a href="#" className="hover:text-black">Privacy Policy</a>
            <a href="#" className="hover:text-black">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}