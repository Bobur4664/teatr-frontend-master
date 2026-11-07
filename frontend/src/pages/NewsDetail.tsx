import { useParams, Link } from "react-router-dom";
import { getNewsItem } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Eye, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import BackButton from "@/components/common/BackButton";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { tr } from "@/lib/tr";

export default function NewsDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { settings } = useSiteSettings();
  const author = tr(settings?.site_name) || t('nav.footer_title_line2', 'Teatr');

  const { data: item, loading } = useApi(
    () => getNewsItem(id!),
    null,
    [id]
  );

  if (loading) {
    return (
      <div className="pt-16 pb-32 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="pt-16 pb-32 text-center min-h-[60vh] flex flex-col items-center justify-center space-y-6 bg-background">
        <h1 className="text-4xl font-serif text-foreground">{t('news.not_found', 'Topilmadi')}</h1>
        <p className="text-muted-foreground">{t('news.not_found_desc', 'Siz izlagan yangilik mavjud emas.')}</p>
        <Link to="/news">
          <Button variant="outline" className="text-primary hover:text-white hover:bg-primary border-primary">
            {t('common.back', 'Orqaga qaytish')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-0 bg-background min-h-screen">
      <div className="container mx-auto px-4 pt-8 mb-4">
        <BackButton />
      </div>
      {/* Header Banner */}
      <section className="relative h-[50vh] md:h-[60vh] flex flex-col justify-end">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#1E1B4B]/60 z-10" />
          <img
            src={item.image}
            alt={tr(item.title)}
            className="w-full h-full object-cover grayscale-[20%]"
          />
        </div>
        <div className="container mx-auto px-4 relative z-20 pb-16">
          <Link to="/news" className="inline-flex items-center text-white/80 hover:text-primary transition-colors mb-8 font-bold uppercase tracking-widest text-xs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('nav.news', 'Yangiliklar')}
          </Link>
          <div className="mt-4 flex gap-2 mb-6">
            <span className="bg-primary px-4 py-1 text-xs font-bold text-white uppercase tracking-widest">
              {tr(item.category)}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white leading-tight max-w-4xl">
            {tr(item.title)}
          </h1>
          <div className="flex items-center gap-6 mt-8 text-white/80 text-sm font-bold tracking-widest uppercase">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {new Date(item.date).toLocaleDateString('en-CA')}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              {author}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              {item.views} {t('common.views')}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="pt-32 pb-32">
      <div className="container mx-auto px-4 mb-4">
        <BackButton />
      </div>
      <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl font-light text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-6 mb-12">
              {tr(item.summary)}
            </p>
            
            <div className="prose prose-lg dark:prose-invert prose-p:text-foreground/80 prose-p:leading-loose max-w-none">
              {item.content && tr(item.content) && (
                <p>{tr(item.content)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
