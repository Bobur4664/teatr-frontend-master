import i18n from '@/i18n';

/**
 * Resolve a translated value to a display string.
 *
 * The backend now returns translated fields as a plain string in the active
 * language (with default-language fallback), so this is normally a pass-through.
 * It also tolerates the legacy `{ uz, ru, en, qr }` dict shape, so any value
 * that still arrives as a dict keeps rendering correctly.
 */
export function tr(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const obj = value as Record<string, string>;
    const lang = (i18n.language || 'uz').split('-')[0];
    return obj[lang] ?? obj.uz ?? '';
  }
  return String(value);
}
