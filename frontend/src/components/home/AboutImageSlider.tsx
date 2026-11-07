import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApi } from "@/hooks/useApi";
import { getGallery } from "@/lib/api";

// Neutral last-resort placeholders (theater-agnostic) used only until this
// theater has gallery images from the API.
const PLACEHOLDERS = [
  "https://picsum.photos/seed/theater-1/800/1000",
  "https://picsum.photos/seed/theater-2/800/1000",
  "https://picsum.photos/seed/theater-3/800/1000",
];

export default function AboutImageSlider() {
  const { data: gallery } = useApi(() => getGallery(), []);
  const images =
    gallery && gallery.length > 0
      ? gallery.map((g: any) => g.image).filter(Boolean)
      : PLACEHOLDERS;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg shadow-2xl">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt=""
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>

      {/* Subtle overlay for better text contrast of the floating badge */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

      {/* Progress indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
