/** Canonical site URL for metadata, sitemap, and robots. */
export function getSiteUrl(): string {
  return (
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://aayamtechfest2026.vercel.app'
  );
}

/** API base URL for server-side fetches (sitemap, SSR). */
export function getApiUrl(): string {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://aayam2026.onrender.com/api/v1'
  );
}

/** Public routes that should be indexed by search engines. */
export const PUBLIC_ROUTES = [
  { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
  { path: '/about', changeFrequency: 'weekly' as const, priority: 0.8 },
  { path: '/events', changeFrequency: 'daily' as const, priority: 0.9 },
  { path: '/winners', changeFrequency: 'weekly' as const, priority: 0.7 },
  { path: '/help', changeFrequency: 'weekly' as const, priority: 0.6 },
];
