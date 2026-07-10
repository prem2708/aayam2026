import { MetadataRoute } from 'next';

export const revalidate = 3600; // Revalidate sitemap at most every hour

interface Event {
  slug: string;
  updated_at?: string;
  created_at?: string;
  deleted_at?: string | null;
}

/** Fetch one page of events with redirect-follow and an 8-second timeout. */
async function fetchEventsPage(apiUrl: string, page: number, limit: number): Promise<Event[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${apiUrl}/events?page=${page}&limit=${limit}`, {
      redirect: 'follow',             // follow HTTP→HTTPS redirects (Render.com)
      signal: controller.signal,
      next: { revalidate: 3600 },    // ISR cache: regenerate in background every hour
    });

    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } finally {
    clearTimeout(timer);
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Prefer server-side vars (no NEXT_PUBLIC_ prefix) for server-only routes like sitemap
  const baseUrl =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://aayamtechfest2026.vercel.app';

  const apiUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://aayam2026.onrender.com/api/v1';

  // ── Static routes ───────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`,         lastModified: new Date(), changeFrequency: 'daily',  priority: 1.0 },
    { url: `${baseUrl}/about`,   lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/events`,  lastModified: new Date(), changeFrequency: 'daily',  priority: 0.9 },
    { url: `${baseUrl}/winners`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/help`,    lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ];

  // ── Dynamic event routes (paginated, max 50/page per backend validator) ─
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  const limit = 50;

  for (let page = 1; ; page++) {
    try {
      const events = await fetchEventsPage(apiUrl, page, limit);

      const eventRoutes = events.map((event) => {
        const lastMod = event.updated_at || event.created_at || new Date().toISOString();
        return {
          url: `${baseUrl}/events/${event.slug}`,
          lastModified: new Date(lastMod),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        };
      });

      dynamicRoutes = [...dynamicRoutes, ...eventRoutes];

      // Reached last page
      if (events.length < limit) break;
    } catch (error) {
      // Timeout or network error — return what we have so far
      console.error(`[sitemap] Failed to fetch events page ${page}:`, error);
      break;
    }
  }

  return [...staticRoutes, ...dynamicRoutes];
}
