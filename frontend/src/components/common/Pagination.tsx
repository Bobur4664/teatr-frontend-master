import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

/** Build the list of page buttons: first, last, current ±1, with ellipses. */
function buildPages(page: number, total: number): (number | "ellipsis")[] {
  const out: (number | "ellipsis")[] = [];
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || (p >= page - 1 && p <= page + 1)) {
      out.push(p);
    } else if (out[out.length - 1] !== "ellipsis") {
      out.push("ellipsis");
    }
  }
  return out;
}

const cellBase =
  "h-10 min-w-10 px-3 inline-flex items-center justify-center border text-sm font-bold rounded-none " +
  "transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none";

export default function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);

  return (
    <nav
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
      aria-label={t("pagination.label", "Pagination")}
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label={t("pagination.prev", "Previous")}
        className={cn(cellBase, "border-border text-foreground hover:border-primary hover:text-primary")}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e${i}`} className="px-1 text-muted-foreground select-none" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              cellBase,
              p === page
                ? "bg-primary border-primary text-white shadow-sm"
                : "border-border text-foreground hover:border-primary hover:text-primary"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t("pagination.next", "Next")}
        className={cn(cellBase, "border-border text-foreground hover:border-primary hover:text-primary")}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
