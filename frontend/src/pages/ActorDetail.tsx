import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTeamMember, getPerformances, likeTeamMember } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useTranslation } from "react-i18next";
import { tr } from "@/lib/tr";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowUpRight,
  Eye,
  Heart,
  Instagram,
  Facebook,
  Twitter,
  Star,
  Loader2,
  Sparkles,
  Theater,
} from "lucide-react";
import PerformanceCard from "@/components/repertoire/PerformanceCard";
import BackButton from "@/components/common/BackButton";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type SocialLink = { label: string; href: string; icon: typeof Instagram };

export default function ActorDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const pageRef = useRef<HTMLDivElement>(null);

  const { data: actor, loading: actorLoading } = useApi(
    () => getTeamMember(id!),
    null,
    [id],
  );
  const { data: performances } = useApi(() => getPerformances(), []);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likePending, setLikePending] = useState(false);

  useEffect(() => {
    setLikes(actor?.likes ?? 0);
    setIsLiked(false);
  }, [actor?.id, actor?.likes]);

  const isDirector = actor?.category === "sahna_ijodkorlari";
  const isManagement = actor?.category === "rahbariyat";
  const isStaff = actor?.category === "xodimlar";

  const actorPerformances = useMemo(() => {
    if (!actor || isManagement || isStaff) return [];
    return isDirector
      ? performances.filter((performance: any) => tr(performance.director_name) === tr(actor.name))
      : performances.filter((performance: any) => performance.cast?.some((member: any) => member.id === actor.id));
  }, [actor, isDirector, isManagement, isStaff, performances]);

  const socialLinks: SocialLink[] = [
    { label: "Instagram", href: actor?.instagram_url || actor?.instagram || "", icon: Instagram },
    { label: "Facebook", href: actor?.facebook_url || actor?.facebook || "", icon: Facebook },
    { label: "Twitter", href: actor?.twitter_url || actor?.twitter || "", icon: Twitter },
  ].filter((link) => /^https?:\/\//i.test(link.href));

  useEffect(() => {
    const root = pageRef.current;
    if (!root || !actor || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(".actor-portrait", { opacity: 0, y: 35, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.9 })
        .fromTo(".actor-intro-reveal", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.11 }, "-=0.55");

      root.querySelectorAll<HTMLElement>(".actor-scroll-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.72,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: element, start: "top 90%", once: true },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, [actor, actorPerformances.length]);

  const handleLike = async () => {
    if (!actor || likePending) return;
    setLikePending(true);
    try {
      if (isLiked) {
        setLikes((count) => Math.max(0, count - 1));
        setIsLiked(false);
      } else {
        const result = await likeTeamMember(actor.id);
        setLikes(result.likes);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Aktyorga like yuborilmadi:", error);
    } finally {
      setLikePending(false);
    }
  };

  if (actorLoading) {
    return (
      <div className="actor-loading" role="status" aria-label={t("common.loading")}>
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="actor-not-found">
        <span className="team-eyebrow"><Theater aria-hidden="true" />{t("team_page.badge")}</span>
        <h1>{t("actor.not_found")}</h1>
        <Link to="/team">
          <Button className="mt-5 rounded-full px-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("actor.back_to_team")}
          </Button>
        </Link>
      </div>
    );
  }

  const currentLikes = likes;
  const views = actor.views ?? 0;
  const notableRoles: string[] = Array.isArray(actor.notable_roles) ? actor.notable_roles : [];
  const roleHeading = isDirector
    ? t("actor.roles_director")
    : isManagement
      ? t("actor.roles_management")
      : t("actor.roles_actor");

  return (
    <div ref={pageRef} className="actor-page">
      <div className="container mx-auto px-4 pt-8 md:pt-12">
        <BackButton className="mb-0" />
      </div>

      <div className="container mx-auto px-4 pb-20 pt-8 md:pb-28 md:pt-12">
        <section className="actor-hero">
          <div className="actor-portrait-wrap">
            <div className="actor-portrait-frame">
              {actor.image ? (
                <img
                  src={actor.image}
                  alt={tr(actor.name)}
                  className="actor-portrait"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="actor-portrait-placeholder" aria-hidden="true">
                  <Theater />
                </div>
              )}
              <div className="actor-portrait-shade" />
              <span className="actor-portrait-caption">
                <Sparkles aria-hidden="true" />
                {t("team_page.badge")}
              </span>
            </div>
            <div className="actor-stats-card actor-scroll-reveal">
              <div className="actor-stat">
                <span className="actor-stat-icon actor-stat-icon--heart"><Heart aria-hidden="true" /></span>
                <span className="actor-stat-copy"><strong>{currentLikes}</strong><small>{t("actor.like")}</small></span>
              </div>
              <div className="actor-stat">
                <span className="actor-stat-icon"><Eye aria-hidden="true" /></span>
                <span className="actor-stat-copy"><strong>{views}</strong><small>{t("common.views")}</small></span>
              </div>
              <Button
                onClick={handleLike}
                disabled={likePending}
                aria-pressed={isLiked}
                variant={isLiked ? "default" : "outline"}
                className={`actor-like-button ${isLiked ? "is-liked" : ""}`}
              >
                {likePending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={isLiked ? "fill-current" : ""} />}
                <span>{isLiked ? t("actor.liked") : t("actor.like")}</span>
              </Button>
            </div>
            {socialLinks.length > 0 && (
              <div className="actor-socials actor-scroll-reveal">
                <span>{t("actor.social_media")}</span>
                <div>
                  {socialLinks.map(({ label, href, icon: Icon }) => (
                    <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                      <Icon aria-hidden="true" />
                      <ArrowUpRight aria-hidden="true" className="actor-social-arrow" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="actor-intro">
            <div className="actor-intro-reveal">
              <span className="team-eyebrow"><Theater aria-hidden="true" />{tr(actor.role) || t("team_page.badge")}</span>
            </div>
            <h1 className="actor-name actor-intro-reveal">{tr(actor.name)}</h1>
            <div className="actor-name-rule actor-intro-reveal" />

            <section className="actor-bio actor-scroll-reveal">
              <h2><span>01</span>{t("actor.biography")}</h2>
              {tr(actor.biography) ? (
                <p>{tr(actor.biography)}</p>
              ) : (
                <p className="actor-empty-copy">{t("team_page.empty")}</p>
              )}
            </section>

            <section className="actor-roles actor-scroll-reveal">
              <div className="actor-section-heading">
                <h2><span>02</span>{roleHeading}</h2>
                {notableRoles.length > 0 && <span>{notableRoles.length.toString().padStart(2, "0")}</span>}
              </div>
              {notableRoles.length > 0 ? (
                <div className="actor-role-list">
                  {notableRoles.map((role, index) => (
                    <div key={`${role}-${index}`} className="actor-role-item">
                      <Star aria-hidden="true" />
                      <span>{tr(role)}</span>
                      <span className="actor-role-number">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="actor-empty-copy">{t("team_page.empty")}</p>
              )}
            </section>
          </div>
        </section>

        {!(isManagement || isStaff) && (
          <section className="actor-performances actor-scroll-reveal">
            <div className="actor-section-heading actor-performances-heading">
              <div>
                <span className="team-section-kicker">{t("team_page.badge")}</span>
                <h2>{isDirector ? t("actor.performances_director") : t("actor.performances_actor")}</h2>
              </div>
              <span>{actorPerformances.length.toString().padStart(2, "0")}</span>
            </div>
            {actorPerformances.length > 0 ? (
              <div className="actor-performances-grid">
                {actorPerformances.map((performance: any) => (
                  <PerformanceCard key={performance.id} performance={performance} />
                ))}
              </div>
            ) : (
              <div className="actor-no-performances">
                <Theater aria-hidden="true" />
                <p>{t("actor.no_performances")}</p>
              </div>
            )}
          </section>
        )}

        <div className="actor-back-link">
          <Link to="/team"><ArrowLeft aria-hidden="true" />{t("actor.back_to_team")}</Link>
        </div>
      </div>
    </div>
  );
}
