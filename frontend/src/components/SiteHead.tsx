import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteSettings } from '@/context/SiteSettingsContext';

type Localized = string | Record<string, string> | null | undefined;

/** Resolve a possibly-localized field to the current language. */
function pick(value: Localized, lang: string): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.uz || Object.values(value).find(Boolean) || '';
}

/** Create or update a <link> identified by a stable data-dyn id. */
function upsertLink(id: string, rel: string, attrs: Record<string, string | null>) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[data-dyn="${id}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('data-dyn', id);
    document.head.appendChild(el);
  }
  el.setAttribute('rel', rel);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) el.removeAttribute(k);
    else el.setAttribute(k, v);
  }
}

/** Create or update a <meta> by name/property. */
function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Drives the document <head> (title, favicons, web manifest, SEO/OG meta)
 * from the current theater's SiteSettings. Renders nothing.
 */
export default function SiteHead() {
  const { settings } = useSiteSettings();
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'uz').split('-')[0];

  useEffect(() => {
    if (!settings) return;

    // ── Title ──
    const title =
      pick(settings.site_name, lang) ||
      [pick(settings.site_name_line1, lang), pick(settings.site_name_line2, lang)]
        .filter(Boolean)
        .join(' ') ||
      document.title;
    if (title) document.title = title;

    // ── Favicons / manifest ──
    const fav = settings.favicons;
    if (fav) {
      // Drop the static defaults from index.html so the theater's set wins.
      document.head
        .querySelectorAll(
          'link[rel~="icon"]:not([data-dyn]),' +
            'link[rel="apple-touch-icon"]:not([data-dyn]),' +
            'link[rel="manifest"]:not([data-dyn])'
        )
        .forEach((el) => el.remove());

      if (fav.favicon_svg) upsertLink('icon-svg', 'icon', { type: 'image/svg+xml', href: fav.favicon_svg });
      if (fav.favicon_96) upsertLink('icon-96', 'icon', { type: 'image/png', sizes: '96x96', href: fav.favicon_96 });
      if (fav.favicon_ico) upsertLink('icon-ico', 'icon', { type: 'image/x-icon', href: fav.favicon_ico });
      if (fav.apple_touch_icon) upsertLink('apple', 'apple-touch-icon', { href: fav.apple_touch_icon });
      if (fav.webmanifest) upsertLink('manifest', 'manifest', { href: fav.webmanifest, crossorigin: 'use-credentials' });
    }

    // ── Metadata / Open Graph ──
    const description = pick(settings.meta_description, lang) || title;
    if (description) {
      upsertMeta('name', 'description', description);
      upsertMeta('property', 'og:description', description);
    }
    if (title) {
      upsertMeta('property', 'og:title', title);
      upsertMeta('name', 'apple-mobile-web-app-title', title);
    }
    upsertMeta('property', 'og:type', 'website');
    const ogImage = (fav && (fav.icon_512 || fav.apple_touch_icon)) || settings.logo;
    if (ogImage) upsertMeta('property', 'og:image', ogImage);
    upsertMeta('name', 'twitter:card', 'summary');
  }, [settings, lang]);

  return null;
}
