import { useState, useMemo } from "react";
import { getPerformances, getGenres } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import ArchiveCard from "@/components/archive/ArchiveCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Filter, Video, Image as ImageIcon, ChevronRight, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { tr } from "@/lib/tr";
import BackButton from "@/components/common/BackButton";
import { motion, AnimatePresence } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSiteText } from "@/hooks/useSiteText";

export default function ArchivePage() {
  const { t, i18n } = useTranslation();
  const siteText = useSiteText();
  const currentLang = (i18n.language?.split('-')[0] || 'uz') as 'uz' | 'ru' | 'en' | 'qr';
  
  const [search, setSearch] = useState("");
  const [year, setYear] = useState<string>("all");
  const [month, setMonth] = useState<string>("all");
  const [activeGenre, setActiveGenre] = useState<number | "all">("all");
  const [mediaFilter, setMediaFilter] = useState<"all" | "video" | "gallery">("all");

  const { data: performances, loading } = useApi(() => getPerformances(), []);
  const { data: genres } = useApi(() => getGenres(), []);
  
  const months = [
    { value: "all", label: "archive.filter_month" },
    ...Array.from({ length: 12 }, (_, i) => ({ value: i.toString(), label: `archive.month_${i}` }))
  ];

  const allActuallyArchived = useMemo(() => {
    const now = new Date();
    return performances.filter((p: any) => {
      const isExplicitlyArchived = p.status === 'archived';
      const isAutoArchived = (p.status === 'active' || !p.status) && new Date(p.next_show) < now;
      return isExplicitlyArchived || isAutoArchived;
    });
  }, [performances]);

  const years = useMemo(() => {
    const archiveYears = allActuallyArchived
      .map((p: any) => {
        const date = p.premiere_date ? new Date(p.premiere_date) : new Date(p.next_show);
        return date.getFullYear().toString();
      })
      .filter((y: string) => y !== "NaN");
    const uniqueYears = Array.from(new Set(archiveYears)).sort((a: any, b: any) => Number(b) - Number(a));
    return ["all", ...uniqueYears];
  }, [allActuallyArchived]);

  const archivedPerformances = useMemo(() => {
    return allActuallyArchived.filter((p: any) => {

      const searchLower = search.toLowerCase();
      const matchesSearch =
        (tr(p.title) || "").toLowerCase().includes(searchLower) ||
        (tr(p.director_name) || "").toLowerCase().includes(searchLower) ||
        (tr(p.genre?.name) || "").toLowerCase().includes(searchLower);
      const matchesGenre = activeGenre === "all" || p.genre?.id === activeGenre;
      
      const anchorDate = p.premiere_date ? new Date(p.premiere_date) : new Date(p.next_show);
      const matchesYear = year === "all" || anchorDate.getFullYear().toString() === year;
      const matchesMonth = month === "all" || anchorDate.getMonth().toString() === month;
      
      const matchesMedia = mediaFilter === "all" 
        || (mediaFilter === "video" && p.video_url)
        || (mediaFilter === "gallery" && p.gallery_images?.length > 0);

      return matchesSearch && matchesGenre && matchesYear && matchesMonth && matchesMedia;
    });
  }, [search, year, month, activeGenre, mediaFilter, currentLang, allActuallyArchived]);

  return (
    <div className="min-h-screen bg-background pt-12 pb-32">
      <div className="container mx-auto px-4 mb-8">
        <BackButton />
      </div>

      <div className="container mx-auto px-4">
        {/* Hero Header */}
        <div className="max-w-4xl mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            <Calendar className="w-3 h-3" />
            {siteText('archive_badge', 'archive.badge')}
          </motion.div>
          <div className="space-y-4">
            <h1 className="page-title">
              {siteText('archive_title', 'archive.title')}
            </h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              {siteText('archive_subtitle', 'archive.subtitle')}
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-muted/30 border border-border p-6 rounded-2xl mb-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder={t('common.search')} 
                className="pl-12 bg-background border-border h-12 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Year Selector */}
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="h-12 bg-background border-border rounded-xl">
                <SelectValue placeholder={t('archive.filter_year')} />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y} value={y}>{y === 'all' ? t('repertoire.all') : y}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Month Selector */}
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="h-12 bg-background border-border rounded-xl">
                <SelectValue placeholder={t('archive.filter_month')} />
              </SelectTrigger>
              <SelectContent>
                {months.map(m => (
                  <SelectItem key={m.value} value={m.value}>{m.value === 'all' ? t('repertoire.all') : t(m.label)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-border/50">
            {/* Genre Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveGenre("all")}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeGenre === "all" 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-background border border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {t('repertoire.all')}
              </button>
              {genres.map((genre: any) => (
                <button
                  key={genre.id}
                  onClick={() => setActiveGenre(genre.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    activeGenre === genre.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-background border border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {tr(genre.name) || '—'}
                </button>
              ))}
            </div>

            {/* Media Filter Toggle */}
            <div className="flex gap-2 p-1 bg-background border border-border rounded-xl">
               {[
                 { id: 'all', icon: Filter },
                 { id: 'video', icon: Video },
                 { id: 'gallery', icon: ImageIcon }
               ].map((item) => (
                 <button
                   key={item.id}
                   onClick={() => setMediaFilter(item.id as any)}
                   className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                     mediaFilter === item.id ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                   }`}
                 >
                   <item.icon className="w-4 h-4" />
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {archivedPerformances.map((perf) => (
              <motion.div
                layout
                key={perf.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <ArchiveCard performance={perf} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {archivedPerformances.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-muted-foreground/30" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-foreground">{t('archive.no_archive')}</h3>
              <Button 
                variant="link" 
                onClick={() => {setSearch(""); setYear("all"); setMonth("all"); setActiveGenre("all"); setMediaFilter("all");}}
                className="text-primary uppercase tracking-widest text-xs font-bold"
              >
                {t('repertoire.clear_filters')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
