import { useEffect, useRef } from "react";
import Hero from "@/components/home/Hero";
import InteractiveCalendar from "@/components/home/InteractiveCalendar";
import Gallery from "@/components/home/Gallery";
import Testimonials from "@/components/home/Testimonials";
import Partners from "@/components/home/Partners";
import { getPerformances, getTeamMembers, getNews, getHomeAbout } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import PerformanceCard from "@/components/repertoire/PerformanceCard";
import ActorCard from "@/components/team/ActorCard";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, Moon, Sparkles, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { tr } from "@/lib/tr";
import { Counter } from "@/components/ui/counter";
import AboutImageSlider from "@/components/home/AboutImageSlider";
import EmptySection from "@/components/common/EmptySection";
import NewsCard from "@/components/news/NewsCard";
import { useSiteText } from "@/hooks/useSiteText";
import { useTheme } from "@/context/ThemeContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HOME_PERFORMANCES_LIMIT = 8;
const HOME_ACTORS_LIMIT = 8;

export default function Home() {
  const { t } = useTranslation();
  const siteText = useSiteText();
  const { theme, setTheme } = useTheme();
  const homeRef = useRef<HTMLDivElement>(null);
  const { data: performances, loading: perfLoading } = useApi(() => getPerformances("active"), []);
  const { data: actors, loading: actorsLoading } = useApi(() => getTeamMembers("aktyorlar"), []);
  const { data: newsList, loading: newsLoading } = useApi(() => getNews(), []);
  const { data: homeAbout } = useApi<any>(() => getHomeAbout(), {});

  useEffect(() => {
    const root = homeRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      root.querySelectorAll<HTMLElement>(
        ".home-section-heading, .home-intro-copy, .home-show-grid > *, .home-cast-grid > *, .home-news-grid > *",
      ).forEach((element) => {
        gsap.fromTo(
          element,
          { y: 26 },
          {
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              once: true,
            },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, [performances.length, actors.length, newsList.length]);

  return (
    <div ref={homeRef} className="home-theatre pb-0">
      <Hero />

      <section id="home-content" className="home-section home-section--about home-band home-band--intro">
        <div className="home-shell home-intro-layout">
          <div className="home-intro-visual">
            <AboutImageSlider />
            <div className="home-intro-stamp" aria-hidden="true">
              <Sparkles />
              <span>{siteText("home_about_badge", "home.about_badge")}</span>
            </div>
            {!!homeAbout.years_number && (
              <div className="home-years-card">
                <strong><Counter end={homeAbout.years_number} duration={2500} /></strong>
                <span>{tr(homeAbout.years_label) || tr(homeAbout.years_caption)}</span>
              </div>
            )}
          </div>

          <div className="home-intro-copy">
            <span className="home-eyebrow">{tr(homeAbout.badge) || t("home.about_badge")}</span>
            <h2 className="home-display-title">
              {tr(homeAbout.title) || t("home.about_title")}
            </h2>
            {tr(homeAbout.description) ? (
              <p className="home-lead">{tr(homeAbout.description)}</p>
            ) : (
              <p className="home-lead">{siteText("home_about_description", "home.about_desc")}</p>
            )}
            {(homeAbout.stat1_number || homeAbout.stat2_number) && (
              <div className="home-stat-row">
                {homeAbout.stat1_number && (
                  <div className="home-stat">
                    <strong><Counter end={homeAbout.stat1_number} duration={2000} suffix={homeAbout.stat1_suffix} /></strong>
                    <span>{tr(homeAbout.stat1_label)}</span>
                  </div>
                )}
                {homeAbout.stat2_number && (
                  <div className="home-stat">
                    <strong><Counter end={homeAbout.stat2_number} duration={2000} suffix={homeAbout.stat2_suffix} /></strong>
                    <span>{tr(homeAbout.stat2_label)}</span>
                  </div>
                )}
              </div>
            )}
            <div className="home-intro-footer">
              <Link to="/about" className="home-round-link" aria-label={t("hero.more_info")}>
                <span>{t("hero.more_info")}</span><ArrowRight />
              </Link>
              <button
                type="button"
                className="home-theme-toggle"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label={theme === "dark" ? t("accessibility.light") : t("accessibility.dark")}
                title={theme === "dark" ? t("accessibility.light") : t("accessibility.dark")}
              >
                {theme === "dark" ? <Sun /> : <Moon />}
                <span>{theme === "dark" ? t("accessibility.light") : t("accessibility.dark")}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-section--repertoire home-band home-band--shows">
        <div className="home-shell">
          <div className="home-section-heading home-section-heading--split">
            <div>
              <span className="home-eyebrow">{siteText("repertoire_badge", "home.repertoire_badge")}</span>
              <h2 className="home-display-title">{siteText("home_repertoire_title", "home.repertoire_title")}</h2>
            </div>
            <Link to="/repertoire" className="home-text-link">
              {t("home.all_performances")} <ArrowRight />
            </Link>
          </div>
          {perfLoading ? (
            <div className="home-loading"><Loader2 className="animate-spin" /></div>
          ) : performances.length === 0 ? (
            <EmptySection />
          ) : (
            <div className="home-show-grid">
              {performances.slice(0, HOME_PERFORMANCES_LIMIT).map((performance: any) => (
                <PerformanceCard key={performance.id} performance={performance} variant="home" />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="home-section home-section--calendar home-band home-band--calendar">
        <div className="home-shell">
          <div className="home-calendar-heading">
            <span className="home-eyebrow">{siteText("calendar_badge", "calendar.badge")}</span>
            <span className="home-calendar-note">{siteText("calendar_subtitle", "calendar.subtitle")}</span>
          </div>
          <div className="home-calendar-surface">
            <InteractiveCalendar />
          </div>
        </div>
      </section>

      <Gallery />

      <section className="home-section home-section--team home-band home-band--cast">
        <div className="home-shell">
          <div className="home-section-heading home-section-heading--split">
            <div>
              <span className="home-eyebrow">{siteText("home_team_badge", "home.team_badge")}</span>
              <h2 className="home-display-title">{siteText("home_team_title", "home.team_title")}</h2>
            </div>
            <Link to="/team" className="home-text-link">
              {t("home.all_actors")} <ArrowRight />
            </Link>
          </div>
          {actorsLoading ? (
            <div className="home-loading"><Loader2 className="animate-spin" /></div>
          ) : actors.length === 0 ? (
            <EmptySection />
          ) : (
            <div className="home-cast-grid">
              {actors.slice(0, HOME_ACTORS_LIMIT).map((actor: any) => (
                <ActorCard key={actor.id} actor={actor} variant="home" />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="home-section home-section--news home-band home-band--news">
        <div className="home-shell">
          <div className="home-section-heading home-section-heading--split">
            <div>
              <span className="home-eyebrow">{siteText("news_badge", "news.badge")}</span>
              <h2 className="home-display-title">{siteText("news_title", "news.title")}</h2>
            </div>
            <Link to="/news" className="home-text-link">
              {t("home.all_news")} <ArrowRight />
            </Link>
          </div>
          {newsLoading ? (
            <div className="home-loading"><Loader2 className="animate-spin" /></div>
          ) : newsList.length === 0 ? (
            <EmptySection />
          ) : (
            <div className="home-news-grid">
              {newsList.slice(0, 3).map((item: any) => (
                <NewsCard key={item.id} item={item} variant="home" />
              ))}
            </div>
          )}
        </div>
      </section>

      <Testimonials />
      <Partners />
    </div>
  );
}
