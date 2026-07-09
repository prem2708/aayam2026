import { apiFetch, Event } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aayamtechfest2026.vercel.app';

  // 1. Define static routes
  const staticRoutes = [
    { url: `${siteUrl}`, lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: '1.0' },
    { url: `${siteUrl}/about`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: '0.8' },
    { url: `${siteUrl}/events`, lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: '0.9' },
    { url: `${siteUrl}/help`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: '0.5' },
    { url: `${siteUrl}/winners`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: '0.7' },
  ];

  // 2. Fetch dynamic event routes from the backend API
  let dynamicEventRoutes: { url: string; lastModified: string; changeFrequency: string; priority: string }[] = [];
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

    dynamicEventRoutes = allEvents.map((event) => {
      const dateStr = event.event_start_at || new Date().toISOString();
      const dateObj = new Date(dateStr);
      const isoDate = isNaN(dateObj.getTime()) ? new Date().toISOString() : dateObj.toISOString();
      return {
        url: `${siteUrl}/events/${event.slug}`,
        lastModified: isoDate,
        changeFrequency: 'weekly',
        priority: '0.8',
      };
    });
  } catch (error) {
    console.error('Error generating sitemap events dynamic routes:', error);
  }

  const allRoutes = [...staticRoutes, ...dynamicEventRoutes];

  // Generate XML
  const xmlItems = allRoutes
    .map(
      (route) => `  <url>
    <loc>${escapeXml(route.url)}</loc>
    <lastmod>${route.lastModified}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=18000, stale-while-revalidate=600',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}
