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
      <div className="absolute inset-0 -z-10 bg-slate-950">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-[10%] right-[5%] h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-[20%] left-[5%] h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse-glow" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative">
        {/* Header Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center sm:text-left border-b border-slate-900 pb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight font-heading">
            Explore <span className="gradient-text">All Events</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 font-sans">
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
            className="relative flex items-center group rounded-2xl border border-slate-800/80 bg-slate-950/50 backdrop-blur-md px-4 py-1.5 focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/15 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300"
          >
            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
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
                className="text-xs text-slate-500 hover:text-slate-300 font-semibold px-2 py-1 rounded-lg hover:bg-slate-900 transition-all"
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
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1 font-heading">
              <Filter className="h-3 w-3 text-violet-400" /> Categories
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {categories.map((cat) => {
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      'relative rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-colors duration-300 cursor-pointer',
                      isActive ? 'text-violet-300' : 'text-slate-400 hover:text-slate-200'
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeCategoryTab"
                        className="absolute inset-0 bg-violet-500/10 rounded-xl border border-violet-500/25 shadow-[0_0_15px_rgba(139,92,246,0.1)] -z-10"
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
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1 font-heading">
              <SlidersHorizontal className="h-3 w-3 text-cyan-400" /> Status
            </span>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => {
                const isActive = status === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={cn(
                      'relative rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-all duration-300 border cursor-pointer',
                      isActive 
                        ? 'bg-cyan-600/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                        : 'bg-transparent border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800'
                    )}
                  >
                    {s}
                  </button>
                );
              })}
              
              {(category !== 'all' || status !== 'all' || search) && (
                <button
                  onClick={() => { setCategory('all'); setStatus('all'); setSearch(''); }}
                  className="rounded-lg border border-red-500/20 bg-red-950/10 px-3.5 py-1.5 text-xs font-bold text-red-400 hover:bg-red-950/20 hover:border-red-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" /> Reset Filters
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
