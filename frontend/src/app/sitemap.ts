import { MetadataRoute } from 'next';

export const revalidate = 3600; // Revalidate sitemap at most every hour

interface Event {
  slug: string;
  updated_at?: string;
  created_at?: string;
  deleted_at?: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aayamtechfest2026.vercel.app';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aayam2026.onrender.com/api/v1';

  // Define static routes
  const staticRoutes = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/winners`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/help`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
  ];

  // Fetch dynamic events with pagination (max limit of 50 per page as per backend validator)
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  let page = 1;
  const limit = 50;

  while (true) {
    try {
      const res = await fetch(`${apiUrl}/events?page=${page}&limit=${limit}`, {
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        break;
      }

      const json = await res.json();
      const events: Event[] = json.data || [];

      if (events.length === 0) {
        break;
      }

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

      // If we got fewer events than the limit, we reached the last page
      if (events.length < limit) {
        break;
      }

      page++;
    } catch (error) {
      console.error(`Sitemap generation: Error fetching events on page ${page}:`, error);
      break; // Return whatever we have already fetched successfully
    }
  }

  return [...staticRoutes, ...dynamicRoutes];
}
