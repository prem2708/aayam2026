import { MetadataRoute } from 'next';
import { apiFetch, Event } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aayamtechfest2026.vercel.app';

  // 1. Define static routes
  const staticRoutes = [
    { url: `${siteUrl}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${siteUrl}/events`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${siteUrl}/help`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${siteUrl}/winners`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
  ];

  // 2. Fetch dynamic event routes from the backend API (handling pagination since limit is capped at 50)
  let dynamicEventRoutes: MetadataRoute.Sitemap = [];
  try {
    let allEvents: Event[] = [];
    let page = 1;
    const limit = 50;
    let hasMore = true;

    while (hasMore) {
      const res = await apiFetch<Event[]>(`/events?limit=${limit}&page=${page}`);
      if (res.success && res.data && res.data.length > 0) {
        allEvents = allEvents.concat(res.data);
        const total = (res.meta as any)?.total || 0;
        if (allEvents.length >= total || res.data.length < limit) {
          hasMore = false;
        } else {
          page++;
        }
      } else {
        hasMore = false;
      }
    }

    dynamicEventRoutes = allEvents.map((event) => ({
      url: `${siteUrl}/events/${event.slug}`,
      lastModified: new Date(event.event_start_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generating sitemap events dynamic routes:', error);
  }

  return [...staticRoutes, ...dynamicEventRoutes];
}
