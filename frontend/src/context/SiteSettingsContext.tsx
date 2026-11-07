import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSiteSettings } from '@/lib/api';
import type { ApiError } from '@/lib/api';

export interface FaviconSet {
  apple_touch_icon: string | null;
  favicon_ico: string | null;
  favicon_svg: string | null;
  favicon_96: string | null;
  webmanifest: string | null;
  icon_192: string | null;
  icon_512: string | null;
}

interface SiteSettingsData {
  site_name: Record<string, string>;
  site_name_line1: Record<string, string>;
  site_name_line2: Record<string, string>;
  meta_description: Record<string, string>;
  about: Record<string, string>;
  logo: string;
  favicons: FaviconSet | null;
  phone: string;
  email: string;
  address: Record<string, string>;
  work_hours?: Record<string, string>;
  /** Admin-edited section headings and intros, keyed by field; see useSiteText. */
  texts?: Record<string, string>;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  telegram_url: string;
}

interface SiteSettingsContextType {
  settings: SiteSettingsData | null;
  loading: boolean;
  /** The host resolved to no theater — the API answered an explicit 404.
   *  Distinct from the API being unreachable, which leaves this false so a
   *  backend outage never looks like "this site does not exist". */
  notFound: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: null,
  loading: true,
  notFound: false,
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .catch((err: ApiError) => {
        // Only an explicit 404 means "no theater on this subdomain". Anything
        // else (network, TLS, 5xx) is the API being unavailable, and must not
        // be reported to visitors as a missing site.
        if (err?.status === 404) setNotFound(true);
        else console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, notFound }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
