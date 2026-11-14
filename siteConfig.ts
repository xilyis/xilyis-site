// Site-wide details. Edit here and every page updates.

/** The portfolio name, used everywhere (hero, about, footer, page titles). */
export const SITE_NAME = 'XILYAS';

export const SITE_EMAIL = 'info@xilyas.com';

/** Shown in the footer's System column. */
export const SITE_REGION = 'JP-Tokyo';

/** First year of the copyright line. The end year is the current year. */
export const COPYRIGHT_START_YEAR = 2024;

/**
 * Social links. Leave `url` empty to hide a link; fill it in to show it.
 * Example: { label: 'Instagram', url: 'https://instagram.com/yourhandle' }
 */
export const SOCIAL_LINKS: { label: string; url: string }[] = [
  { label: 'Instagram', url: '' },
  { label: 'Twitter/X', url: '' },
  { label: 'LinkedIn', url: '' },
];

/** Add real policy pages here when they exist; none are shown while empty. */
export const LEGAL_LINKS: { label: string; url: string }[] = [];

/**
 * True only for a real destination. '#', empty strings and the leftover
 * template placeholders count as "no link", so dead buttons stay hidden.
 */
export const hasLink = (url?: string): boolean =>
  Boolean(url) &&
  url !== '#' &&
  !url!.includes('your-username') &&
  !url!.includes('/you/repo');

/**
 * The small labels on the home page (under the Archive / About buttons).
 * They are the original placeholders. To make one real, change its `label`
 * and fill in `url`; a label with no `url` stays plain, non-clickable text.
 *
 * How many you keep is up to you:
 *   - 3 or 2 entries: each shows as  — LABEL
 *   - 1 entry:        it shows framed as  — LABEL —
 *   - 0 entries (empty list): the whole row is hidden automatically
 * Delete a line to remove a link. Example:
 *   { label: 'INSTAGRAM', url: 'https://instagram.com/yourhandle' }
 */
export const HERO_LINKS: { label: string; url: string }[] = [
  { label: 'Link_01', url: '' },
  { label: 'Link_02', url: '' },
  { label: 'Link_03', url: '' },
];

/**
 * Turns a public/ file path into a URL that works under the site's base path
 * (vite.config.ts `base`). Use it for any image/video path you write yourself:
 *   asset('/assets/entry-01.png')  ->  '/xilyis-site/assets/entry-01.png'
 * Full URLs (https://, data:, blob:) pass through unchanged.
 */
export const asset = (path: string): string => {
  if (!path || /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(path) || /^(?:data|blob):/i.test(path)) {
    return path;
  }
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
};