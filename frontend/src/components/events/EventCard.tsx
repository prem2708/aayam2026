'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';
import { Event } from '@/lib/api';
import { CATEGORY_COLORS, CATEGORY_LABELS, STATUS_COLORS, formatDate, stripHtml } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function EventCard({ event, index = 0 }: { event: Event; index?: number }) {
  const gradient = CATEGORY_COLORS[event.category] || 'from-violet-500 to-purple-500';
  const categoryGlowClass = `border-glow-${event.category}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.5, 
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={{ y: -6 }}
      className={cn(
        "group glass rounded-2xl overflow-hidden border border-violet-500/10 transition-all duration-300 hover:bg-slate-900/40",
        categoryGlowClass
      )}
    >
      <Link href={`/events/${event.slug}`} className="block">
        <div className="relative h-52 overflow-hidden bg-slate-950">
          {event.poster_url ? (
            <Image
              src={event.poster_url}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.9] group-hover:brightness-100"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={index < 3}
            />
          ) : (
            <div className={cn('h-full w-full bg-gradient-to-br', gradient, 'opacity-80 group-hover:opacity-100 transition-opacity duration-500')} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          
          {/* Status & Category Badge Overlay */}
          <span className={cn('absolute top-3.5 left-3.5 rounded-lg border backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider', STATUS_COLORS[event.status])}>
            {event.status}
          </span>
          <span className={cn('absolute top-3.5 right-3.5 rounded-lg bg-gradient-to-r px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md', gradient)}>
            {CATEGORY_LABELS[event.category]}
          </span>
        </div>

        <div className="p-6 pb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1 font-heading">
            {event.title}
          </h3>
          <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed font-sans min-h-[40px]">{stripHtml(event.description)}</p>
        </div>
      </Link>

      <div className="px-6 pb-6 pt-2">
        <div className="pt-4 border-t border-slate-900 flex flex-wrap gap-y-3.5 gap-x-4 items-center justify-between text-xs text-slate-500">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <span className="flex items-center gap-1.5 font-medium hover:text-slate-300 transition-colors">
              <Calendar className="h-3.5 w-3.5 text-violet-400" />
              {formatDate(event.event_start_at)}
            </span>
            {event.venue && (
              <span className="flex items-center gap-1.5 font-medium hover:text-slate-300 transition-colors">
                <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                {event.venue}
              </span>
            )}
            {event.is_team_event && (
              <span className="flex items-center gap-1.5 font-medium hover:text-slate-300 transition-colors">
                <Users className="h-3.5 w-3.5 text-pink-400" />
                Team (Max {event.max_team_size})
              </span>
            )}
          </div>

          {/* Entry Fee Badge */}
          <span className="ml-auto inline-flex items-center gap-1 rounded-lg bg-violet-950/50 border border-violet-500/25 px-3 py-1 text-xs font-bold text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.1)] group-hover:bg-violet-900/30 group-hover:border-violet-500/40 transition-all">
            <Ticket className="h-3.5 w-3.5 text-violet-400" />
            {event.amount && event.amount > 0 ? `₹${event.amount}` : 'Free'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex gap-3">
          <Link 
            href={`/events/${event.slug}`} 
            className="flex-1 text-center py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-300 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40 hover:text-white rounded-xl transition-all duration-300"
          >
            View details
          </Link>
          <Link 
            href={`/events/${event.slug}?register=true`} 
            className={cn(
              "flex-1 text-center py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md",
              event.status === 'open' 
                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:scale-[1.02] active:scale-[0.98]" 
                : "bg-slate-900/60 text-slate-500 border border-slate-900 cursor-not-allowed pointer-events-none"
            )}
          >
            {event.status === 'open' ? 'Register' : event.status}
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
