import React from "react";
import { Play, Heart, Eye } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { tr } from "@/lib/tr";

export interface Reel {
  id: string;
  type: 'instagram' | 'youtube';
  url: string;
  category: string;
  title: { uz: string, ru: string, en: string };
  views: number;
  likes: number;
  thumbnail: string;
}

interface ReelCardProps {
  reel: Reel;
  onClick: (reel: Reel) => void;
}

export const ReelCard: React.FC<ReelCardProps> = ({ reel, onClick }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      onClick={() => onClick(reel)}
      className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-muted cursor-pointer shadow-lg hover:shadow-primary/20 transition-all duration-300"
    >
      {/* Thumbnail */}
      <img
        src={reel.thumbnail}
        alt={tr(reel.title)}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

      {/* Play Icon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
          <Play className="text-white w-6 h-6 fill-current" />
        </div>
      </div>

      {/* Badge (Source Type) */}
      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white">
        {reel.type === 'youtube' ? t('reels.label_shorts', 'Shorts') : t('reels.label_reel', 'Reel')}
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 drop-shadow-md">
          {tr(reel.title)}
        </h3>
        
        <div className="flex items-center gap-4 text-white/90 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-primary" />
            <span>{reel.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>{reel.likes.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
