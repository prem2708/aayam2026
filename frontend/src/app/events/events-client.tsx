'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Filter, RefreshCw } from 'lucide-react';
import { EventCard } from '@/components/events/EventCard';
import { Event } from '@/lib/api';
import { CATEGORY_LABELS, cn } from '@/lib/utils';

const categories = ['all', 'technical', 'cultural', 'gaming', 'workshop', 'hackathon'] as const;
const statuses = ['all', 'open', 'closed', 'ongoing', 'completed'] as const;

export function EventsPageClient({ initialEvents }: { initialEvents: Event[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const filtered = useMemo(() => {
    return initialEvents.filter((e) => {
      if (category !== 'all' && e.category !== category) return false;
      if (status !== 'all' && e.status !== status) return false;
      if (
        search &&
        !e.title.toLowerCase().includes(search.toLowerCase()) &&
        !e.description.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [initialEvents, search, category, status]);

  // Framer motion list animations
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <div className="relative min-h-screen pb-20">
      {/* Background patterns */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute top-[8%] right-[5%] h-[320px] w-[320px] rounded-full animate-pulse-glow" style={{ background: 'rgba(188,19,254,0.1)', filter: 'blur(100px)' }} />
        <div className="absolute bottom-[18%] left-[5%] h-[300px] w-[300px] rounded-full animate-pulse-glow" style={{ background: 'rgba(0,240,255,0.08)', filter: 'blur(100px)' }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative">
        {/* Header Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center sm:text-left pb-8"
          style={{ borderBottom: '1px solid rgba(0,240,255,0.1)' }}
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight font-heading">
            Explore <span className="gradient-text">All Events</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base font-sans" style={{ color: 'rgba(226,245,255,0.5)' }}>
            Filter, search, and register for technical challenges, workshops, and tournaments
          </p>
        </motion.div>

        {/* Filter Controls Row */}
        <div className="mt-8 space-y-6">
          {/* Search bar & Icon indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative flex items-center group rounded-2xl px-4 py-1.5 transition-all duration-300"
            style={{
              border: '1px solid rgba(0,240,255,0.15)',
              background: 'rgba(0,15,22,0.6)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <Search className="h-5 w-5 transition-colors" style={{ color: 'rgba(0,240,255,0.5)' }} />
            <input
              type="search"
              placeholder="Search events by title or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none outline-none py-3 px-3.5 text-sm text-white placeholder:text-slate-500 focus:ring-0"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-xs font-semibold px-2 py-1 rounded-lg transition-all"
                style={{ color: 'rgba(0,240,255,0.6)' }}
              >
                Clear
              </button>
            )}
          </motion.div>

          {/* Category Select Pills (Sliding layout active indicator) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="space-y-2.5"
          >
            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 px-1 font-heading" style={{ color: 'rgba(0,240,255,0.5)' }}>
              <Filter className="h-3 w-3" style={{ color: '#00f0ff' }} /> Categories
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {categories.map((cat) => {
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      'relative rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer',
                      isActive ? '' : 'hover:text-white'
                    )}
                    style={isActive
                      ? { color: '#00f0ff' }
                      : { color: 'rgba(226,245,255,0.45)' }
                    }
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeCategoryTab"
                        className="absolute inset-0 rounded-xl -z-10"
                        style={{
                          background: 'rgba(0,240,255,0.08)',
                          border: '1px solid rgba(0,240,255,0.25)',
                          boxShadow: '0 0 12px rgba(0,240,255,0.12)',
                        }}
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                    )}
                    {cat === 'all' ? 'All Events' : CATEGORY_LABELS[cat]}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Status Selection Pills */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-2.5 pt-2"
          >
            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 px-1 font-heading" style={{ color: 'rgba(188,19,254,0.6)' }}>
              <SlidersHorizontal className="h-3 w-3" style={{ color: '#bc13fe' }} /> Status
            </span>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => {
                const isActive = status === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className="relative rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-all duration-300 cursor-pointer"
                    style={isActive ? {
                      background: 'rgba(188,19,254,0.1)',
                      border: '1px solid rgba(188,19,254,0.28)',
                      color: '#bc13fe',
                      boxShadow: '0 0 10px rgba(188,19,254,0.12)',
                    } : {
                      border: '1px solid rgba(226,245,255,0.08)',
                      color: 'rgba(226,245,255,0.38)',
                    }}
                  >
                    {s}
                  </button>
                );
              })}

              {(category !== 'all' || status !== 'all' || search) && (
                <button
                  onClick={() => { setCategory('all'); setStatus('all'); setSearch(''); }}
                  className="rounded-lg px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  style={{ border: '1px solid rgba(255,0,127,0.25)', background: 'rgba(255,0,127,0.07)', color: '#ff007f' }}
                >
                  <RefreshCw className="h-3 w-3" /> Reset
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Dynamic Card List Grid */}
        <div className="mt-12">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-16 text-center glass rounded-2xl py-20 border border-slate-900"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-500 mb-4">
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-200">No events found</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  We couldn&apos;t find any events matching your current filters. Try refining your search keywords or resetting filters.
                </p>
                <button 
                  onClick={() => { setCategory('all'); setStatus('all'); setSearch(''); }}
                  className="mt-6 rounded-xl bg-slate-900 border border-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-all"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div 
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                layout
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map((event, i) => (
                  <motion.div key={event.id} layout>
                    <EventCard event={event} index={i} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
