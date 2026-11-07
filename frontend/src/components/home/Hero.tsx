import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Facebook,
  Instagram,
  Loader2,
  Play,
  SendHorizontal,
  Sparkles,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getPerformances } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useTranslation } from "react-i18next";
import { tr } from "@/lib/tr";

export default function Hero() {
  const { t, i18n } = useTranslation();
  const { data: performances, loading } = useApi(() => getPerformances("active"), []);
  const { settings } = useSiteSettings();
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);

  const heroSocials = [
    { icon: Instagram, url: settings?.instagram_url, label: "Instagram" },
    { icon: Facebook, url: settings?.facebook_url, label: "Facebook" },
    { icon: Youtube, url: settings?.youtube_url, label: "YouTube" },
    { icon: SendHorizontal, url: settings?.telegram_url, label: "Telegram" },
  ].filter((social) => !!social.url);

  const scrollCue = (
    <motion.button
      type="button"
      onClick={() =>
        document.getElementById("home-content")?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
        })
      }
      aria-label={t("common.scroll_down", "Pastga aylantiring")}
      title={t("common.scroll_down", "Pastga aylantiring")}
      className="hero-scroll-cue"
    >
      <motion.span
        animate={reduceMotion ? undefined : { y: [0, 7, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="hero-scroll-cue__icon"
      >
        <ArrowDown />
      </motion.span>
    </motion.button>
  );

  useEffect(() => {
    if (performances.length < 2) return;
    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % performances.length);
    }, 8500);
    return () => window.clearInterval(timer);
  }, [performances.length, current]);

  if (performances.length === 0) {
    const name = tr(settings?.site_name) || tr(settings?.site_name_line2) || "";
    return (
      <section className="hero-section relative isolate flex items-center overflow-hidden bg-[#050505] py-20 text-[#ffffff]">
        <div className="pointer-events-none absolute -right-32 top-0 h-[34rem] w-[34rem] rounded-full border border-[#ed1c24]/10" />
        <div className="pointer-events-none absolute -right-20 top-12 h-[28rem] w-[28rem] rounded-full border border-[#ed1c24]/10" />
        <div className="container relative mx-auto px-6">
          <p className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ed1c24]">
            <Sparkles className="h-4 w-4" />
            {t("hero.premiere")}
          </p>
          <h1 className="max-w-4xl text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {name}
          </h1>
          <p className="mt-7 max-w-lg text-sm leading-7 text-[#f2f2f2]/65">
            {loading ? t("common.loading") : t("common.section_empty")}
          </p>
          {loading && (
            <div className="hero-loading" role="status" aria-live="polite">
              <span className="hero-loading__mark"><Loader2 /></span>
              <span className="hero-loading__track"><span /></span>
              <span className="hero-loading__label">{t("common.loading")}</span>
            </div>
          )}
        </div>
        {scrollCue}
      </section>
    );
  }

  const safeIndex = current % performances.length;
  const performance = performances[safeIndex];
  const title = tr(performance?.title);
  const genre = tr(performance?.genre);
  const description = tr(performance?.description);
  const image = performance?.image;
  const showDate = performance?.next_show
    ? new Date(performance.next_show)
    : null;
  const hasValidShowDate = showDate && !Number.isNaN(showDate.getTime());
  const localeByLanguage: Record<string, string> = {
    uz: "uz-UZ",
    qr: "uz-UZ",
    ru: "ru-RU",
    en: "en-US",
  };
  const locale = localeByLanguage[i18n.language.split("-")[0]] || "uz-UZ";
  const formattedDate = hasValidShowDate
    ? new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(showDate)
    : "";
  const minutesUntilShow = hasValidShowDate
    ? (showDate.getTime() - Date.now()) / 60000
    : Number.NaN;
  const isLive =
    minutesUntilShow <= 0 &&
    minutesUntilShow >= -150 &&
    Boolean(performance?.live_url);

  const next = () => setCurrent((index) => (index + 1) % performances.length);
  const previous = () =>
    setCurrent((index) => (index - 1 + performances.length) % performances.length);

  return (
    <section
      className="hero-section relative isolate overflow-hidden bg-[#050505] text-[#ffffff]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_35%,rgba(237,28,36,0.18),transparent_42%),radial-gradient(ellipse_at_78%_48%,rgba(237,28,36,0.09),transparent_38%),linear-gradient(125deg,#050505_0%,#111111_50%,#050505_100%)]" />
      <div className="pointer-events-none absolute -left-48 top-20 h-[36rem] w-[36rem] rounded-full border border-[#ed1c24]/[0.07]" />
      <div className="pointer-events-none absolute -left-32 top-36 h-[28rem] w-[28rem] rounded-full border border-[#ed1c24]/[0.06]" />
      <div className="pointer-events-none absolute right-[39%] top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-[#ed1c24]/15 to-transparent lg:block" />

      <div className="container relative mx-auto grid min-h-[min(880px,calc(100svh-5rem))] grid-cols-1 items-center gap-9 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10 lg:px-6 lg:py-12">
        <div className="relative z-10 order-2 flex flex-col lg:order-1">
          <motion.div
            key={`copy-${safeIndex}`}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: "easeOut" }}
          >
            <div className="mb-7 flex flex-wrap items-center gap-3">
              <span className="hero-premiere-badge inline-flex items-center gap-2 rounded-full border border-[#ed1c24]/35 bg-[#ed1c24]/[0.08] px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                <Sparkles className="h-3.5 w-3.5" />
                {isLive
                  ? t("hero.live_now", "LIVE NOW")
                  : t("hero.premiere")}
              </span>
              {performance?.age_limit && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#ffffff]/50">
                  {genre && `${genre}  ·  `}{performance.age_limit}
                </span>
              )}
            </div>

            <h1 className="max-w-[13ch] text-[clamp(2.6rem,6.1vw,5.9rem)] font-bold uppercase leading-[0.96] tracking-[-0.055em] text-[#ffffff]">
              {title}
            </h1>

            {description && (
              <p className="mt-6 line-clamp-3 max-w-lg text-sm leading-7 text-[#f2f2f2]/65 sm:text-base">
                {description}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              {formattedDate && (
                <span className="inline-flex items-center gap-2.5 text-xs font-medium text-[#f2f2f2]/75">
                  <CalendarDays className="h-4 w-4 text-[#ed1c24]" />
                  {formattedDate}
                </span>
              )}
              {performance?.age_limit && (
                <span className="rounded-full border border-[#ffffff]/15 px-3 py-1 text-[10px] font-semibold tracking-wider text-[#ffffff]/60">
                  {performance.age_limit}
                </span>
              )}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              {isLive ? (
                <a
                  href={performance.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-3 rounded-full bg-[#ed1c24] px-6 text-[10px] font-bold uppercase tracking-[0.13em] text-[#080808] transition-all hover:-translate-y-0.5 hover:bg-[#ff555d]"
                >
                  <Play className="h-4 w-4 fill-current" />
                  {t("hero.watch_live", "Jonli ko'rish")}
                </a>
              ) : (
                <Link
                  to={`/performance/${performance?.id}`}
                  className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#ed1c24] px-6 text-[10px] font-bold uppercase tracking-[0.13em] text-[#080808] shadow-[0_8px_28px_rgba(237,28,36,0.15)] transition-all hover:-translate-y-0.5 hover:bg-[#ff555d]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#080808]/10">
                    <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                  </span>
                  {t("hero.more_info", "Batafsil ma'lumot")}
                </Link>
              )}
            </div>
          </motion.div>

          <div className="mt-10 border-t border-[#ffffff]/12 pt-5 sm:mt-12">
            <div className="flex items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold tracking-wider text-[#ed1c24]">
                  {String(safeIndex + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-8 bg-[#ed1c24]/50" />
                <span className="font-mono text-xs tracking-wider text-[#ffffff]/40">
                  {String(performances.length).padStart(2, "0")}
                </span>
                <span className="ml-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#ffffff]/40">
                  {t("nav.repertoire")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={previous}
                  aria-label={t("hero.previous_slide", "Previous performance")}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ffffff]/20 text-[#ffffff]/75 transition-colors hover:border-[#ed1c24]/60  hover:text-[#ff555d]"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label={t("hero.next_slide", "Next performance")}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ffffff]/20 text-[#ffffff]/75 transition-colors hover:border-[#ed1c24]/60  hover:text-[#ff555d]"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div
              className="mt-4 flex gap-1.5"
              role="group"
              aria-label={t("nav.repertoire")}
            >
              {performances.map((item, index) => (
                <button
                  key={item.id ?? index}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`${t("nav.repertoire")}: ${tr(item.title)}`}
                  aria-current={index === safeIndex ? "true" : undefined}
                  className="group h-2 flex-1 overflow-hidden rounded-full bg-[#ffffff]/15"
                >
                  <motion.span
                    key={`${safeIndex}-${index}`}
                    className="block h-full rounded-full bg-[#ed1c24]"
                    initial={false}
                    animate={{ width: index === safeIndex ? "100%" : "0%" }}
                    transition={{
                      duration: index === safeIndex && !reduceMotion ? 8.5 : 0.35,
                      ease: "linear",
                    }}
                  />
                </button>
              ))}
            </div>
            {heroSocials.length > 0 && (
              <div className="mt-5 flex items-center gap-2">
                {heroSocials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#ffffff]/15 text-[#f2f2f2]/65 transition-colors hover:border-[#ed1c24]/55 hover:text-[#ff555d]"
                  >
                    <social.icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative order-1 mx-auto w-full max-w-[560px] lg:order-2">
          <div className="absolute -inset-4 rotate-[3deg] rounded-[2rem] border border-[#ed1c24]/20 sm:-inset-5" />
          <div className="absolute -inset-2 -rotate-[2deg] rounded-[1.7rem] border border-[#ed1c24]/10" />

          <div className="relative aspect-[1.18] overflow-hidden rounded-[1.5rem] border border-[#ed1c24]/35 bg-[#111111] shadow-[0_30px_90px_rgba(0,0,0,0.42)] sm:aspect-[1.22] lg:aspect-[0.92]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`art-${safeIndex}`}
                initial={{
                  opacity: 0,
                  scale: reduceMotion ? 1 : 1.06,
                  x: reduceMotion ? 0 : 16,
                }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  scale: reduceMotion ? 1 : 0.98,
                  x: reduceMotion ? 0 : -12,
                }}
                transition={{ duration: reduceMotion ? 0 : 0.7, ease: "easeOut" }}
                className="absolute inset-0"
              >
                {image ? (
                  <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-full w-full bg-[radial-gradient(ellipse_at_60%_30%,rgba(237,28,36,0.42),transparent_35%),linear-gradient(145deg,#99121b,#111111_70%)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/15 to-[#050505]/5" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/20 via-transparent to-[#ed1c24]/[0.06]" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-[#050505]/65 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md sm:left-6 sm:top-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ed1c24] shadow-[0_0_10px_#ed1c24]" />
              {t("hero.premiere")}
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 sm:p-7">
              <div className="min-w-0">
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.23em] text-[#ed1c24]">
                  {t("nav.repertoire")}
                </p>
                <p className="max-w-[15ch] text-2xl font-bold uppercase leading-[1.02] tracking-tight text-white sm:text-3xl">
                  {title}
                </p>
                {formattedDate && (
                  <p className="mt-3 flex items-center gap-2 text-[10px] font-medium text-white/65">
                    <CalendarDays className="h-3.5 w-3.5 text-[#ed1c24]" />
                    {formattedDate}
                  </p>
                )}
              </div>
              <span className="shrink-0 font-mono text-[10px] tracking-[0.18em] text-white/55">
                {String(safeIndex + 1).padStart(2, "0")} /{" "}
                {String(performances.length).padStart(2, "0")}
              </span>
            </div>

            <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-2 sm:flex">
              <span className="h-8 w-px bg-gradient-to-b from-transparent via-[#ed1c24]/80 to-transparent" />
              <span className="[writing-mode:vertical-rl] text-[8px] font-semibold uppercase tracking-[0.3em] text-white/60">
                {tr(settings?.site_name_line1) || t("nav.repertoire")}
              </span>
              <span className="h-8 w-px bg-gradient-to-b from-transparent via-[#ed1c24]/80 to-transparent" />
            </div>
          </div>

          <div className="absolute -bottom-5 right-5 hidden items-center gap-3 rounded-2xl border border-[#ed1c24]/25 bg-[#111111]/90 px-4 py-3 shadow-[0_15px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:flex lg:-left-10 lg:right-auto">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ed1c24]/12 text-[#ed1c24]">
              <CalendarDays className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-[8px] font-semibold uppercase tracking-[0.18em] text-[#f2f2f2]/55">
                {t("nav.repertoire")}
              </span>
              <span className="mt-1 block text-xs font-semibold text-[#ffffff]">
                {formattedDate || t("nav.repertoire")}
              </span>
            </span>
          </div>
        </div>
      </div>
      {scrollCue}
    </section>
  );
}
