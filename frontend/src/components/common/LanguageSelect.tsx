import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Globe, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const languages = [
  { code: "uz", label: "Oʻzbekcha", short: "Oʻz", flag: "🇺🇿" },
  { code: "qr", label: "Qaraqalpaqsha", short: "qr", flag: "🏳️" },
  { code: "ru", label: "Русский", short: "Ru", flag: "🇷🇺" },
  { code: "en", label: "English", short: "En", flag: "🇬🇧" },
];

interface LanguageSelectProps {
  variant?: "default" | "mobile" | "dark" | "mobile-dark";
}

export default function LanguageSelect({ variant = "default" }: LanguageSelectProps) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  const handleSelect = async (code: string) => {
    setOpen(false);
    if (code === i18n.language) return;
    // Persist the choice, then reload so every page refetches its data in the
    // newly selected language (the API resolves translations server-side now).
    await i18n.changeLanguage(code);
    try { localStorage.setItem('i18nextLng', code); } catch { /* ignore */ }
    window.location.reload();
  };

  if (variant === "mobile" || variant === "mobile-dark") {
    const dark = variant === "mobile-dark";
    return (
      <div className="flex flex-wrap justify-center gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={`
              flex items-center gap-2.5 px-5 py-3 uppercase tracking-widest text-xs font-bold transition-all duration-200
              ${i18n.language === lang.code
                ? dark
                  ? "bg-[#e8c27a] text-[#32111f] border border-[#e8c27a]"
                  : "bg-primary text-white border border-primary"
                : dark
                  ? "bg-white/[0.03] text-[#f3dfbd]/75 border border-[#e8c27a]/20 hover:border-[#e8c27a]/55 hover:text-[#fff8ed]"
                  : "bg-transparent text-foreground border border-border hover:border-primary/50 hover:text-primary"
              }
            `}
          >
            <span className="text-base leading-none">{lang.flag}</span>
            {lang.short}
          </button>
        ))}
      </div>
    );
  }

  const dark = variant === "dark";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={`group flex items-center gap-2 px-3 py-2 transition-colors duration-200 focus:outline-none ${
          dark
            ? "text-[#fff8ed] hover:text-[#f1d59f]"
            : "text-foreground hover:text-primary"
        }`}
        aria-label="Select Language"
      >
        <Globe
          className={`w-4 h-4 transition-colors ${
            dark
              ? "text-[#e8c27a] group-hover:text-[#f1d59f]"
              : "text-muted-foreground group-hover:text-primary"
          }`}
        />
        <span className="text-[11px] font-bold uppercase tracking-[0.15em]">
          {currentLang.short}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-all duration-200 group-data-[popup-open]:rotate-180 ${
            dark
              ? "text-[#e8c27a] group-hover:text-[#f1d59f]"
              : "text-muted-foreground group-hover:text-primary"
          }`}
        />
      </PopoverTrigger>

      <PopoverContent
        sideOffset={12}
        align="end"
        className={`w-52 overflow-hidden rounded-xl p-1.5 shadow-[0_18px_48px_rgba(20,5,12,0.35)] ${
          dark
            ? "border border-[#e8c27a]/25 bg-[#28111d] text-[#fff8ed]"
            : "border border-border/60 bg-popover"
        }`}
      >
        <div className="py-1">
          {languages.map((lang) => {
            const isActive = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150
                  ${isActive
                    ? dark
                      ? "bg-[#e8c27a]/15 text-[#f1d59f]"
                      : "bg-primary/10 text-primary"
                    : dark
                      ? "text-[#f3dfbd]/80 hover:bg-white/[0.06] hover:text-[#fff8ed]"
                      : "text-foreground hover:bg-muted/60 hover:text-primary"
                  }
                `}
              >
                <span className="text-lg leading-none">{lang.flag}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold block">{lang.label}</span>
                  <span
                    className={`text-[10px] uppercase tracking-widest font-medium ${
                      dark ? "text-[#d3b98e]/60" : "text-muted-foreground"
                    }`}
                  >
                    {lang.short}
                  </span>
                </div>
                {isActive && (
                  <Check
                    className={`w-4 h-4 flex-shrink-0 ${
                      dark ? "text-[#e8c27a]" : "text-primary"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
