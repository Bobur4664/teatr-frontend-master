import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPerformance } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Eye,
  Loader2,
  Mail,
  MapPin,
  Play,
  Theater,
  UserRound,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { tr } from "@/lib/tr";
import VideoModal from "@/components/common/VideoModal";
import BackButton from "@/components/common/BackButton";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function PerformanceDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const pageRef = useRef<HTMLElement>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const { settings } = useSiteSettings();
  const venueAddress = tr(settings?.address) || t("contact.address_desc");
  const venuePhone = settings?.phone || "";
  const venueEmail = settings?.email || "";

  const { data: performance, loading } = useApi(
    () => getPerformance(id!),
    null,
    [id],
  );

  useEffect(() => {
    const root = pageRef.current;
    if (!root || !performance || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      root.querySelectorAll<HTMLElement>(".performance-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 28 },
          {
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, [id, performance?.id]);

  const cast = useMemo(() => performance?.cast ?? [], [performance?.cast]);
  const galleryImages = useMemo(
    () =>
      (Array.isArray(performance?.gallery_images) ? performance.gallery_images : [])
        .map((image: any) => typeof image === "string" ? image : image?.image)
        .filter((image: unknown): image is string => typeof image === "string" && image.length > 0),
    [performance?.gallery_images],
  );

  const formattedDate = useMemo(() => {
    if (!performance?.next_show) return "";
    const date = new Date(performance.next_show);
    if (Number.isNaN(date.getTime())) return "";
    const language = i18n.language?.split("-")[0] || "uz";
    return date.toLocaleDateString(language === "uz" || language === "qr" ? "uz-UZ" : language, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [i18n.language, performance?.next_show]);

  if (loading) {
    return (
      <main className="performance-state">
        <Loader2 aria-hidden="true" />
      </main>
    );
  }

  if (!performance) {
    return (
      <main className="performance-state performance-not-found">
        <Theater aria-hidden="true" />
        <h1>{t("performance.not_found")}</h1>
        <Link to="/repertoire">
          <Button variant="outline"><ArrowLeft aria-hidden="true" /> {t("performance.back_to_repertoire")}</Button>
        </Link>
      </main>
    );
  }

  return (
    <main ref={pageRef} className="performance-page">
      <header className="performance-hero">
        {performance.image ? (
          <img
            className="performance-hero-image"
            src={performance.image}
            alt={tr(performance.title)}
            fetchPriority="high"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="performance-hero-fallback" aria-hidden="true" />
        )}
        <div className="performance-hero-shade" />
        <div className="performance-hero-grain" aria-hidden="true" />
        <div className="container relative z-10 mx-auto px-4">
          <BackButton className="performance-back" />
          <div className="performance-hero-content">
            <div className="performance-hero-copy">
              <span className="performance-eyebrow"><Theater aria-hidden="true" /> {tr(performance.genre?.name) || t("nav.repertoire")}</span>
              <h1>{tr(performance.title)}</h1>
              <div className="performance-hero-facts">
                {!!performance.age_limit && <span>{performance.age_limit}</span>}
                {!!tr(performance.duration) && <span><Clock3 aria-hidden="true" />{tr(performance.duration)}</span>}
                <span><Eye aria-hidden="true" />{performance.views ?? 0} {t("common.views")}</span>
              </div>
              <div className="performance-hero-actions">
                <a href="#performance-story" className="performance-main-action">
                  {t("performance.annotation")} <ArrowDown aria-hidden="true" />
                </a>
                {performance.trailer_url && (
                  <button type="button" className="performance-trailer-action" onClick={() => setIsTrailerOpen(true)}>
                    <Play aria-hidden="true" /> {t("performance.view_trailer")}
                  </button>
                )}
              </div>
            </div>
            <div className="performance-hero-index" aria-hidden="true">
              <span>ETEATR</span><strong>{String(performance.id).padStart(2, "0")}</strong>
            </div>
          </div>
        </div>
      </header>

      {performance.is_live && performance.live_url && (
        <motion.aside
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="performance-live"
        >
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="performance-live-dot" />
              <strong>LIVE</strong>
              <span>{t("performance.live_now", "Bu spektakl hozir jonli efirda!")}</span>
            </div>
            <a href={performance.live_url} target="_blank" rel="noopener noreferrer">
              <Play aria-hidden="true" /> {t("performance.watch_live", "Tomosha qilish")}
            </a>
          </div>
        </motion.aside>
      )}

      <div className="performance-content container mx-auto px-4">
        <div className="performance-main-column">
          <section id="performance-story" className="performance-story performance-reveal">
            <div className="performance-section-label"><span>01</span> {t("performance.annotation")}</div>
            <h2>{tr(performance.title)}</h2>
            <p>{tr(performance.description) || t("performance.annotation")}</p>
            {!!tr(performance.director_name) && (
              <div className="performance-director">
                <UserRound aria-hidden="true" />
                <span>{t("performance.director")}</span>
                <strong>{tr(performance.director_name)}</strong>
              </div>
            )}
          </section>

          {cast.length > 0 && (
            <section className="performance-cast performance-reveal">
              <div className="performance-section-heading">
                <div><span className="performance-section-label"><span>02</span> {t("performance.cast")}</span><h2>{t("performance.cast")}</h2></div>
                <span>{String(cast.length).padStart(2, "0")}</span>
              </div>
              <div className="performance-cast-grid">
                {cast.map((actor: any, index: number) => (
                  <Link key={actor.id} to={`/team/${actor.id}`} className="performance-cast-member">
                    <span className="performance-cast-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="performance-cast-avatar">
                      {actor.image ? (
                        <img src={actor.image} alt={tr(actor.name)} loading="lazy" referrerPolicy="no-referrer" />
                      ) : (
                        <span>{(tr(actor.name) || "?").slice(0, 1)}</span>
                      )}
                    </span>
                    <span className="performance-cast-copy">
                      <strong>{tr(actor.name)}</strong>
                      <small>{tr(actor.role) || t("performance.lead_role")}</small>
                    </span>
                    <ArrowRight className="performance-cast-arrow" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {galleryImages.length > 0 && (
            <section className="performance-gallery performance-reveal">
              <div className="performance-section-heading">
                <div><span className="performance-section-label"><span>03</span> {t("gallery.title")}</span><h2>{t("gallery.title")}</h2></div>
                <span>{String(galleryImages.length).padStart(2, "0")}</span>
              </div>
              <div className="performance-gallery-grid">
                {galleryImages.slice(0, 4).map((image, index) => (
                  <a key={`${image}-${index}`} href={image} target="_blank" rel="noreferrer" className="performance-gallery-image">
                    <img src={image} alt={`${tr(performance.title)} ${index + 1}`} loading="lazy" referrerPolicy="no-referrer" />
                    <span>{String(index + 1).padStart(2, "0")} <ArrowRight aria-hidden="true" /></span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {performance.trailer_url && (
            <section className="performance-trailer performance-reveal">
              <div className="performance-section-heading">
                <div><span className="performance-section-label"><span>04</span> {t("performance.trailer")}</span><h2>{t("performance.trailer")}</h2></div>
              </div>
              <button type="button" className="performance-trailer-card" onClick={() => setIsTrailerOpen(true)}>
                {performance.image && <img src={performance.image} alt="" loading="lazy" referrerPolicy="no-referrer" />}
                <span className="performance-trailer-play"><Play aria-hidden="true" /></span>
                <span className="performance-trailer-caption">{t("performance.view_trailer")}</span>
              </button>
            </section>
          )}
        </div>

        <aside className="performance-aside performance-reveal">
          <div className="performance-info-card">
            <span className="performance-section-label"><span>INFO</span> {t("performance.info")}</span>
            <h2>{t("performance.info")}</h2>
            <div className="performance-info-list">
              {!!formattedDate && (
                <div><CalendarDays aria-hidden="true" /><span>{t("performance.next_show")}<strong>{formattedDate}</strong></span></div>
              )}
              {!!tr(performance.duration) && (
                <div><Clock3 aria-hidden="true" /><span>{t("performance.duration")}<strong>{tr(performance.duration)}</strong></span></div>
              )}
              {!!tr(performance.director_name) && (
                <div><UserRound aria-hidden="true" /><span>{t("performance.director")}<strong>{tr(performance.director_name)}</strong></span></div>
              )}
              {!!venueAddress && (
                <div><MapPin aria-hidden="true" /><span>{t("contact.address")}<strong>{venueAddress}</strong></span></div>
              )}
              {!!venuePhone && (
                <div><span className="performance-info-phone">TEL</span><span>{t("contact.phone")}<a href={`tel:${venuePhone.replace(/\s+/g, "")}`}>{venuePhone}</a></span></div>
              )}
              {!!venueEmail && (
                <div><Mail aria-hidden="true" /><span>{t("contact.email")}<a href={`mailto:${venueEmail}`}>{venueEmail}</a></span></div>
              )}
            </div>
            <Link to="/contact" className="performance-contact-link">
              {t("performance.contact_us")} <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <Link to="/repertoire" className="performance-back-link"><ArrowLeft aria-hidden="true" /> {t("performance.back_to_repertoire")}</Link>
        </aside>
      </div>

      <VideoModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        videoUrl={performance.trailer_url || ""}
        title={`${tr(performance.title)} - ${t("performance.trailer")}`}
      />
    </main>
  );
}
