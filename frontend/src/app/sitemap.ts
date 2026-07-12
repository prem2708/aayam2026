import { MetadataRoute } from 'next';
import { Event } from '@/lib/api';
import { getApiUrl, getSiteUrl, PUBLIC_ROUTES } from '@/lib/site';

export const dynamic = 'force-dynamic';

interface EventsPageResponse {
  success: boolean;
  data?: Event[];
  meta?: { page: number; limit: number; total: number };
}

const INDEXABLE_EVENT_STATUSES = new Set(['open', 'closed', 'ongoing', 'completed']);

/** Fetch one page of events with redirect-follow and an 8-second timeout. */
async function fetchEventsPage(apiUrl: string, page: number, limit: number): Promise<Event[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${apiUrl}/events?page=${page}&limit=${limit}`, {
      redirect: 'follow',
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const json = (await res.json()) as EventsPageResponse;
    return Array.isArray(json.data) ? json.data : [];
  } finally {
    clearTimeout(timer);
  }
}

function toEventSitemapEntry(baseUrl: string, event: Event): MetadataRoute.Sitemap[number] | null {
  if (!event.slug?.trim()) return null;
  if (!INDEXABLE_EVENT_STATUSES.has(event.status)) return null;

  const lastMod = event.updated_at || event.created_at || new Date().toISOString();

  return {
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: new Date(lastMod),
    changeFrequency: 'weekly',
    priority: event.is_featured ? 0.8 : 0.6,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const apiUrl = getApiUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const dynamicRoutes: MetadataRoute.Sitemap = [];
  const limit = 50;
  const seenSlugs = new Set<string>();

  for (let page = 1; ; page++) {
    try {
      const events = await fetchEventsPage(apiUrl, page, limit);

      for (const event of events) {
        if (seenSlugs.has(event.slug)) continue;

        const entry = toEventSitemapEntry(baseUrl, event);
        if (!entry) continue;

        seenSlugs.add(event.slug);
        dynamicRoutes.push(entry);
      }

      if (events.length < limit) break;
    } catch (error) {
      console.error(`[sitemap] Failed to fetch events page ${page}:`, error);
      break;
    }
  }

  return [...staticRoutes, ...dynamicRoutes];
}
