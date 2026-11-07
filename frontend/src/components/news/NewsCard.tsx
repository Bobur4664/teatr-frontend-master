import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { tr } from "@/lib/tr";

// Browsers ship no Uzbek month names (Intl gives "M04"), so uz and qr use these.
const UZ_MONTHS = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"];

/** A news item in the gov.uz style: the photo, with a white box overlapping
 *  its bottom edge that carries the big day number, the month, the title,
 *  and a date / category line. */
interface NewsCardProps {
  item: any;
  variant?: "default" | "home" | "archive";
  key?: string | number;
}

export default function NewsCard({ item, variant = "default" }: NewsCardProps) {
  const { t, i18n } = useTranslation();
  const isHome = variant === "home";
  const isArchive = variant === "archive";
  const date = new Date(item.date);
  const valid = !Number.isNaN(date.getTime());
  const lang = (i18n.language || "uz").split("-")[0];
  const month = !valid
    ? ""
    : lang === "uz" || lang === "qr"
      ? UZ_MONTHS[date.getMonth()]
      : date.toLocaleDateString(lang, { month: "short" }).replace(".", "");

  return (
    <Link
      to={`/news/${item.id}`}
      className={`group block h-full ${isArchive ? "news-card" : ""}`}
    >
      <div className={`relative aspect-video overflow-hidden bg-muted ${
        isHome ? "home-news-card-image" : isArchive ? "news-card-image" : ""
      }`}>
        {item.image ? (
          <img
            src={item.image}
            alt={tr(item.title)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="news-card-image-fallback" aria-hidden="true" />
        )}
        {item.is_important && (
          <span className={`absolute left-4 top-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1 ${
            isHome
              ? "home-news-important rounded-full border border-[#ed1c24]/35 bg-[#080808]/90 text-[#ff555d]"
              : isArchive
                ? "news-card-important"
                : "bg-primary text-primary-foreground"
          }`}>
            {t("news.important")}
          </span>
        )}
      </div>
      <div className={`relative -mt-14 mx-4 md:mx-5 flex gap-4 border p-5 transition-colors group-hover:border-primary ${
        isHome
          ? "home-news-card-content border-[hsl(var(--theatre-line))] bg-[hsl(var(--theatre-card))] shadow-[0_14px_36px_hsl(var(--theatre-shadow)/0.09)] group-hover:border-[hsl(var(--theatre-gold)/0.6)]"
          : isArchive
            ? "news-card-content"
          : "border-border bg-card"
      }`}>
        {valid && (
          <div className={`w-12 shrink-0 text-center ${isHome ? "home-news-date" : ""}`}>
            <div className={`text-3xl font-bold leading-none text-primary ${isArchive ? "news-card-day" : ""}`}>{date.getDate()}</div>
            <div className={`mt-1 text-[11px] font-bold uppercase text-foreground ${isArchive ? "news-card-month" : ""}`}>{month}</div>
          </div>
        )}
        <div className={`min-w-0 flex-1 ${isArchive ? "news-card-copy" : "space-y-3"}`}>
          <h3 className={`font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors ${isHome ? "home-news-title" : isArchive ? "news-card-title" : ""}`}>
            {tr(item.title)}
          </h3>
          {!!tr(item.summary) && (
            <p className={`text-sm leading-relaxed text-muted-foreground line-clamp-2 ${isHome ? "home-news-summary" : isArchive ? "news-card-summary" : ""}`}>{tr(item.summary)}</p>
          )}
          <div className={`flex items-center justify-between gap-3 text-xs text-muted-foreground ${isHome ? "home-news-meta" : isArchive ? "news-card-meta" : ""}`}>
            <span className="flex items-center gap-3">
              {valid && <span>{date.toLocaleDateString(lang === "uz" || lang === "qr" ? "uz-UZ" : lang)}</span>}
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {item.views}
              </span>
            </span>
            {!!tr(item.category) && <span className="truncate text-primary">{tr(item.category)}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
