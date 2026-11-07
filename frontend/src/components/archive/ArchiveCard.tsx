import { Link } from "react-router-dom";
import { Calendar, Clock, User, Mic, Video, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { tr } from "@/lib/tr";

interface ArchiveCardProps {
  performance: any;
}

export default function ArchiveCard({ performance }: ArchiveCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-background border border-border overflow-hidden group rounded-xl grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100">
        <Link to={`/performance/${performance.id}`} className="block relative">
          <div className="aspect-[3/4] overflow-hidden relative">
            <img 
              src={performance.image} 
              alt={tr(performance.title)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            
            {/* Archive Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-muted-foreground/80 text-background text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm shadow-xl flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {t('archive.badge')}
              </span>
            </div>

            {/* Media Indicators */}
            <div className="absolute top-4 right-4 flex gap-2">
              {performance.video_url && (
                <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center text-foreground border border-white/20">
                  <Video className="w-4 h-4" />
                </div>
              )}
              {performance.gallery_images?.length > 0 && (
                <div className="w-8 h-8 rounded-full bg-blue-500/20 backdrop-blur-md flex items-center justify-center text-foreground border border-white/20">
                  <ImageIcon className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <span className="bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                {tr(performance.genre?.name) || '—'}
              </span>
            </div>
          </div>
        </Link>
        <CardContent className="p-5 space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {tr(performance.title)}
            </h3>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <User className="w-3 h-3 text-primary" />
              <span>{tr(performance.director_name)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="block text-[8px] uppercase tracking-widest text-muted-foreground font-bold">{t('archive.premiere')}</span>
              <span className="block text-xs font-medium text-foreground/80 italic">
                {performance.premiere_date ? new Date(performance.premiere_date).getFullYear() : new Date(performance.next_show).getFullYear()}
              </span>
            </div>
            <div className="space-y-1 text-right">
              <span className="block text-[8px] uppercase tracking-widest text-muted-foreground font-bold">{t('archive.archived_at')}</span>
              <span className="block text-xs font-medium text-foreground/80 italic">
                {performance.archive_date ? new Date(performance.archive_date).getFullYear() : '—'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
