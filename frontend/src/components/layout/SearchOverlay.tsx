import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, X, Calendar, Newspaper, User, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { getPerformances, getNews, getTeamMembers } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { tr } from "@/lib/tr";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: performances } = useApi(() => getPerformances(), []);
  const { data: news } = useApi(() => getNews(), []);
  const { data: actors } = useApi(() => getTeamMembers('actor'), []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, onClose]);

  // Search logic
  const filteredPerformances = query.length > 1 ? performances.filter((p: any) =>
    tr(p.title).toLowerCase().includes(query.toLowerCase()) ||
    tr(p.genre?.name).toLowerCase().includes(query.toLowerCase()) ||
    tr(p.director_name).toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4) : [];

  const filteredNews = query.length > 1 ? news.filter((n: any) =>
    tr(n.title).toLowerCase().includes(query.toLowerCase()) ||
    tr(n.summary).toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4) : [];

  const filteredActors = query.length > 1 ? actors.filter((a: any) =>
    tr(a.name).toLowerCase().includes(query.toLowerCase()) ||
    (a.notable_roles || []).some((r: string) => r.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 4) : [];

  const hasResults = filteredPerformances.length > 0 || filteredNews.length > 0 || filteredActors.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col p-4 md:p-8"
        >
          <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <div className="flex items-center gap-4 flex-grow">
                <Search className="w-6 h-6 text-primary" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('nav.search_placeholder', 'Nimadir qidiring...')}
                  className="bg-transparent border-none outline-none text-2xl md:text-4xl font-serif font-bold text-foreground w-full placeholder:text-muted-foreground/30"
                />
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors ml-4"
              >
                <X className="w-8 h-8 text-muted-foreground" />
              </button>
            </div>

            {/* Results */}
            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {query.length > 1 ? (
                hasResults ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-12">
                    {/* Performance Results */}
                    {filteredPerformances.length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-bold">
                          <Calendar className="w-4 h-4" />
                          <span>{t('nav.repertoire')}</span>
                        </div>
                        <div className="space-y-4">
                          {filteredPerformances.map((p) => (
                            <Link 
                                key={p.id} 
                                to={`/performance/${p.id}`} 
                                onClick={onClose}
                                className="group flex items-start gap-4 p-4 hover:bg-muted/50 transition-all rounded-xl border border-transparent hover:border-border"
                            >
                              <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={p.image} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{tr(p.title)}</h4>
                                <p className="text-sm text-muted-foreground">{tr(p.genre?.name)}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* News Results */}
                    {filteredNews.length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-bold">
                          <Newspaper className="w-4 h-4" />
                          <span>{t('nav.news')}</span>
                        </div>
                        <div className="space-y-4">
                          {filteredNews.map((n) => (
                            <Link 
                                key={n.id} 
                                to={`/news`} 
                                onClick={onClose}
                                className="group flex items-start gap-4 p-4 hover:bg-muted/50 transition-all rounded-xl border border-transparent hover:border-border"
                            >
                              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={n.image} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">{tr(n.title)}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">{tr(n.summary)}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actor Results */}
                    {filteredActors.length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-bold">
                          <User className="w-4 h-4" />
                          <span>{t('nav.team')}</span>
                        </div>
                        <div className="space-y-4">
                          {filteredActors.map((a) => (
                            <Link 
                                key={a.id} 
                                to={`/team`} 
                                onClick={onClose}
                                className="group flex items-center gap-4 p-4 hover:bg-muted/50 transition-all rounded-xl border border-transparent hover:border-border"
                            >
                              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                <img src={a.image} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{tr(a.name)}</h4>
                                <p className="text-sm text-muted-foreground">{tr(a.role)}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                      <Search className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-bold">{t('search.no_results', 'Hech narsa topilmadi')}</h3>
                       <p className="text-muted-foreground">{t('search.try_again', 'Boshqa soʻzlar bilan qidirib koʻring')}</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="py-20 text-center text-muted-foreground/60 text-sm">
                  {t('search.prompt', 'Qidiruvni boshlash uchun yozing...')}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="py-8 border-t border-border flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
               <div className="flex items-center gap-6">
                 <span><kbd className="px-2 py-1 bg-muted rounded mr-2 font-sans">ESC</kbd>{t('search.esc_to_close', 'Yopish')}</span>
               </div>
               <div className="flex items-center gap-2 text-primary">
                 <span>{t('search.view_all', 'Barcha natijalar')}</span>
                 <ArrowRight className="w-3 h-3" />
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
