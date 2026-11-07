import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  CalendarDays,
  Sparkles,
  Theater,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Timeline, { type TimelineMilestone } from "@/components/ui/timeline";
import { Counter } from "@/components/ui/counter";
import BackButton from "@/components/common/BackButton";
import { getAboutPage, getAboutStats, getGallery, getPartners, getTimeline } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { tr } from "@/lib/tr";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useSiteText } from "@/hooks/useSiteText";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Partner {
  id: number;
  name: Record<string, string> | string;
  label: Record<string, string> | string;
  logo: string | null;
  url: string;
  order: number;
}

interface TimelineEvent {
  id: number;
  year: string;
  title: Record<string, string> | string;
  description: Record<string, string> | string;
  order: number;
}

interface AboutStat {
  id: number;
  value: number;
  suffix: string;
  label: Record<string, string> | string;
  order: number;
}

interface GalleryImage {
  id: number;
  image: string;
  title?: Record<string, string> | string;
  category?: string;
}

const TIMELINE_FEATURE_IMAGE =
  "https://cdn.21st.dev/assets/mirror/b0/b0c41784074f76ac5fb6b447da87780c901135841317a096241371f24bc13ddd.jpg";

export default function About() {
  const { t } = useTranslation();
  const siteText = useSiteText();
  const pageRef = useRef<HTMLDivElement>(null);
  const { data: partners } = useApi<Partner[]>(() => getPartners(), []);
  const { data: timeline } = useApi<TimelineEvent[]>(() => getTimeline(), []);
  const { data: aboutStats } = useApi<AboutStat[]>(() => getAboutStats(), []);
  const { data: page } = useApi<Record<string, string>>(() => getAboutPage(), {});
  const { data: gallery } = useApi<GalleryImage[]>(() => getGallery(), []);
  const { settings } = useSiteSettings();

  const copy = (field: string, key: string) => tr(page?.[field]) || t(key);
  const customTitle = !!(tr(page?.hero_title_line1) || tr(page?.hero_title_line2));
  const heroTitle1 = customTitle ? tr(page?.hero_title_line1) : t("about.hero_title_line1");
  const heroTitle2 = customTitle ? tr(page?.hero_title_line2) : t("about.hero_title_line2");
  const theaterName = tr(settings?.site_name) || t("about.hero_image_alt", "Teatr");
  const customText = tr(page?.content_text).trim();
  const aboutHtml = tr(settings?.about);

  const milestones = useMemo<TimelineMilestone[]>(() => {
    if (timeline.length > 0) {
      return [...timeline]
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
          key: item.id,
          year: String(item.year),
          title: tr(item.title),
          description: tr(item.description),
        }));
    }

    return Array.from({ length: 7 }, (_, index) => {
      const key = index + 1;
      return {
        key,
        year: t(`about.timeline_${key}_year`),
        title: t(`about.timeline_${key}_title`),
        description: t(`about.timeline_${key}_desc`),
      };
    });
  }, [timeline, t]);

  const stats = useMemo(
    () =>
      aboutStats.length > 0
        ? [...aboutStats]
            .sort((a, b) => a.order - b.order)
            .map((stat) => ({ end: stat.value, suffix: stat.suffix || undefined, label: tr(stat.label) }))
        : [
            { end: 105, label: t("about.stat_history") },
            { end: 50, suffix: "+", label: t("about.stat_creators") },
            { end: 20, suffix: "+", label: t("about.stat_performances") },
            { end: 15, suffix: "+", label: t("about.stat_awards") },
          ],
    [aboutStats, t],
  );

  const historyChapters = [
    { year: milestones[0]?.year ?? "1918", title: t("about.history_section_1_title"), text: t("about.history_section_1_text") },
    { year: milestones[Math.min(2, milestones.length - 1)]?.year ?? "1945", title: t("about.history_section_2_title"), text: t("about.history_section_2_text") },
    { year: milestones[Math.min(4, milestones.length - 1)]?.year ?? "1991", title: t("about.history_section_3_title"), text: t("about.history_section_3_text") },
  ];

  const heroImage =
    tr(page?.hero_image) ||
    gallery.find((item) => item.image)?.image ||
    "";
  const periodLabel = milestones.length > 1
    ? `${milestones[0].year} — ${milestones[milestones.length - 1].year}`
    : milestones[0]?.year || "";

  useEffect(() => {
    const root = pageRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      root.querySelectorAll<HTMLElement>(".about-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, [partners.length, stats.length, heroImage]);

  return (
    <main ref={pageRef} className="about-page">
      <section className="about-hero">
        {heroImage && (
          <img
            src={heroImage}
            alt={theaterName}
            className="about-hero-image"
            fetchPriority="high"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="about-hero-shade" />
        <div className="about-hero-grain" aria-hidden="true" />
        <div className="container relative z-10 mx-auto px-4">
          <BackButton className="about-back-button" />
          <div className="about-hero-layout">
            <motion.div
              className="about-hero-copy"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="about-eyebrow"><Sparkles aria-hidden="true" />{copy("hero_badge", "about.hero_badge")}</span>
              <h1>
                {heroTitle1}
                {heroTitle2 && <span>{heroTitle2}</span>}
              </h1>
              <p>{copy("hero_subtitle", "about.hero_subtitle")}</p>
              <a className="about-scroll-link" href="#about-story">
                <span>{t("about.history_badge")}</span>
                <ArrowDown aria-hidden="true" />
              </a>
            </motion.div>

            <motion.div
              className="about-hero-stamp"
              initial={{ opacity: 0, scale: 0.88, rotate: 8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>{t("about.hero_badge")}</span>
              <strong><Counter end={stats[0]?.end ?? 105} /></strong>
              <span>{t("about.stat_history")}</span>
              <Theater aria-hidden="true" />
            </motion.div>
          </div>
          <span className="about-hero-index" aria-hidden="true">01 / {String(stats.length + 3).padStart(2, "0")}</span>
        </div>
      </section>

      <section className="about-stats" aria-label={t("about.history_badge")}>
        <div className="container mx-auto grid grid-cols-2 px-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={`${stat.label}-${index}`}
              className="about-stat about-reveal"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.08, duration: 0.55 }}
            >
              <span className="about-stat-index">0{index + 1}</span>
              <strong><Counter end={stat.end} duration={2400} suffix={stat.suffix} /></strong>
              <span>{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="about-story" className="about-story">
        <div className="container mx-auto px-4">
          <div className="about-story-heading about-reveal">
            <div>
              <span className="about-section-kicker">{copy("history_badge", "about.history_badge")}</span>
              <h2>{copy("history_title", "about.history_title")}</h2>
            </div>
            <p>{copy("history_intro", "about.history_intro")}</p>
          </div>

          <div className="about-story-grid">
            <div className="about-story-visual about-reveal">
              {heroImage ? (
                <img src={heroImage} alt={theaterName} loading="lazy" referrerPolicy="no-referrer" />
              ) : (
                <div className="about-story-art" aria-hidden="true"><Theater /></div>
              )}
              <div className="about-story-quote">
                <span aria-hidden="true">“</span>
                <p>{copy("content_quote", "about.content_quote")}</p>
              </div>
              <span className="about-story-vertical">{theaterName}</span>
            </div>

            <div className="about-story-copy">
              {aboutHtml ? (
                <div
                  className="about-rich-copy about-reveal"
                  dangerouslySetInnerHTML={{ __html: aboutHtml }}
                />
              ) : (
                <div className="about-story-paragraphs">
                  {(customText
                    ? customText.split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean)
                    : [t("about.content_p1"), t("about.content_p2"), t("about.content_p3")]
                  ).map((text, index) => (
                    <p className="about-story-paragraph about-reveal" key={`${index}-${text.slice(0, 16)}`}>
                      <span>0{index + 1}</span>{text}
                    </p>
                  ))}
                </div>
              )}

              <div className="about-chapter-list">
                {historyChapters.map((chapter, index) => (
                  <article className="about-chapter about-reveal" key={chapter.title}>
                    <span className="about-chapter-year">{chapter.year}</span>
                    <div>
                      <h3>{chapter.title}</h3>
                      <p>{chapter.text}</p>
                    </div>
                    <span className="about-chapter-index">0{index + 1}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Timeline
        title={copy("timeline_title", "about.timeline_title")}
        periodLabel={periodLabel}
        milestones={milestones}
        backgroundColor="var(--color-background, #0a0a0a)"
        textColor="var(--color-foreground, #ffffff)"
        mutedTextColor="var(--color-muted-foreground, #a1a1aa)"
        activeColor="#ff5f00"
        imageUrl={heroImage || TIMELINE_FEATURE_IMAGE}
        imageAlt={heroImage ? theaterName : t("about.history_title")}
        duration={1.4}
        scrollHint={t("about.timeline_scroll_hint", { defaultValue: "Davom ettirish uchun pastga aylantiring" })}
      />

      {partners.length > 0 && (
        <section className="about-partners">
          <div className="container mx-auto px-4">
            <div className="about-partners-heading about-reveal">
              <div>
                <span className="about-section-kicker">{copy("partners_badge", "about.partners_badge")}</span>
                <h2>{copy("partners_title", "about.partners_title")}</h2>
              </div>
              <p>{copy("partners_intro", "about.partners_intro")}</p>
            </div>
            <div className="about-partner-grid">
              {partners.map((partner, index) => {
                const name = tr(partner.name);
                const label = tr(partner.label) || name;
                const content = (
                  <>
                    <span className="about-partner-number">0{index + 1}</span>
                    <span className="about-partner-logo">
                      {partner.logo
                        ? <img src={partner.logo} alt={name} loading="lazy" />
                        : <Building2 aria-hidden="true" />}
                    </span>
                    <span className="about-partner-name">{label}</span>
                    {label !== name && <span className="about-partner-subtitle">{name}</span>}
                    <ArrowRight className="about-partner-arrow" aria-hidden="true" />
                  </>
                );

                return (
                  <motion.div
                    key={partner.id}
                    className="about-partner about-reveal"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: (index % 4) * 0.07, duration: 0.55 }}
                  >
                    {partner.url
                      ? <a href={partner.url} target="_blank" rel="noopener noreferrer">{content}</a>
                      : <div>{content}</div>}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="about-finale">
        <div className="about-finale-orbit about-finale-orbit--one" aria-hidden="true" />
        <div className="about-finale-orbit about-finale-orbit--two" aria-hidden="true" />
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            className="about-finale-copy"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="about-section-kicker">{copy("mission_badge", "about.content_title_2")}</span>
            <h2>{copy("mission_text", "about.content_p3")}</h2>
            <p>{copy("content_p2", "about.content_p2")}</p>
            <div className="about-finale-actions">
              <Link to="/repertoire">
                <Button className="about-cta-primary">
                  {copy("btn_repertoire", "about.btn_view_repertoire")}<ArrowRight aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/team">
                <Button variant="outline" className="about-cta-secondary">
                  {copy("btn_team", "about.btn_view_team")}<ArrowRight aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </motion.div>
          <span className="about-finale-mark" aria-hidden="true"><CalendarDays />{periodLabel}</span>
        </div>
      </section>
    </main>
  );
}
