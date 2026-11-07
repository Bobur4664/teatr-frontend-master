import { useTranslation } from "react-i18next";

interface EmptySectionProps {
  /** Overrides the default "content coming soon" line. */
  message?: string;
  /** Vertical padding preset — `tight` for inline slots, `default` for sections. */
  size?: "default" | "tight";
}

/**
 * Placeholder shown where a section has no content yet.
 *
 * Sections used to hide themselves when empty, which left a brand-new theatre
 * with almost no page at all — navbar, one block and the footer. They now stay
 * on screen and render this instead, so the site reads as a complete layout
 * waiting to be filled.
 */
export default function EmptySection({ message, size = "default" }: EmptySectionProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex items-center justify-center rounded-3xl border border-dashed border-border/70 bg-muted/20 px-6 text-center ${
        size === "tight" ? "py-10" : "py-20"
      }`}
    >
      <p className="max-w-md text-sm uppercase tracking-[0.2em] text-muted-foreground">
        {message || t("common.section_empty")}
      </p>
    </div>
  );
}
