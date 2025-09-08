import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const images = [
    { src: "/images/foto1.jpg" },
    { src: "/images/foto2.jpg" },
    { src: "/images/foto3.jpg" }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Galeri Sekolah</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {images.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt=""
            className="rounded-lg cursor-pointer"
            onClick={() => setOpen(true)}
          />
        ))}
      </div>
      <Lightbox open={open} close={() => setOpen(false)} slides={images} />
    </div>
  );
}