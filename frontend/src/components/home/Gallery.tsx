import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getGallery } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import Lightbox from "@/components/ui/Lightbox";
import { motion } from "framer-motion";
import EmptySection from "@/components/common/EmptySection";
import { useSiteText } from "@/hooks/useSiteText";

export default function Gallery() {
  const { t } = useTranslation();
  const siteText = useSiteText();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const { data: gallery } = useApi(() => getGallery(), []);

  // Home page only shows the first 6 images
  const homeGallery = gallery.slice(0, 6);

  // Empty gallery still renders the section, so a new theater's page reads as a
  // complete layout rather than silently losing a band.
  if (homeGallery.length === 0) {
    return (
      <section className="home-section home-section--gallery home-band home-band--gallery overflow-hidden">
        <div className="home-shell">
          <div className="home-section-heading home-section-heading--split">
            <div>
              <span className="home-eyebrow">
              {siteText('home_gallery_badge', 'home.gallery_badge')}
              </span>
              <h2 className="home-display-title">{siteText('home_gallery_title', 'home.gallery_title')}</h2>
            </div>
          </div>
          <EmptySection />
        </div>
      </section>
    );
  }

  return (
    <section className="home-section home-section--gallery home-band home-band--gallery overflow-hidden">
      <div className="home-shell">
        <div className="home-section-heading home-section-heading--split">
          <div>
            <span className="home-eyebrow">
              {siteText('home_gallery_badge', 'home.gallery_badge')}
            </span>
            <h2 className="home-display-title">{siteText('home_gallery_title', 'home.gallery_title')}</h2>
          </div>
          <Link to="/gallery" className="home-text-link">
            {t('home.all_gallery', 'Barcha rasmlar')} <ArrowRight />
          </Link>
        </div>

        <div className="home-gallery-grid">
          {homeGallery.map((item, i) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onClick={() => setSelectedImage(i)}
              className={`home-gallery-tile relative group overflow-hidden shadow-sm cursor-pointer ${i === 0 ? 'home-gallery-tile--feature' : i === 3 ? 'home-gallery-tile--wide' : ''}`}
            >
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500">
                  <Maximize2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <img 
                src={item.image} 
                alt="Theater Gallery" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>
      </div>

      <Lightbox
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        images={homeGallery.map(i => i.image)}
        currentIndex={selectedImage || 0}
        onNavigate={(idx) => setSelectedImage(idx)}
      />
    </section>
  );
}
