import { HomeHero } from '@/components/home/HomeHero';
import { Event } from '@/lib/api';

async function getFeaturedEvents(): Promise<Event[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    const res = await fetch(`${base}/events?featured=true&limit=6`, {
      cache: 'no-store',
    });
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

async function getAnnouncements(): Promise<any[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    const res = await fetch(`${base}/admin/announcements/public`, {
      cache: 'no-store',
    });
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featured, announcements] = await Promise.all([
    getFeaturedEvents(),
    getAnnouncements(),
  ]);
  return <HomeHero featured={featured} announcements={announcements} />;
}
