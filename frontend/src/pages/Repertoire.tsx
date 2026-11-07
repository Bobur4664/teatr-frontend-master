import { useEffect, useMemo, useRef, useState } from "react";
import { getPerformances, getGenres } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import PerformanceCard from "@/components/repertoire/PerformanceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowRight,
  Archive,
  CalendarDays,
  Clapperboard,
  Loader2,
  Search,
  Sparkles,
  Theater,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BackButton from "@/components/common/BackButton";
import { tr } from "@/lib/tr";
import { useSiteText } from "@/hooks/useSiteText";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Repertoire() {
  const { t, i18n } = useTranslation();
  const siteText = useSiteText();
  const pageRef = useRef<HTMLElement>(null);
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState<number | "all">("all");

  const { data: performances, loading } = useApi(() => getPerformances("active"), []);
  const { data: genres } = useApi(() => getGenres(), []);

  const sortedPerformances = useMemo(
    () =>
      [...performances].sort((a: any, b: any) => {
        const aDate = new Date(a.next_show).getTime();
        const bDate = new Date(b.next_show).getTime();
        const validA = Number.isFinite(aDate) ? aDate : Number.MAX_SAFE_INTEGER;
        const validB = Number.isFinite(bDate) ? bDate : Number.MAX_SAFE_INTEGER;
        return validA - validB;
      }),
    [performances],
  );
  const featuredPerformance = sortedPerformances[0];
  const normalizedSearch = search.trim().toLocaleLowerCase(i18n.language);
  const filteredPerformances = useMemo(
    () =>
      sortedPerformances.filter((performance: any) => {
        const castNames = (performance.cast ?? []).map((actor: any) => tr(actor.name));
        const searchableText = [
          tr(performance.title),
          tr(performance.director_name),
          tr(performance.genre?.name),
          ...castNames,
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase(i18n.language);
        const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
        const matchesGenre = activeGenre === "all" || performance.genre?.id === activeGenre;
        return matchesSearch && matchesGenre;
      }),
    [activeGenre, i18n.language, normalizedSearch, sortedPerformances],
  );

  useEffect(() => {
    const root = pageRef.current;
    if (!root || loading || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      if (root.querySelector(".repertoire-hero-copy")) {
        gsap.fromTo(
          ".repertoire-hero-copy > *",
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", clearProps: "all" },
        );
      }
      if (root.querySelector(".repertoire-featured")) {
        gsap.fromTo(
          ".repertoire-featured",
          { x: 32, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 1, delay: 0.18, ease: "power3.out", clearProps: "all" },
        );
      }
      root.querySelectorAll<HTMLElement>(".repertoire-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 26, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, [featuredPerformance?.id, loading]);

  useEffect(() => {
    const root = pageRef.current;
    if (
      !root
      || loading
      || filteredPerformances.length === 0
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(
        ".repertoire-card-wrap",
        { y: 22, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.07, ease: "power2.out", clearProps: "all" },
      );
    }, root);

    return () => context.revert();
  }, [activeGenre, filteredPerformances, normalizedSearch]);

  const formatShowDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const language = i18n.language?.split("-")[0] || "uz";
    return date.toLocaleDateString(language === "uz" || language === "qr" ? "uz-UZ" : language, {
      day: "numeric",
      month: "long",
    });
  };

  return (
    <main ref={pageRef} className="repertoire-page">
      <section className="repertoire-hero">
        <div className="repertoire-hero-grain" aria-hidden="true" />
        <div className="container relative z-10 mx-auto px-4">
          <BackButton className="repertoire-back" />
          <div className="repertoire-hero-layout">
            <div className="repertoire-hero-copy">
              <span className="repertoire-eyebrow">
                <Sparkles aria-hidden="true" />
                {siteText("repertoire_badge", "home.repertoire_badge")}
              </span>
              <h1>{t("nav.repertoire")}<span>.</span></h1>
              <p>{siteText("repertoire_subtitle", "repertoire.subtitle")}</p>
              <div className="repertoire-hero-actions">
                <a href="#repertoire-list" className="repertoire-primary-link">
                  {t("nav.repertoire")} <ArrowDown aria-hidden="true" />
                </a>
                <Link to="/archive" className="repertoire-archive-link">
                  <Archive aria-hidden="true" /> {t("nav.archive")}
                </Link>
              </div>
              <div className="repertoire-season-stats" aria-label={t("nav.repertoire")}>
                <div><strong>{String(performances.length).padStart(2, "0")}</strong><span>{t("performance.season_count")}</span></div>
                <div><strong>{String(genres.length).padStart(2, "0")}</strong><span>{t("performance.genres_count")}</span></div>
                <div><strong>{featuredPerformance?.age_limit || "—"}</strong><span>{t("performance.age_limit")}</span></div>
              </div>
            </div>

            {featuredPerformance && (
              <Link
                to={`/performance/${featuredPerformance.id}`}
                className="repertoire-featured group"
                aria-label={tr(featuredPerformance.title)}
              >
                {featuredPerformance.image ? (
                  <img
                    src={featuredPerformance.image}
                    alt={tr(featuredPerformance.title)}
                    referrerPolicy="no-referrer"
                    fetchPriority="high"
                  />
                ) : (
                  <div className="repertoire-featured-fallback" aria-hidden="true" />
                )}
                <div className="repertoire-featured-shade" />
                <span className="repertoire-featured-badge"><Theater aria-hidden="true" /> {t("hero.more_info")}</span>
                <div className="repertoire-featured-copy">
                  <span>{tr(featuredPerformance.genre?.name) || t("repertoire.all")}</span>
                  <h2>{tr(featuredPerformance.title)}</h2>
                  <div>
                    <span><CalendarDays aria-hidden="true" />{formatShowDate(featuredPerformance.next_show)}</span>
                    <span className="repertoire-featured-arrow"><ArrowRight aria-hidden="true" /></span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section id="repertoire-list" className="repertoire-list">
        <div className="container mx-auto px-4">
          <div className="repertoire-list-heading repertoire-reveal">
            <div>
              <span className="repertoire-list-kicker"><Clapperboard aria-hidden="true" /> {t("nav.repertoire")}</span>
              <h2>{siteText("home_repertoire_title", "home.repertoire_title")}</h2>
            </div>
            <p>{filteredPerformances.length.toString().padStart(2, "0")} <span>{t("repertoire.all")}</span></p>
          </div>

          <div className="repertoire-toolbar">
            <label className="repertoire-search">
              <Search aria-hidden="true" />
              <Input
                placeholder={t("common.search")}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label={t("common.search")}
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} aria-label={t("repertoire.clear_filters")}>
                  <X aria-hidden="true" />
                </button>
              )}
            </label>
            <div className="repertoire-filters" role="group" aria-label={t("repertoire.all")}>
              <Button
                type="button"
                variant={activeGenre === "all" ? "default" : "outline"}
                aria-pressed={activeGenre === "all"}
                onClick={() => setActiveGenre("all")}
                className={`repertoire-filter ${activeGenre === "all" ? "is-active" : ""}`}
              >
                {t("repertoire.all")}
              </Button>
              {genres.map((genre: any) => (
                <Button
                  type="button"
                  key={genre.id}
                  variant={activeGenre === genre.id ? "default" : "outline"}
                  aria-pressed={activeGenre === genre.id}
                  onClick={() => setActiveGenre(genre.id)}
                  className={`repertoire-filter ${activeGenre === genre.id ? "is-active" : ""}`}
                >
                  {tr(genre.name) || "—"}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="repertoire-loading" role="status" aria-label={t("common.loading")}>
              <Loader2 aria-hidden="true" />
            </div>
          ) : filteredPerformances.length > 0 ? (
            <div className="repertoire-card-grid">
              {filteredPerformances.map((performance: any, index: number) => (
                <div className="repertoire-card-wrap" key={performance.id} data-index={index + 1}>
                  <PerformanceCard performance={performance} />
                </div>
              ))}
            </div>
          ) : (
            <div className="repertoire-empty">
              <div><Search aria-hidden="true" /></div>
              <p>{t("repertoire.no_results")}</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setSearch(""); setActiveGenre("all"); }}
              >
                {t("repertoire.clear_filters")}
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
