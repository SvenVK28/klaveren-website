/**
 * Prefix a site-internal path with the base path (`/` on scvkmedia.nl).
 * External URLs and anchors are returned unchanged, so values coming from the
 * CMS (which may be full URLs or /files/... paths) can be passed in directly.
 */
export function url(path = ''): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\/+/, '');
  return `${base}/${clean}`;
}

/** True when `path` is the current page or a section the current page is in. */
export function isActive(current: string, path: string): boolean {
  const target = url(path);
  return target === url('') ? current === target : current.startsWith(target);
}
