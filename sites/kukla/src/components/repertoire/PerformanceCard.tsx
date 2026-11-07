import { Link } from "react-router-dom";
import { Calendar, Clock, User, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { tr } from "@/lib/tr";

interface PerformanceCardProps {
  performance: any;
  variant?: "default" | "home";
  key?: string | number;
}

export default function PerformanceCard({ performance, variant = "default" }: PerformanceCardProps) {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language?.split('-')[0] || 'uz') as 'uz' | 'ru' | 'en' | 'qr';
  const isHome = variant === "home";
  const nextShow = performance.next_show ? new Date(performance.next_show) : null;
  const hasNextShow = !!nextShow && !isNaN(nextShow.getTime());

  return (
    <Card className={`h-full overflow-hidden border border-border bg-background group ${
      isHome
        ? "rounded-2xl border-[#ed1c24]/20 shadow-[0_12px_36px_rgba(74,38,47,0.07)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#ed1c24]/45 hover:shadow-[0_22px_48px_rgba(74,38,47,0.14)]"
        : "rounded-lg"
    }`}>
      <Link to={`/performance/${performance.id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden relative">
          <img 
            src={performance.image} 
            alt={tr(performance.title)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className={`absolute inset-0 ${
            isHome
              ? "bg-gradient-to-t from-[#050505]/85 via-[#050505]/10 to-transparent"
              : "bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60"
          }`} />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
              isHome
                ? "rounded-full border border-[#ed1c24]/35 bg-[#080808]/85 text-[#ff555d] backdrop-blur-md"
                : "bg-primary text-primary-foreground"
            }`}>
              {tr(performance.genre?.name) || '—'}
            </span>
            <span className={`px-2 py-1 text-xs font-bold uppercase tracking-widest ${
              isHome
                ? "rounded-full border border-white/25 bg-[#050505]/65 text-white backdrop-blur-md"
                : "rounded bg-background/20 text-foreground backdrop-blur-sm"
            }`}>
              {performance.age_limit}
            </span>
          </div>
        </div>
      </Link>
      <CardContent className="flex-1 p-6 space-y-4">
        <h3 className={`text-2xl font-serif font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2 ${
          isHome ? "min-h-[3.5rem]" : ""
        }`} title={tr(performance.title)}>
          {tr(performance.title)}
        </h3>
        <div className="space-y-2 text-muted-foreground">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
            <Clock className="w-4 h-4 text-primary" />
            <span>{tr(performance.duration)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
            <User className="w-4 h-4 text-primary" />
            <span>{tr(performance.director_name)}</span>
          </div>
          {hasNextShow && (
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{nextShow!.toLocaleDateString(currentLang === 'uz' ? 'uz-UZ' : currentLang === 'ru' ? 'ru-RU' : 'en-US')}</span>
            </div>
          )}
          <div className={`flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-bold pt-2 border-t border-border/50 ${
            isHome ? "border-[#ed1c24]/20" : ""
          }`}>
            <Eye className="w-4 h-4" />
            <span>{performance.views} {t('common.views')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link to={`/performance/${performance.id}`} className="w-full">
          <Button variant="outline" className={`w-full uppercase tracking-widest text-[10px] font-bold py-5 ${
            isHome
              ? "h-auto rounded-full border-[#7b2944]/25 hover:border-[#7b2944] hover:bg-[#7b2944] hover:text-[#ffffff]"
              : "rounded-none"
          }`}>
            {t('hero.more_info')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
