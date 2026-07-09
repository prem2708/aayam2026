import { MetadataRoute } from 'next';
import { apiFetch, Event } from '@/lib/api';

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

  // 2. Fetch dynamic event routes from the backend API
  let dynamicEventRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await apiFetch<Event[]>('/events?limit=100');
    if (res.success && res.data) {
      dynamicEventRoutes = res.data.map((event) => ({
        url: `${siteUrl}/events/${event.slug}`,
        lastModified: new Date(event.event_start_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error generating sitemap events dynamic routes:', error);
  }

  return [...staticRoutes, ...dynamicEventRoutes];
}
