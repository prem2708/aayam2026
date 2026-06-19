import type { Metadata } from 'next';
import { EventsPageClient } from './events-client';
import { Event } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Browse Events',
  description: 'Explore all technical, cultural, gaming, workshop, and hackathon events at Aayam TechFest 2026.',
};

async function getEvents(): Promise<Event[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    const res = await fetch(`${base}/events?limit=50`, { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsPageClient initialEvents={events} />;
}
