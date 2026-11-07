import { lazy, Suspense } from "react";
import { MapPin, Phone, Mail, Clock, Send, Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import BackButton from "@/components/common/BackButton";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { tr } from "@/lib/tr";
import { useSiteText } from "@/hooks/useSiteText";

// Leaflet faqat brauzerda ishlaydi — lazy load qilamiz
const Map = lazy(() => import("@/components/Map"));

export default function Contact() {
  const { t } = useTranslation();
  const siteText = useSiteText();
  const { settings } = useSiteSettings();

  const address = tr(settings?.address) || t("contact.address_desc");
  const phone = settings?.phone || "";
  const email = settings?.email || "";
  const workHours = tr(settings?.work_hours) || t("contact.work_hours_desc");

  const contactCards = [
    {
      icon: MapPin,
      label: t("contact.address"),
      value: address,
      href: null as string | null,
    },
    {
      icon: Phone,
      label: t("contact.phone"),
      value: phone || "—",
      href: phone ? `tel:${phone.replace(/\s+/g, "")}` : null,
    },
    {
      icon: Mail,
      label: "Email",
      value: email || "—",
      href: email ? `mailto:${email}` : null,
    },
    {
      icon: Clock,
      label: t("contact.work_hours"),
      value: workHours,
      href: null as string | null,
    },
  ];

  return (
    <div className="relative isolate overflow-hidden pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_75%_0%,hsl(var(--primary)/0.14),transparent_58%)]" />

      <div className="container mx-auto px-4 pt-8 md:pt-12">
        <BackButton />
      </div>

      <section className="container mx-auto px-4 pb-10 pt-10 md:pb-16 md:pt-16">
        <div className="grid items-end gap-8 border-b border-border/70 pb-10 md:grid-cols-[1fr_auto] md:pb-14">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {siteText("contact_badge", "contact.badge")}
            </div>
            <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-7xl">
              {siteText("contact_title", "contact.title")}
              <span className="text-primary">.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              {siteText("contact_subtitle", "contact.subtitle")}
            </p>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/70 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <MapPin className="h-4 w-4 text-primary" />
            {t("contact.address")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {contactCards.map((card, i) => {
            const Icon = card.icon;
            const content = (
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 pt-0.5">
                  <h2 className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {card.label}
                  </h2>
                  <p className="break-words text-sm font-semibold leading-6 text-foreground">
                    {card.value}
                  </p>
                </div>
              </div>
            );
            const base =
              "group rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5";

            return card.href ? (
              <a key={i} href={card.href} className={base}>
                {content}
              </a>
            ) : (
              <div key={i} className={base}>
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
              {t("contact.address")}
            </p>
            <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              {address}
            </h2>
          </div>
          <span className="hidden items-center gap-2 text-xs font-medium text-muted-foreground sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.7)]" />
            OpenStreetMap
          </span>
        </div>
        <div className="group relative h-[360px] overflow-hidden rounded-[1.75rem] border border-border/70 bg-muted shadow-2xl shadow-primary/10 sm:h-[440px]">
          <Suspense
            fallback={
              <div className="flex h-full w-full animate-pulse items-center justify-center bg-muted">
                <div className="rounded-2xl border border-border bg-card/90 px-5 py-3 text-sm font-medium text-muted-foreground shadow-lg">
                  {t("contact.address")}…
                </div>
              </div>
            }
          >
            <Map address={address} />
          </Suspense>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <div className="grid overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/70 shadow-2xl shadow-primary/5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative flex min-h-64 flex-col justify-between overflow-hidden bg-primary p-7 text-primary-foreground md:p-10">
            <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full border border-white/15" />
            <div className="pointer-events-none absolute -bottom-12 -right-8 h-48 w-48 rounded-full border border-white/15" />
            <div className="relative">
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                <Send className="h-5 w-5" />
              </div>
              <h2 className="max-w-sm font-serif text-3xl font-bold leading-tight md:text-4xl">
                {t("contact.send_message")}
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/75">
                {siteText("contact_form_desc", "contact.subtitle")}
              </p>
            </div>
            <div className="relative mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground/65">
              {siteText("contact_badge", "contact.badge")}
            </div>
          </div>
          <div className="p-6 md:p-10">

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    {t("contact.name")}
                  </Label>
                  <Input
                    id="name"
                    placeholder={t("contact.name_placeholder")}
                    className="h-12 rounded-xl border-border/70 bg-background/60 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("contact.email_placeholder")}
                    className="h-12 rounded-xl border-border/70 bg-background/60 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="subject"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
                >
                  {t("contact.subject")}
                </Label>
                <Input
                  id="subject"
                  placeholder={t("contact.subject_placeholder")}
                  className="h-12 rounded-xl border-border/70 bg-background/60 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
                >
                  {t("contact.message")}
                </Label>
                <Textarea
                  id="message"
                  placeholder={t("contact.message_placeholder")}
                  className="min-h-[160px] resize-none rounded-xl border-border/70 bg-background/60 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Button className="group h-14 w-full rounded-xl bg-primary text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30">
                <Send className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                {t("common.send")}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}