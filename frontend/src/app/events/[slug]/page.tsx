import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventDetailClient } from './event-detail-client';
import { Event } from '@/lib/api';
import { stripHtml } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getEvent(slug: string): Promise<Event | null> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    const res = await fetch(`${base}/events/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: 'Event Not Found' };
  const plainDesc = stripHtml(event.description);
  return {
    title: event.title,
    description: plainDesc.slice(0, 160),
    openGraph: {
      title: `${event.title} | Aayam TechFest`,
      description: plainDesc.slice(0, 160),
      images: event.poster_url ? [{ url: event.poster_url }] : [],
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();
  return <EventDetailClient event={event} />;
}
