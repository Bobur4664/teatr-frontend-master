import { useTranslation } from "react-i18next";
import { Landmark } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { getPartners } from "@/lib/api";
import EmptySection from "@/components/common/EmptySection";
import { useSiteText } from "@/hooks/useSiteText";

export default function Partners() {
  const { t, i18n } = useTranslation();
  const siteText = useSiteText();
  const lang = (i18n.language?.split('-')[0] || 'uz') as 'uz' | 'ru' | 'en' | 'qr';
  const { data: partners } = useApi(() => getPartners(), []);

  // Empty partners still renders the section — see Gallery for the reasoning.
  if (!partners || partners.length === 0) {
    return (
      <section className="home-section home-section--partners home-band home-band--partners relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="home-shell home-section-heading home-section-heading--center relative z-10">
          <span className="home-eyebrow">
            {siteText('home_partners_badge', 'home.partners_badge')}
          </span>
          <h2 className="home-display-title">
            {siteText('home_partners_title', 'home.partners_title')}
          </h2>
        </div>
        <div className="home-shell relative z-10">
          <EmptySection />
        </div>
      </section>
    );
  }

  const resolve = (v: any): string =>
    v && typeof v === 'object' ? (v[lang] || v.uz || '') : (v || '');

  return (
    <section className="home-section home-section--partners home-band home-band--partners relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      <div className="home-shell home-section-heading home-section-heading--center relative z-10">
        <span className="home-eyebrow">
          {siteText('home_partners_badge', 'home.partners_badge')}
        </span>
        <h2 className="home-display-title">
          {siteText('home_partners_title', 'home.partners_title')}
        </h2>
      </div>

      <div className="relative w-full flex overflow-x-hidden pt-4 pb-12">
        {/* Decorative fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div
          className="flex whitespace-nowrap gap-8 items-center px-8"
          style={{ animation: 'marquee 30s linear infinite' }}
        >
          {/* Tripled for an ultra-smooth infinite scroll effect */}
          {[...partners, ...partners, ...partners].map((partner: any, idx: number) => {
            const name = resolve(partner.name);
            const label = resolve(partner.label) || name;
            const card = (
              <div className="flex items-center gap-6 bg-card border border-border/50 px-8 py-5 rounded-2xl shadow-sm hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 transition-all duration-500 cursor-pointer group min-w-[300px]">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground overflow-hidden group-hover:scale-110 transition-all duration-500 shadow-sm">
                  {partner.logo ? (
                    <img src={partner.logo} alt={name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Landmark className="w-7 h-7" />
                  )}
                </div>
                <div className="flex flex-col">
                  {label && (
                    <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-wide">{label}</span>
                  )}
                  {name && (
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">{name}</span>
                  )}
                </div>
              </div>
            );
            const key = `${partner.id}-${idx}`;
            return partner.url ? (
              <a key={key} href={partner.url} target="_blank" rel="noopener noreferrer">{card}</a>
            ) : (
              <div key={key}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
