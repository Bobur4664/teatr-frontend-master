import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Ticket,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTheme } from "@/context/ThemeContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useTranslation } from "react-i18next";
import { tr } from "@/lib/tr";
import SearchOverlay from "./SearchOverlay";
import LanguageSelect from "../common/LanguageSelect";

const navItems = [
  { name: "nav.home", path: "/" },
  { name: "nav.repertoire", path: "/repertoire" },
  { name: "nav.news", path: "/news" },
  { name: "nav.about", path: "/about" },
  { name: "nav.team", path: "/team" },
  { name: "nav.archive", path: "/archive" },
  { name: "nav.contact", path: "/contact" },
];

const extraNavItems = [
  { name: "reels.title", path: "/reels" },
  { name: "tour.badge", path: "/gallery" },
  { name: "footer.link_rules", path: "/rules" },
  { name: "footer.link_jobs", path: "/vacancies" },
  { name: "footer.link_press", path: "/press" },
  { name: "footer.link_data", path: "/open-data" },
];

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { setTheme, theme, setFontSize, fontSize } = useTheme();
  const { settings } = useSiteSettings();
  const reduceMotion = useReducedMotion();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const brandLine1 = tr(settings?.site_name_line1);
  const brandLine2 = tr(settings?.site_name_line2);
  const siteName = tr(settings?.site_name) || brandLine2 || "";
  const address = tr(settings?.address);
  const workHours = tr(settings?.work_hours);
  const phone = settings?.phone || "";
  const email = settings?.email || "";
  const phoneHref = phone.replace(/[^\d+]/g, "");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 14);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(`${path}/`));

  const scrollIfSamePath = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-[#ed1c24]/20 bg-[#050505] text-[#ffffff] transition-shadow duration-300 ${
          isScrolled ? "shadow-[0_12px_42px_rgba(27,8,17,0.28)]" : ""
        }`}
      >
        <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_-90%,rgba(237,28,36,0.2),transparent_65%),linear-gradient(110deg,#080808_0%,#050505_52%,#080808_100%)]">
          <div className="pointer-events-none absolute -right-28 -top-32 h-64 w-64 rounded-full border border-[#ed1c24]/10" />
          <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full border border-[#ed1c24]/10" />

          <div className="hidden border-b border-[#ed1c24]/15 bg-[#0a0a0a]/45 md:block">
            <div className="container mx-auto flex h-8 items-center justify-between gap-5 px-4 text-[10px] tracking-wide text-[#f2f2f2]/75">
              <div className="flex min-w-0 items-center gap-5">
                {address && (
                  <span className="flex min-w-0 items-center gap-2">
                    <MapPin className="h-3 w-3 shrink-0 text-[#ed1c24]" />
                    <span className="truncate">{address}</span>
                  </span>
                )}
                {workHours && (
                  <span className="flex shrink-0 items-center gap-2">
                    <Clock3 className="h-3 w-3 text-[#ed1c24]" />
                    {workHours}
                  </span>
                )}
              </div>
              <span className="max-w-[40%] truncate text-right uppercase tracking-[0.16em] text-[#ed1c24]">
                {siteName || t("nav.home")}
              </span>
            </div>
          </div>

          <div className="container relative mx-auto flex min-h-[72px] items-center justify-between gap-3 px-4 py-2.5 lg:min-h-[84px]">
            <Link
              to="/"
              onClick={() => scrollIfSamePath("/")}
              aria-label={siteName || brandLine2}
              className="group flex min-w-0 items-center gap-3"
            >
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ed1c24]/70 bg-[#eeeeee] p-1 shadow-[0_0_0_4px_rgba(237,28,36,0.09)] transition-transform duration-300 group-hover:rotate-[-5deg] sm:h-[50px] sm:w-[50px]">
                {settings?.logo ? (
                  <img
                    src={settings.logo}
                    alt=""
                    className="h-full w-full rounded-full object-contain"
                  />
                ) : (
                  <span className="font-serif text-lg font-bold text-[#080808]">
                    {brandLine1.slice(0, 1) || "T"}
                  </span>
                )}
              </span>
              <span className="min-w-0 leading-none">
                <span className="block truncate text-[8px] font-semibold uppercase tracking-[0.19em] text-[#ed1c24] sm:text-[9px]">
                  {brandLine1}
                </span>
                <span className="mt-1.5 block max-w-[190px] text-[12px] font-bold uppercase leading-tight tracking-[0.025em] text-[#ffffff] transition-colors group-hover:text-[#ff555d] sm:max-w-[245px] sm:text-[14px] lg:max-w-[270px]">
                  {brandLine2 || siteName}
                </span>
              </span>
            </Link>

            <nav
              aria-label={t("common.menu", "Main navigation")}
              className="hidden items-center gap-0.5 xl:flex"
            >
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => scrollIfSamePath(item.path)}
                    aria-current={active ? "page" : undefined}
                    className={`relative whitespace-nowrap px-2.5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors 2xl:px-3 ${
                      active
                        ? "text-[#ff555d]"
                        : "text-[#ffffff]/70 hover:text-[#ffffff]"
                    }`}
                  >
                    {t(item.name)}
                    {active && (
                      <motion.span
                        layoutId="theatre-nav-marker"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                          duration: reduceMotion ? 0 : undefined,
                        }}
                        className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-[#ed1c24] shadow-[0_0_12px_rgba(237,28,36,0.8)]"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <Link
                to="/repertoire"
                onClick={() => scrollIfSamePath("/repertoire")}
                className="hidden h-10 items-center gap-2 rounded-full bg-[#ed1c24] px-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#080808] shadow-[0_4px_20px_rgba(237,28,36,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#ff555d] sm:inline-flex"
              >
                <Ticket className="h-4 w-4" />
                <span>{t("nav.repertoire")}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>

              <div className="hidden rounded-full border border-[#ed1c24]/25 bg-white/5 px-1 md:block">
                <LanguageSelect variant="dark" />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                aria-label={t("search.title", "Search")}
                className="h-10 w-10 rounded-full border border-[#ed1c24]/25 bg-white/5 text-[#f4dfb8] hover:border-[#ed1c24]/60 hover:bg-[#ed1c24]/10 hover:text-white"
              >
                <Search className="h-[17px] w-[17px]" />
              </Button>

              <Sheet>
                <SheetTrigger
                  aria-label={t("accessibility.title")}
                  className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#ed1c24]/25 bg-white/5 text-[#f4dfb8] transition-colors hover:border-[#ed1c24]/60 hover:bg-[#ed1c24]/10 hover:text-white sm:flex"
                >
                  <span className="text-sm font-bold">A</span>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="border-[#ed1c24]/20 bg-[#050505] p-6 text-[#ffffff]"
                >
                  <div className="space-y-8 py-8">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ed1c24]">
                        {t("accessibility.title")}
                      </p>
                      <h2 className="mt-3 text-2xl font-bold text-[#ffffff]">
                        {t("accessibility.title")}
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#f2f2f2]/65">
                        {t("accessibility.theme")}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={theme === "light" ? "default" : "outline"}
                          onClick={() => setTheme("light")}
                          className="text-xs"
                        >
                          {t("accessibility.light")}
                        </Button>
                        <Button
                          variant={theme === "dark" ? "default" : "outline"}
                          onClick={() => setTheme("dark")}
                          className="text-xs"
                        >
                          {t("accessibility.dark")}
                        </Button>
                        <Button
                          variant={theme === "high-contrast" ? "default" : "outline"}
                          onClick={() => setTheme("high-contrast")}
                          className="text-xs"
                        >
                          {t("accessibility.contrast")}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#f2f2f2]/65">
                        {t("accessibility.font_size")}
                      </p>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                        >
                          A-
                        </Button>
                        <span className="text-lg font-bold">{fontSize}px</span>
                        <Button
                          variant="outline"
                          onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                        >
                          A+
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger
                  aria-label={
                    isMobileMenuOpen
                      ? t("common.close", "Close menu")
                      : t("common.menu", "Open menu")
                  }
                  aria-expanded={isMobileMenuOpen}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ed1c24]/65 bg-[#ed1c24] text-[#080808] shadow-[0_4px_18px_rgba(237,28,36,0.18)] transition-transform hover:scale-105 hover:bg-[#ff555d] xl:hidden"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={isMobileMenuOpen ? "close" : "menu"}
                      initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
                      transition={{ duration: reduceMotion ? 0 : 0.18 }}
                      className="flex"
                    >
                      {isMobileMenuOpen ? (
                        <X className="h-5 w-5" />
                      ) : (
                        <Menu className="h-5 w-5" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  showCloseButton={false}
                  overlayClassName="bg-[#12070d]/75 supports-backdrop-filter:backdrop-blur-sm"
                  style={{ width: "min(100vw, 480px)", maxWidth: "100vw" }}
                  className="overflow-y-auto border-l border-[#ed1c24]/20 bg-[#050505] p-0 text-[#ffffff]"
                >
                  <div className="relative flex min-h-full flex-col overflow-hidden bg-[radial-gradient(ellipse_at_100%_0%,rgba(237,28,36,0.16),transparent_42%),linear-gradient(160deg,#080808_0%,#050505_55%,#0a0a0a_100%)]">
                    <SheetTitle className="sr-only">
                      {t("common.menu", "Main navigation")}
                    </SheetTitle>
                    <div className="flex items-center justify-between border-b border-[#ed1c24]/20 px-6 py-5">
                      <div className="flex min-w-0 items-center gap-3">
                        {settings?.logo && (
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ed1c24]/70 bg-[#eeeeee] p-1">
                            <img
                              src={settings.logo}
                              alt=""
                              className="h-full w-full rounded-full object-contain"
                            />
                          </span>
                        )}
                        <div className="min-w-0">
                          <span className="block truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-[#ed1c24]">
                            {brandLine1}
                          </span>
                          <span className="mt-1 block truncate text-sm font-bold uppercase text-[#ffffff]">
                            {brandLine2 || siteName}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label={t("common.close", "Close menu")}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ed1c24]/35 text-[#f4dfb8] transition-colors hover:bg-[#ed1c24]/10 hover:text-white"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <nav
                      aria-label={t("common.menu", "Main navigation")}
                      className="flex-1 px-5 py-7"
                    >
                      <p className="mb-4 px-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#ed1c24]/75">
                        {t("nav.home")}
                      </p>
                      <div className="space-y-1">
                        {navItems.map((item, index) => {
                          const active = isActive(item.path);
                          return (
                            <motion.div
                              key={item.path}
                              initial={{ opacity: 0, x: reduceMotion ? 0 : 22 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: reduceMotion ? 0 : 0.24,
                                delay: reduceMotion ? 0 : index * 0.045,
                              }}
                            >
                              <Link
                                to={item.path}
                                onClick={() => scrollIfSamePath(item.path)}
                                aria-current={active ? "page" : undefined}
                                className={`group flex items-center justify-between border-b border-[#ffffff]/10 px-2 py-3.5 transition-colors ${
                                  active
                                    ? "text-[#ff555d]"
                                    : "text-[#ffffff]/80 hover:text-white"
                                }`}
                              >
                                <span className="flex items-center gap-4">
                                  <span className="w-6 font-mono text-[10px] text-[#ed1c24]/70">
                                    {String(index + 1).padStart(2, "0")}
                                  </span>
                                  <span className="text-[17px] font-semibold tracking-wide">
                                    {t(item.name)}
                                  </span>
                                </span>
                                <ArrowUpRight className="h-4 w-4 text-[#ed1c24] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-2">
                        {extraNavItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => scrollIfSamePath(item.path)}
                            className="rounded-lg border border-[#ed1c24]/15 bg-white/[0.03] px-3 py-3 text-xs font-medium text-[#f2f2f2]/75 transition-colors hover:border-[#ed1c24]/45 hover:bg-[#ed1c24]/10 hover:text-[#ffffff]"
                          >
                            {t(item.name)}
                          </Link>
                        ))}
                      </div>

                      <div className="mt-7 inline-flex rounded-full border border-[#ed1c24]/25 bg-white/[0.04] px-2 text-[#ffffff] [&_button]:text-[#ffffff] [&_button_svg]:text-[#ed1c24]">
                        <LanguageSelect variant="mobile-dark" />
                      </div>
                    </nav>

                    {(phone || address || email) && (
                      <div className="space-y-4 border-t border-[#ed1c24]/20 bg-black/15 px-6 py-5">
                        {phone && (
                          <a
                            href={`tel:${phoneHref}`}
                            className="flex items-center gap-3 text-sm font-semibold text-[#ffffff] transition-colors hover:text-[#ff555d]"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ed1c24]/30 bg-[#ed1c24]/10 text-[#ed1c24]">
                              <Phone className="h-4 w-4" />
                            </span>
                            {phone}
                          </a>
                        )}
                        {address && (
                          <p className="flex items-start gap-3 text-xs leading-relaxed text-[#f2f2f2]/65">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#ed1c24]" />
                            {address}
                          </p>
                        )}
                        {email && (
                          <a
                            href={`mailto:${email}`}
                            className="flex items-center gap-3 text-xs text-[#f2f2f2]/65 transition-colors hover:text-[#ff555d]"
                          >
                            <Mail className="h-4 w-4 text-[#ed1c24]" />
                            {email}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
