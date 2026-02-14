import { GalleryVerticalEnd } from "lucide-react";
import { RegisterComponent } from "../../components/auth_component/register-component";

// Import gambar
import logoImage from '../../assets/logofourlary.svg';
import loginImage from '../../assets/loginimage.JPG';

export default function Register() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side */}
      <div className="flex flex-col gap-1 px-6 md:px-10">
        {/* Logo */}
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-24 items-center justify-center rounded-md">
              {/* Menggunakan gambar yang diimport */}
              <img src={logoImage} alt="Logo Fourlary" />
            </div>
          </a>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterComponent />
          </div>
        </div>
      </div>

      {/* Right side (image) */}
      <div className="bg-muted relative hidden lg:block">
        {/* Menggunakan gambar yang diimport */}
        <img
          src={loginImage}
          alt="Login Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
