import { useEffect, useMemo, useRef, useState } from "react";
import { getTeamMembers } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import ActorCard from "@/components/team/ActorCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import BackButton from "@/components/common/BackButton";
import { Loader2, Sparkles, Users } from "lucide-react";
import { useSiteText } from "@/hooks/useSiteText";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type TeamCategory = "rahbariyat" | "sahna_ijodkorlari" | "aktyorlar" | "xodimlar";

const categories: { value: TeamCategory; label: string }[] = [
  { value: "rahbariyat", label: "team_page.tab_rahbariyat" },
  { value: "sahna_ijodkorlari", label: "team_page.tab_sahna_ijodkorlari" },
  { value: "aktyorlar", label: "team_page.tab_aktyorlar" },
  { value: "xodimlar", label: "team_page.tab_xodimlar" },
];

export default function Team() {
  const { t } = useTranslation();
  const siteText = useSiteText();
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<TeamCategory>("rahbariyat");

  const { data: rahbariyat, loading: rLoading } = useApi(() => getTeamMembers("rahbariyat"), []);
  const { data: sahnaIjodkorlari, loading: sLoading } = useApi(() => getTeamMembers("sahna_ijodkorlari"), []);
  const { data: aktyorlar, loading: aLoading } = useApi(() => getTeamMembers("aktyorlar"), []);
  const { data: xodimlar, loading: xLoading } = useApi(() => getTeamMembers("xodimlar"), []);

  const loading = rLoading || sLoading || aLoading || xLoading;
  const membersByCategory = useMemo<Record<TeamCategory, any[]>>(
    () => ({
      rahbariyat,
      sahna_ijodkorlari: sahnaIjodkorlari,
      aktyorlar,
      xodimlar,
    }),
    [rahbariyat, sahnaIjodkorlari, aktyorlar, xodimlar],
  );
  const totalMembers = rahbariyat.length + sahnaIjodkorlari.length + aktyorlar.length + xodimlar.length;

  useEffect(() => {
    const root = pageRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(
        ".team-hero-reveal",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" },
      );

      root.querySelectorAll<HTMLElement>(".team-member-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 38, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.72,
            delay: (index % 4) * 0.07,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: card, start: "top 92%", once: true },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, [activeCategory, loading, totalMembers]);

  const renderMembers = (members: any[]) => (
    members.length ? (
      <div className="team-member-grid">
        {members.map((person) => <ActorCard key={person.id} actor={person} />)}
      </div>
    ) : (
      <div className="team-empty-state">
        <Users aria-hidden="true" />
        <p>{t("team_page.empty")}</p>
      </div>
    )
  );

  return (
    <div ref={pageRef} className="team-page">
      <div className="container mx-auto px-4 pt-8 md:pt-12">
        <BackButton className="mb-0" />
      </div>

      <Tabs
        value={activeCategory}
        onValueChange={(value) => {
          if (value === "rahbariyat" || value === "sahna_ijodkorlari" || value === "aktyorlar" || value === "xodimlar") {
            setActiveCategory(value);
          }
        }}
        className="team-tabs"
      >
        <section className="team-hero">
          <div className="container mx-auto px-4">
            <div className="team-hero-layout">
              <div className="team-hero-copy">
                <span className="team-eyebrow team-hero-reveal">
                  <Sparkles aria-hidden="true" />
                  {siteText("team_badge", "team_page.badge")}
                </span>
                <h1 className="team-title team-hero-reveal">
                  {siteText("team_title", "team_page.title")}
                  <span>.</span>
                </h1>
                <p className="team-subtitle team-hero-reveal">
                  {siteText("team_subtitle", "team_page.subtitle")}
                </p>
              </div>
              <div className="team-total-card team-hero-reveal">
                <span className="team-total-icon"><Users aria-hidden="true" /></span>
                <strong>{loading ? "—" : totalMembers.toString().padStart(2, "0")}</strong>
                <span>{t("team_page.badge")}</span>
              </div>
            </div>

            <div className="team-tab-wrap">
              <TabsList className="team-tab-list">
                {categories.map((category, index) => (
                  <TabsTrigger key={category.value} value={category.value} className="team-tab-trigger">
                    <span className="team-tab-index">0{index + 1}</span>
                    <span>{t(category.label)}</span>
                    <span className="team-tab-count">{membersByCategory[category.value].length}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20 pt-10 md:pb-28 md:pt-14">
          <div className="team-section-heading">
            <div>
              <span className="team-section-kicker">{siteText("team_badge", "team_page.badge")}</span>
              <h2>{t(categories.find((category) => category.value === activeCategory)?.label ?? "team_page.tab_rahbariyat")}</h2>
            </div>
            <span className="team-section-count">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : membersByCategory[activeCategory].length.toString().padStart(2, "0")}
            </span>
          </div>

          {loading ? (
            <div className="team-loading" role="status" aria-label={t("common.loading")}>
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {categories.map((category) => (
                <TabsContent key={category.value} value={category.value} className="team-tab-panel">
                  {renderMembers(membersByCategory[category.value])}
                </TabsContent>
              ))}
            </>
          )}
        </section>
      </Tabs>
    </div>
  );
}
