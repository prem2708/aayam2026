'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Ticket, ArrowRight } from 'lucide-react';
import { Event } from '@/lib/api';
import { CATEGORY_COLORS, CATEGORY_LABELS, STATUS_COLORS, formatDate, stripHtml } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function EventCard({ event, index = 0 }: { event: Event; index?: number }) {
  const gradient = CATEGORY_COLORS[event.category] || 'from-violet-500 to-purple-500';
  const categoryGlowClass = `border-glow-${event.category}`;
  const isOpen = event.status === 'open';

  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.52,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -7 }}
      className={cn(
        'group glass rounded-2xl overflow-hidden cyber-card glow-card',
        'border border-primary/10 transition-all duration-350',
        categoryGlowClass
      )}
    >
      <Link href={`/events/${event.slug}`} className="block">
        {/* Image / Gradient header */}
        <div className="relative h-52 overflow-hidden bg-background">
          {event.poster_url ? (
            <Image
              src={event.poster_url}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-106 transition-transform duration-600 brightness-[0.88] group-hover:brightness-100"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={index < 3}
            />
          ) : (
            <div className={cn('h-full w-full bg-gradient-to-br', gradient, 'opacity-75 group-hover:opacity-95 transition-opacity duration-500')} />
          )}

          {/* Gradient overlay bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-[#020205]/20 to-transparent" />

          {/* Data stream sweep on hover */}
          <div
            className="absolute top-0 left-0 w-20 h-full pointer-events-none opacity-0 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.2), transparent)',
              animation: 'data-stream 1.6s ease-out infinite',
              willChange: 'transform',
            }}
          />

          {/* Status badge */}
          <span className={cn('absolute top-3.5 left-3.5 rounded-lg border backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider', STATUS_COLORS[event.status])}>
            {event.status}
          </span>

          {/* Category badge */}
          <span className={cn('absolute top-3.5 right-3.5 rounded-lg bg-gradient-to-r px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg', gradient)}>
            {CATEGORY_LABELS[event.category]}
          </span>
        </div>

        {/* Card body */}
        <div className="p-6 pb-2">
          <h3
            className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300 line-clamp-1 font-heading"
          >
            {event.title}
          </h3>
          <p className="mt-2 text-sm line-clamp-2 leading-relaxed font-sans min-h-[40px]"
            style={{ color: 'rgba(226,245,255,0.5)' }}>
            {stripHtml(event.description)}
          </p>
        </div>
      </Link>

      {/* Meta + actions */}
      <div className="px-6 pb-6 pt-2">
        <div
          className="pt-4 flex flex-wrap gap-y-3 gap-x-4 items-center justify-between text-xs"
          style={{ borderTop: '1px solid rgba(0,240,255,0.08)', color: 'rgba(226,245,255,0.45)' }}
        >
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <span className="flex items-center gap-1.5 font-medium hover:text-primary transition-colors">
              <Calendar className="h-3.5 w-3.5" style={{ color: '#60a5fa' }} />
              {formatDate(event.event_start_at)}
            </span>
            {event.venue && (
              <span className="flex items-center gap-1.5 font-medium transition-colors">
                <MapPin className="h-3.5 w-3.5" style={{ color: '#a78bfa' }} />
                {event.venue}
              </span>
            )}
            {event.is_team_event && (
              <span className="flex items-center gap-1.5 font-medium transition-colors">
                <Users className="h-3.5 w-3.5" style={{ color: '#f472b6' }} />
                Team (Max {event.max_team_size})
              </span>
            )}
          </div>

          {/* Entry fee */}
          <span
            className="ml-auto inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold transition-all group-hover:scale-105"
            style={{
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.22)',
              color: '#f59e0b',
            }}
          >
            <Ticket className="h-3.5 w-3.5" />
            {event.amount && event.amount > 0 ? `₹${event.amount}` : 'Free'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex gap-3">
          <Link
            href={`/events/${event.slug}`}
            className="flex-1 text-center py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300"
            style={{
              border: '1px solid rgba(0,240,255,0.15)',
              background: 'rgba(0,240,255,0.04)',
              color: 'rgba(226,245,255,0.65)',
            }}
          >
            Details
          </Link>
          <Link
            href={`/events/${event.slug}?register=true`}
            className={cn(
              'flex-1 inline-flex items-center justify-center gap-1.5 text-center py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300',
              isOpen ? 'premium-btn' : 'pointer-events-none'
            )}
            style={
              isOpen
                ? {
                    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                    color: '#fff',
                    boxShadow: '0 0 16px rgba(96,165,250,0.3)',
                  }
                : {
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(232,238,255,0.08)',
                    color: 'rgba(232,238,255,0.25)',
                    cursor: 'not-allowed',
                  }
            }
          >
            {isOpen ? (
              <>Register <ArrowRight className="h-3.5 w-3.5" /></>
            ) : (
              event.status
            )}
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
