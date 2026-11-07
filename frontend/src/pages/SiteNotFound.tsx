import { useTranslation } from "react-i18next";

/**
 * Shown when the subdomain resolves to no theater.
 *
 * Every `*.eteatr.uz` host reaches a frontend container, so without this a
 * typo'd or retired subdomain would render the normal site chrome with empty
 * sections — indistinguishable from a real theater nobody has filled in yet.
 */
export default function SiteNotFound() {
  const { t } = useTranslation();
  const host = typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-20 text-foreground">
      <div className="w-full max-w-xl text-center">
        <p className="section-badge">
          {t("site_not_found.badge")}
        </p>
        <h1 className="mt-6 font-serif text-4xl font-bold leading-tight md:text-5xl">
          {t("site_not_found.title")}
        </h1>
        {!!host && (
          <p className="mt-6 inline-block rounded-full border border-border bg-muted/40 px-4 py-2 font-mono text-sm text-muted-foreground">
            {host}
          </p>
        )}
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
          {t("site_not_found.description")}
        </p>
      </div>
    </div>
  );
}
