import { useState } from "react";
import { useTranslation } from "react-i18next";
import BackButton from "@/components/common/BackButton";
import { getGallery } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Maximize2, Camera, Loader2 } from "lucide-react";
import Lightbox from "@/components/ui/Lightbox";
import { motion, AnimatePresence } from "motion/react";
import { tr } from "@/lib/tr";
import { useSiteText } from "@/hooks/useSiteText";

export default function GalleryPage() {
  const { t } = useTranslation();
  const siteText = useSiteText();
  const [filter, setFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const { data: gallery, loading } = useApi(() => getGallery(), []);

  const categories = [
    { id: "all", label: { uz: "Barchasi", ru: "Все", en: "All", qr: "Bárshası" } },
    { id: "spectacle", label: { uz: "Spektakllar", ru: "Спектакли", en: "Spectacles", qr: "Spektakller" } },
    { id: "backstage", label: { uz: "Sahna orti", ru: "За кулисами", en: "Backstage", qr: "Sahna artı" } },
    { id: "history", label: { uz: "Tarix", ru: "История", en: "History", qr: "Tariyx" } },
    { id: "event", label: { uz: "Tadbirlar", ru: "Мероприятия", en: "Events", qr: "Ilajlar" } },
    { id: "tour", label: { uz: "Gastrol safari", ru: "Гастроли", en: "Tours", qr: "Gastrol saparı" } },
    { id: "memorandum", label: { uz: "Memorandum", ru: "Меморандум", en: "Memorandum", qr: "Memorandum" } },
    { id: "repertoire", label: { uz: "Repertuar", ru: "Репертуар", en: "Repertoire", qr: "Repertuar" } },
  ];

  const filteredGallery = filter === "all" ? gallery : gallery.filter((item: any) => item.category === filter);

  return (
    <div className="min-h-screen bg-background pt-12 pb-32">
      <div className="container mx-auto px-4 mb-4">
        <BackButton />
      </div>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div className="space-y-4">
            <h1 className="page-title">
              {siteText('gallery_title', 'gallery.title')}
            </h1>
            <p className="text-muted-foreground max-w-2xl font-light">
              {siteText('gallery_subtitle', 'gallery.subtitle')}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-widest bg-secondary/30 p-2 rounded-2xl border border-border/50">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-6 py-3 rounded-xl transition-all ${
                  filter === cat.id ? "bg-primary text-white shadow-lg" : "hover:bg-primary/10 text-muted-foreground"
                }`}
              >
                {tr(cat.label)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredGallery.map((item: any, index: number) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="group relative aspect-square overflow-hidden rounded-2xl bg-secondary/20 cursor-pointer shadow-sm hover:shadow-2xl transition-all active:scale-[0.98]"
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={item.image}
                      alt={tr(item.title)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-end">
                      <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-lg mb-2">
                        {tr(categories.find((c) => c.id === item.category)?.label)}
                        </span>
                        <h3 className="text-white text-lg font-serif font-bold leading-tight">
                          {tr(item.title)}
                        </h3>
                        <p className="text-white/60 text-xs font-light line-clamp-2">
                          {tr(item.description)}
                        </p>
                      </div>
                      <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-primary/40">
                        <Maximize2 className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredGallery.length === 0 && (
              <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-700">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center">
                  <Camera className="w-10 h-10 text-primary/40" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold">{t("gallery.no_results", "Ma'lumot topilmadi")}</h3>
                  <p className="text-muted-foreground">{t("gallery.no_images", "Ushbu turkumda hozircha rasmlar mavjud emas.")}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        images={filteredGallery.map((i: any) => i.image)}
        currentIndex={selectedImage || 0}
        onNavigate={(idx) => setSelectedImage(idx)}
      />
    </div>
  );
}
