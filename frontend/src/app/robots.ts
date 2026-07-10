import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aayamtechfest2026.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/about', '/events', '/winners', '/help'],
      disallow: ['/dashboard', '/onboarding', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
