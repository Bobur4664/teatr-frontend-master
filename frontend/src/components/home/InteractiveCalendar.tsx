import { useState, useEffect } from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { getPerformances } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Ticket, Clock, Timer, Radio, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { differenceInMinutes } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { tr } from "@/lib/tr";
import { useSiteText } from "@/hooks/useSiteText";

export default function InteractiveCalendar() {
  const { t, i18n } = useTranslation();
  const siteText = useSiteText();
  const currentLang = (i18n.language?.split('-')[0] || 'uz') as 'uz' | 'ru' | 'en' | 'qr';
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [now, setNow] = useState(new Date());

  const { data: performances } = useApi(() => getPerformances('active'), []);

  // Update current time every minute to refresh LIVE status
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getFormattedDate = (d: Date, lang: string) => {
    const month = new Intl.DateTimeFormat(i18n.language, { month: 'long' }).format(d);
    if (lang === 'uz') {
      return `${d.getFullYear()}-yil ${d.getDate()}-${month}`;
    }
    return d.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const showsOnSelectedDate = performances.filter(p => {
    const showDate = new Date(p.next_show);
    return date && 
      showDate.getDate() === date.getDate() &&
      showDate.getMonth() === date.getMonth() &&
      showDate.getFullYear() === date.getFullYear();
  });

  const [liveMessage, setLiveMessage] = useState<{ id: string, text: string } | null>(null);

  const handleLiveClick = (show: any) => {
    const showTime = new Date(show.next_show);
    const diff = differenceInMinutes(showTime, now);

    if (diff > 2 && diff <= 10) {
      const msg = t('calendar.live_countdown', 'Jonli efir boshlanishiga {{count}} daqiqa qoldi', { count: diff });
      setLiveMessage({ id: show.id, text: msg });
      setTimeout(() => setLiveMessage(null), 3000);
    } else if (diff <= 2) {
      if (show.live_url) {
        window.open(show.live_url, '_blank');
      } else {
        const msg = t('calendar.no_live', 'Jonli efir mavjud emas');
        setLiveMessage({ id: show.id, text: msg });
        setTimeout(() => setLiveMessage(null), 3000);
      }
    }
  };

  return (
    <section className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-4 space-y-10">
          <div className="space-y-4">
            <span className="section-badge">{siteText('calendar_badge', 'calendar.badge')}</span>
            <h2 className="section-title">{siteText('calendar_title', 'calendar.title')}</h2>
            <p className="text-muted-foreground font-light leading-relaxed max-w-md">
              {siteText('calendar_subtitle', 'calendar.subtitle')}
            </p>
          </div>
          
          <div className="relative">
            <div className="relative bg-card shadow-sm rounded-3xl p-4 md:p-6 border border-border">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="bg-transparent p-0 w-full"
                modifiers={{
                  hasShow: performances.map(p => new Date(p.next_show))
                }}
                classNames={{
                  root: "w-full",
                  day: "relative w-full h-12 md:h-14 p-0 font-normal aria-selected:opacity-100 flex items-center justify-center",
                  day_today: "bg-muted text-foreground font-bold",
                }}
                components={{
                  DayButton: (props) => {
                    const hasShow = performances.some(p => {
                      const d = new Date(p.next_show);
                      return d.getDate() === props.day.date.getDate() && 
                             d.getMonth() === props.day.date.getMonth() && 
                             d.getFullYear() === props.day.date.getFullYear();
                    });
                    
                    return (
                      <div className="relative flex items-center justify-center w-full h-full">
                        <CalendarDayButton {...props} className="h-full w-full aspect-auto" />
                        {hasShow && (
                          <div className="absolute bottom-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
                        )}
                      </div>
                    );
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between border-b border-border/50 pb-6">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              {date ? getFormattedDate(date, currentLang) : t('calendar.no_date_selected')}
            </h3>
            {showsOnSelectedDate.length > 0 && (
              <Badge variant="outline" className="border-primary/30 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary/5">
                {showsOnSelectedDate.length} {t('home.stat_performances')}
              </Badge>
            )}
          </div>
          
          <div className="space-y-6">
            {showsOnSelectedDate.length > 0 ? (
              showsOnSelectedDate.map((show, index) => {
                const showTime = new Date(show.next_show);
                const diff = differenceInMinutes(showTime, now);
                const isLiveSoon = show.is_live || (diff <= 10 && diff >= -120); // Admin-toggled OR time-based

                return (
                  <Card key={show.id} className="bg-background/40 backdrop-blur-sm border-border/50 rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-500 animate-in fade-in slide-in-from-right-8" style={{ animationDelay: `${index * 150}ms` }}>
                    <CardContent className="p-0 flex flex-col md:flex-row">
                      <div className="w-full md:w-64 aspect-[4/3] md:aspect-square overflow-hidden relative">
                        <img
                          src={show.image}
                          alt={tr(show.title)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {isLiveSoon && (
                          <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="absolute top-4 left-4 z-20"
                          >
                            <Badge className="bg-red-600 text-white border-none px-3 py-1 flex items-center gap-2 animate-pulse rounded-lg">
                              <Radio className="w-3 h-3" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">LIVE</span>
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 rounded-lg uppercase tracking-widest text-[10px] px-3 py-1 font-bold">
                              {tr(show.genre?.name) || '—'}
                            </Badge>
                            <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                              <Clock className="w-3 h-3 text-primary/70" />
                              {new Date(show.next_show).toLocaleTimeString(currentLang === 'uz' ? 'uz-UZ' : currentLang === 'ru' ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                              <Timer className="w-3 h-3 text-primary/70" />
                              {tr(show.duration)}
                            </div>
                          </div>
                          <h4 className="text-2xl md:text-3xl font-serif font-bold text-foreground group-hover:text-primary transition-colors duration-300">{tr(show.title)}</h4>
                          <p className="text-muted-foreground text-base font-light leading-relaxed line-clamp-2 md:line-clamp-3 italic">
                            "{tr(show.description)}"
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
                          <div className="flex -space-x-3 overflow-hidden">
                            {(show.cast || []).slice(0, 3).map((actor: any) => (
                              <img key={actor.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover" src={actor.image || `https://picsum.photos/seed/actor${actor.id}/100/100`} alt={tr(actor.name)} />
                            ))}
                            {(show.cast || []).length > 3 && (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted ring-2 ring-background text-[10px] font-bold text-muted-foreground">+{show.cast.length - 3}</div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <AnimatePresence>
                              {liveMessage?.id === show.id && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className="absolute -top-10 right-0 bg-primary/90 text-primary-foreground text-[10px] px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-sm z-30 font-bold whitespace-nowrap"
                                >
                                  {liveMessage.text}
                                </motion.div>
                              )}
                            </AnimatePresence>
                            <div className="flex items-center gap-3 relative">
                              {isLiveSoon && (
                                <Button 
                                  onClick={() => handleLiveClick(show)}
                                  className="bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-600/30 rounded-xl px-6 py-5 h-auto text-[10px] font-bold uppercase tracking-widest transition-all"
                                >
                                  <Radio className="w-4 h-4 mr-2" />
                                  LIVE
                                </Button>
                              )}
                              <Link to={`/performance/${show.id}`}>
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-10 py-5 h-auto text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
                                  {t('hero.more_info')}
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="p-20 bg-background/20 backdrop-blur-sm rounded-3xl shadow-sm border border-border/50 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
                <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                  <Ticket className="w-10 h-10 text-primary relative z-10" />
                </div>
                <div className="space-y-3">
                  <p className="text-foreground font-serif text-2xl font-bold">{t('calendar.no_shows')}</p>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto italic">{siteText('calendar_subtitle', 'calendar.subtitle')}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const now = new Date();
                    const sorted: Date[] = performances
                      .map((p: any) => new Date(p.next_show))
                      .filter((d: Date) => !isNaN(d.getTime()))
                      .sort((a: Date, b: Date) => a.getTime() - b.getTime());

                    const upcoming = sorted.find(d => d >= now);
                    const target = upcoming ?? sorted[sorted.length - 1];
                    if (target) setDate(target);
                  }}
                  className="text-primary border-primary/30 hover:bg-primary hover:text-white rounded-xl px-12 py-6 h-auto transition-all duration-300 uppercase tracking-widest text-[10px] font-bold shadow-sm"
                >
                  {t('calendar.view_next')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
