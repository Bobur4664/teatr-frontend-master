import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Heart, Eye, ExternalLink, ChevronUp, ChevronDown, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { tr } from '@/lib/tr';
import { Reel } from './ReelCard';

interface ReelModalProps {
  reels: Reel[];
  initialIndex: number | null;
  onClose: () => void;
}

export default function ReelModal({ reels, initialIndex, onClose }: ReelModalProps) {
  const { t } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0); // 1 for down, -1 for up
  const isScrolling = useRef(false);

  // Initialize index when modal opens
  useEffect(() => {
    if (initialIndex !== null) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
    } else {
      setCurrentIndex(null);
      document.body.style.overflow = 'unset';
    }
  }, [initialIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex !== null && currentIndex < reels.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => (prev !== null ? prev + 1 : 0));
    }
  }, [currentIndex, reels.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex !== null && currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => (prev !== null ? prev - 1 : 0));
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === 'ArrowUp') handlePrev();
      if (e.key === 'ArrowDown') handleNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, handleNext, handlePrev, onClose]);

  // Wheel navigation (throttled)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (currentIndex === null || isScrolling.current) return;
      
      if (Math.abs(e.deltaY) > 50) {
        isScrolling.current = true;
        if (e.deltaY > 0) {
          handleNext();
        } else {
          handlePrev();
        }
        
        setTimeout(() => {
          isScrolling.current = false;
        }, 800);
      }
    };
    
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentIndex, handleNext, handlePrev]);

  if (currentIndex === null) return null;

  const currentReel = reels[currentIndex];

  const getEmbedUrl = (reel: Reel) => {
    try {
      if (reel.type === 'youtube') {
        const videoId = reel.url.split('/').pop();
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : 'about:blank';
      } else {
        const parts = reel.url.split('/reels/');
        if (parts.length < 2) return 'about:blank';
        const reelId = parts[1].split('/')[0];
        return reelId ? `https://www.instagram.com/reels/${reelId}/embed` : 'about:blank';
      }
    } catch (e) {
      console.error('Failed to parse reel URL:', reel.url);
      return 'about:blank';
    }
  };

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
        onClick={onClose}
      >
        {/* Navigation Controls - Desktop Side */}
        <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20">
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            disabled={currentIndex === 0}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed group border border-white/10"
          >
            <ChevronUp className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-1 h-12 rounded-full bg-white/10 relative overflow-hidden">
               <motion.div 
                 initial={false}
                 animate={{ height: `${((currentIndex + 1) / reels.length) * 100}%` }}
                 className="absolute top-0 left-0 w-full bg-primary"
               />
            </div>
            <span className="text-[10px] font-bold text-white/50">{currentIndex + 1} / {reels.length}</span>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            disabled={currentIndex === reels.length - 1}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed group border border-white/10"
          >
            <ChevronDown className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-30 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-primary-foreground transition-all border border-white/10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Reel Container */}
        <div className="relative w-full max-w-[450px] aspect-[9/16] overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentReel.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                y: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.3 }
              }}
              className="absolute inset-0 w-full h-full"
            >
              <div className="relative w-full h-full bg-zinc-900 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
                {getEmbedUrl(currentReel) !== 'about:blank' ? (
                  <iframe
                    key={getEmbedUrl(currentReel)}
                    src={getEmbedUrl(currentReel)}
                    className="w-full h-full border-0 select-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/50 space-y-4">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                      <PlayCircle className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-sm font-medium uppercase tracking-widest">{t('reels.not_available', 'Video topilmadi')}</p>
                  </div>
                )}

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-white text-xl font-black mb-4 leading-tight drop-shadow-lg">
                      {tr(currentReel.title)}
                    </h2>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2.5 text-white/90">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Eye className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-bold tracking-tight">{currentReel.views.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2.5 text-white/90">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        </div>
                        <span className="text-sm font-bold tracking-tight">{currentReel.likes.toLocaleString()}</span>
                      </div>
                      
                      <a 
                        href={currentReel.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-auto pointer-events-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white text-black hover:bg-primary hover:text-white px-5 py-2.5 rounded-full transition-all active:scale-95 shadow-lg"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {currentReel.type === 'instagram' ? t('reels.btn_instagram', 'Instagram') : t('reels.btn_youtube', 'YouTube')}
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Mobile Swipe Indicator (Optional visually) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden flex flex-col items-center gap-2 text-white/30 animate-pulse">
           <ChevronUp className="w-5 h-5" />
           <span className="text-[8px] font-bold uppercase tracking-[0.2em]">{t('reels.swipe_hint', 'Ko\'proq uchun suring')}</span>
           <ChevronDown className="w-5 h-5" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
