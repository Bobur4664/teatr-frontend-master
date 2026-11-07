import { useEffect, useMemo, useRef, useState } from "react";
import { getNewsPage, type PaginatedResponse } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import NewsCard from "@/components/news/NewsCard";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BackButton from "@/components/common/BackButton";
import Pagination from "@/components/common/Pagination";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowLeft, ArrowRight, Eye, Loader2, Newspaper, Sparkles } from "lucide-react";
import { useSiteText } from "@/hooks/useSiteText";
import { tr } from "@/lib/tr";
import { gsap } from "gsap";

const PAGE_SIZE = 9;
const SLIDE_DURATION = 6000;

export default function News() {
  const { t } = useTranslation();
  const siteText = useSiteText();

  const [page, setPage] = useState(1);
  const [heroIndex, setHeroIndex] = useState(0);
  const { data, loading } = useApi<PaginatedResponse<any>>(
    () => getNewsPage(page, PAGE_SIZE),
    { count: 0, next: null, previous: null, results: [] },
    [page]
  );
  const news = data.results;
  const totalPages = Math.max(1, Math.ceil(data.count / PAGE_SIZE));
  const listRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const featuredNews = useMemo(() => news.filter((item) => item.image), [news]);
  const activeHeroItem = featuredNews[heroIndex] ?? news[0];

  useEffect(() => {
    if (featuredNews.length < 2) return;
    const timer = window.setInterval(() => {
      setHeroIndex((index) => (index + 1) % featuredNews.length);
    }, SLIDE_DURATION);
    return () => window.clearInterval(timer);
  }, [featuredNews.length]);

  useEffect(() => {
    setHeroIndex(0);
  }, [page]);

  useEffect(() => {
    if (!activeHeroItem || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = [heroImageRef.current, heroContentRef.current].filter(Boolean);
    if (!targets.length) return;
    gsap.fromTo(
      targets,
      { opacity: 0.35, y: 12, scale: 1.015 },
      { opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.08, ease: "power3.out", clearProps: "transform,opacity" },
    );
  }, [activeHeroItem?.id]);

  const goToPage = (p: number) => {
    if (p === page) return;
    setPage(p);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="news-archive">
      <section className="news-hero">
        {activeHeroItem?.image && (
          <img
            ref={heroImageRef}
            key={activeHeroItem.id}
            className="news-hero-image"
            src={activeHeroItem.image}
            alt=""
            fetchPriority="high"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="news-hero-scrim" />
        <div className="container relative z-10 mx-auto px-4">
          <BackButton className="news-back-button" />
          <div className="news-hero-layout">
            <div className="news-hero-copy">
              <span className="news-eyebrow"><Sparkles aria-hidden="true" />{siteText("news_badge", "news.badge")}</span>
              <h1>{siteText("news_title", "news.title")}<span>.</span></h1>
              <p>{siteText("news_subtitle", "news.subtitle")}</p>
              <a className="news-scroll-link" href="#news-list">
                <span>{t("news.badge")}</span><ArrowDown aria-hidden="true" />
              </a>
            </div>

            {activeHeroItem && (
              <div ref={heroContentRef} className="news-featured">
                <div className="news-featured-topline">
                  <span><Newspaper aria-hidden="true" />{t("news.important")}</span>
                  <span>{String(heroIndex + 1).padStart(2, "0")} / {String(Math.max(featuredNews.length, 1)).padStart(2, "0")}</span>
                </div>
                <div className="news-featured-date">
                  {activeHeroItem.date && new Date(activeHeroItem.date).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
                </div>
                <h2>{tr(activeHeroItem.title)}</h2>
                <p>{tr(activeHeroItem.summary)}</p>
                <div className="news-featured-footer">
                  <span><Eye aria-hidden="true" />{activeHeroItem.views ?? 0}</span>
                  <Link to={`/news/${activeHeroItem.id}`} aria-label={t("news.read_more", { defaultValue: "Yangilikni o'qish" })}>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )}
          </div>
          {featuredNews.length > 1 && (
            <div className="news-hero-controls">
              <button
                type="button"
                aria-label={t("common.previous", { defaultValue: "Oldingi" })}
                onClick={() => setHeroIndex((index) => (index - 1 + featuredNews.length) % featuredNews.length)}
              >
                <ArrowLeft aria-hidden="true" />
              </button>
              <div className="news-hero-dots" role="tablist" aria-label={t("news.badge")}>
                {featuredNews.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-label={`${index + 1}: ${tr(item.title)}`}
                    aria-selected={index === heroIndex}
                    className={index === heroIndex ? "is-active" : ""}
                    onClick={() => setHeroIndex(index)}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label={t("common.next", { defaultValue: "Keyingi" })}
                onClick={() => setHeroIndex((index) => (index + 1) % featuredNews.length)}
              >
                <ArrowRight aria-hidden="true" />
              </button>
              <span className="news-hero-autoplay" aria-hidden="true"><i key={heroIndex} /></span>
            </div>
          )}
        </div>
      </section>

      <section id="news-list" ref={listRef} className="news-list scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="news-list-heading">
            <div>
              <span className="news-list-kicker">{siteText("news_badge", "news.badge")}</span>
              <h2>{siteText("news_title", "news.title")}</h2>
            </div>
            <span className="news-total">{String(data.count).padStart(2, "0")} <span>{t("news.badge")}</span></span>
          </div>
          {loading && news.length === 0 ? (
            <div className="news-loading" role="status" aria-label={t("common.loading")}><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <>
              {news.length > 0 ? (
                <div className={cn("news-card-grid transition-opacity duration-300", loading && "opacity-50")}>
                  {news.map((item: any) => <NewsCard key={item.id} item={item} variant="archive" />)}
                </div>
              ) : (
                <div className="news-empty">{t("common.section_empty")}</div>
              )}
              {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={goToPage} className="mt-16" />}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
