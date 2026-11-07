import i18n from '@/i18n';

// VITE_API_URL picks the API. Unset, `npm run dev` uses a local Django and a
// production build uses the live API, so local work can't write to production
// unless someone asks for that on purpose.
const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:8000/api' : 'https://api.eteatr.uz/api');

/** Current UI language code (e.g. 'uz', 'ru'), sent to the API so it returns
 *  translated fields resolved to that single language. */
function currentLang(): string {
  return (i18n.language || 'uz').split('-')[0];
}

/** Append the active language as a `lang` query param to an endpoint. */
function withLang(endpoint: string): string {
  const sep = endpoint.includes('?') ? '&' : '?';
  return `${endpoint}${sep}lang=${currentLang()}`;
}

// Default test theater used when the URL has no subdomain to read.
const DEFAULT_THEATER = 'th1';

/**
 * The current theater (tenant) sent as the `Theater` request header so the
 * backend scopes every response to it. Resolution order:
 *   1. `VITE_THEATER_SLUG` env override (optional, for forced deployments)
 *   2. the URL subdomain (e.g. `buxoro.eteatr.uz` → `buxoro`,
 *      `buxoro.localhost` → `buxoro`)
 *   3. `th1` — the default test theater when there is no subdomain
 *      (localhost, an IP, a bare `domain.tld`, or a leading `www`).
 */
function resolveTheaterSlug(): string {
  const fromEnv = import.meta.env.VITE_THEATER_SLUG as string | undefined;
  if (fromEnv) return fromEnv;

  if (typeof window === 'undefined') return DEFAULT_THEATER;

  let host = window.location.hostname; // hostname only, no port
  if (host.startsWith('www.')) host = host.slice(4);

  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(':');
  const labels = host.split('.');

  // `<sub>.localhost` — local subdomain testing
  if (labels.length >= 2 && labels[labels.length - 1] === 'localhost') {
    return labels[0] || DEFAULT_THEATER;
  }

  // Production: a real subdomain only exists as `<sub>.<domain>.<tld>` (3+ labels).
  if (!isIp && labels.length > 2 && labels[0]) {
    return labels[0];
  }

  // localhost, IP, or bare `domain.tld` → fall back to the test theater.
  return DEFAULT_THEATER;
}

const THEATER_SLUG = resolveTheaterSlug();

function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...(extra || {}) };
  if (THEATER_SLUG) headers['Theater'] = THEATER_SLUG;
  return headers;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** An API failure that carries the HTTP status, so callers can tell a real
 *  "this tenant does not exist" 404 apart from the API being unreachable. */
export interface ApiError extends Error {
  status?: number;
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${withLang(endpoint)}`, { headers: buildHeaders() });
  if (!res.ok) {
    const err: ApiError = new Error(`API error: ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

function deduplicateList<T>(items: T[]): T[] {
  if (!Array.isArray(items)) return items;
  const seen = new Set<string | number>();
  return items.filter((item: any) => {
    if (!item) return false;
    const key = item.id !== undefined && item.id !== null ? item.id : (typeof item.title === "object" ? JSON.stringify(item.title) : item.title || item.name);
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchList<T>(endpoint: string): Promise<T[]> {
  const data = await fetchApi<PaginatedResponse<T>>(endpoint);
  return deduplicateList(data.results || []);
}

// ─── Performances ────────────────────────────────────────────

export async function getPerformances(status?: string): Promise<any[]> {
  const query = status ? `?status=${status}` : '';
  return fetchList(`/performances/${query}`);
}

export async function getPerformance(id: string | number): Promise<any> {
  return fetchApi(`/performances/${id}/`);
}

// ─── Genres ──────────────────────────────────────────────────

export async function getGenres(): Promise<any[]> {
  return fetchApi<any[]>(`/genres/`);
}

// ─── Team Members ────────────────────────────────────────────

export async function getTeamMembers(category?: string): Promise<any[]> {
  const query = category ? `?category=${category}` : '';
  return fetchList(`/team/${query}`);
}

export async function getTeamMember(id: string | number): Promise<any> {
  return fetchApi(`/team/${id}/`);
}

export async function likeTeamMember(id: string | number): Promise<{ likes: number }> {
  const res = await fetch(`${API_BASE}/team/${id}/like/`, {
    method: 'POST',
    headers: buildHeaders(),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─── News ────────────────────────────────────────────────────

export async function getNews(important?: boolean): Promise<any[]> {
  const query = important ? '?important=true' : '';
  return fetchList(`/news/${query}`);
}

/** Paginated news for the /news archive — keeps count/next/previous so the UI can page. */
export async function getNewsPage(page = 1, pageSize = 9): Promise<PaginatedResponse<any>> {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  return fetchApi<PaginatedResponse<any>>(`/news/?${params.toString()}`);
}

export async function getNewsItem(id: string | number): Promise<any> {
  return fetchApi(`/news/${id}/`);
}

// ─── Gallery ─────────────────────────────────────────────────

export async function getGallery(category?: string): Promise<any[]> {
  const query = category ? `?category=${category}` : '';
  return fetchList(`/gallery/${query}`);
}

// ─── Reels ───────────────────────────────────────────────────

export async function getReels(category?: string): Promise<any[]> {
  const query = category ? `?category=${category}` : '';
  return fetchList(`/reels/${query}`);
}

// ─── Comments ────────────────────────────────────────────────

export async function getComments(): Promise<any[]> {
  return fetchList(`/comments/`);
}

export async function postComment(data: {
  comment: string;
  full_name: string;
  position?: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/comments/`, {
    method: 'POST',
    headers: buildHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─── Info Pages ──────────────────────────────────────────────

export async function getInfoPage(type: string): Promise<any> {
  return fetchApi(`/info-pages/${type}/`);
}

export async function getInfoDocuments(pageType: string, section?: string): Promise<any[]> {
  const params = new URLSearchParams({ page_type: pageType });
  if (section) params.set('section', section);
  return fetchApi<any[]>(`/info-documents/?${params.toString()}`);
}

// ─── Vacancies ───────────────────────────────────────────────

export async function getVacancies(): Promise<any[]> {
  return fetchApi<any[]>(`/vacancies/`);
}

// ─── Partners ────────────────────────────────────────────────

export async function getPartners(): Promise<any[]> {
  return fetchApi<any[]>(`/partners/`);
}

// ─── About page (timeline & stats) ───────────────────────────

export async function getTimeline(): Promise<any[]> {
  return fetchApi<any[]>(`/about/timeline/`);
}

export async function getAboutStats(): Promise<any[]> {
  return fetchApi<any[]>(`/about/stats/`);
}

/** The home page "Teatr haqida" teaser block (single object, or {} when unset). */
export async function getHomeAbout(): Promise<any> {
  return fetchApi(`/home-about/`);
}

/** The "Teatr haqida" page copy (single object, or {} when unset). */
export async function getAboutPage(): Promise<any> {
  return fetchApi(`/about/page/`);
}

// ─── Site Settings ───────────────────────────────────────────

export async function getSiteSettings(): Promise<any> {
  return fetchApi(`/settings/`);
}
