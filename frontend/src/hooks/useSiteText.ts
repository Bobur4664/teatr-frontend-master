import { useTranslation } from 'react-i18next';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { tr } from '@/lib/tr';

/**
 * Section headings and intros a theatre edits in the admin ("Sahifa
 * matnlari"), served inside the site settings. Returns
 * `siteText(field, i18nKey)`: the theatre's text for `field`, or the built-in
 * i18n text when that field is blank. Fields fall back one by one, so a
 * theatre that fills in a single heading keeps the defaults for the rest.
 */
export function useSiteText() {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();
  return (field: string, key: string) => tr(settings?.texts?.[field]) || t(key);
}
