'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Trophy, Users, Megaphone, Calendar, ShieldCheck } from 'lucide-react';
import { CountdownTimer } from '@/components/shared/CountdownTimer';
import { EventCard } from '@/components/events/EventCard';
import { Event } from '@/lib/api';

const stats = [
  { icon: Zap, label: 'Tech & Gaming Events', value: '50+' },
  { icon: Users, label: 'Active Registrations', value: '10K+' },
  { icon: Trophy, label: 'Grand Prize Pool', value: '₹5 Lakhs+' },
];

export function HomeHero({ featured, announcements = [] }: { featured: Event[]; announcements?: any[] }) {
  // Animation variants for staggered load-in
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <>
      <section className="relative overflow-hidden min-h-[92vh] flex items-center pt-8">
        {/* Animated Background Grid & Blur Spheres */}
        <div className="absolute inset-0 -z-10 bg-slate-950">
          <div className="absolute inset-0 grid-bg opacity-70" />
          <div className="absolute top-[10%] left-[15%] h-[350px] w-[350px] rounded-full bg-violet-600/15 blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-[20%] right-[15%] h-[350px] w-[350px] rounded-full bg-cyan-500/15 blur-[120px] animate-pulse-glow" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center"
          >
            {/* Date Tag */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-950/40 px-4.5 py-2 text-xs sm:text-sm font-semibold text-violet-300 mb-8 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <Calendar className="h-4 w-4 text-violet-400" /> October 15–17, 2026
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[1.1] font-heading"
            >
              Welcome to <span className="gradient-text block mt-1 sm:mt-0 sm:inline drop-shadow-[0_2px_10px_rgba(167,139,250,0.15)]">Aayam TechFest</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={itemVariants} 
              className="mx-auto mt-8 max-w-2xl text-base sm:text-xl text-slate-400 leading-relaxed font-sans"
            >
              India&apos;s premier technical festival. Unify with thousands of innovators, compete in intense hackathons, clash in gaming arenas, and attend world-class workshops.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants} 
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/events"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 px-8 py-4 text-base font-bold text-white hover:opacity-95 hover:scale-[1.02] shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300 premium-btn"
              >
                Browse All Events
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>

            {/* Countdown timer */}
            <motion.div
              variants={itemVariants}
              className="mt-20 w-full"
            >
              <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-[0.25em] mb-6 font-heading">
                The Countdown Has Begun
              </p>
              <CountdownTimer />
            </motion.div>
          </motion.div>

          {/* Stats Grid */}
          <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass rounded-2xl p-6 text-center border-l-4 border-l-violet-500/50 hover:border-l-cyan-400/80 transition-all duration-300 shadow-md group hover:scale-[1.03] glow-card"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-950/40 border border-violet-500/20 mx-auto mb-4 group-hover:bg-violet-900/40 transition-colors">
                  <Icon className="h-5 w-5 text-cyan-400 group-hover:text-violet-300 transition-colors" />
                </div>
                <div className="text-2xl sm:text-3xl font-black gradient-text font-heading">{value}</div>
                <div className="text-xs sm:text-sm text-slate-400 mt-2 font-medium font-sans">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video & Description Section */}
      <section className="py-24 border-t border-violet-500/10 relative overflow-hidden bg-slate-950/20">
        <div className="absolute top-[30%] right-[-10%] h-[300px] w-[300px] rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side: Video Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-video rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/40 shadow-[0_0_30px_rgba(139,92,246,0.15)] group"
            >
              <video
                className="w-full h-full object-cover"
                controls
                playsInline
                poster="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800"
                src="https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-loop-41851-large.mp4"
              />
              <div className="absolute inset-0 bg-violet-600/5 mix-blend-multiply pointer-events-none group-hover:opacity-0 transition-opacity duration-300" />
            </motion.div>

            {/* Right Side: Description Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-xs font-semibold text-cyan-300 tracking-wider uppercase">
                <Zap className="h-3.5 w-3.5 text-cyan-400" /> The Ultimate Tech Experience
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white leading-tight">
                Feel the Power & Energy of <span className="gradient-text">Aayam TechFest</span>
              </h2>
              <p className="text-slate-400 leading-relaxed font-sans text-sm sm:text-base">
                Step into a realm where imagination meets reality. Aayam brings together the brightest minds to collaborate, innovate, and compete. From high-octane robotics battles to groundbreaking development challenges, experience tech like never before.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mt-1 shrink-0">✓</div>
                  <p className="text-slate-300 text-sm font-medium">Clash in intense coding, gaming, and robotics arenas</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mt-1 shrink-0">✓</div>
                  <p className="text-slate-300 text-sm font-medium">Gain insights from industrial veterans and developers</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mt-1 shrink-0">✓</div>
                  <p className="text-slate-300 text-sm font-medium">Build networks and grab amazing prizes along the way</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Announcements Section */}
      {announcements && announcements.length > 0 && (
        <section className="py-24 border-t border-violet-500/10 bg-slate-950/30 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent -z-10" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-12">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-950/60 border border-violet-500/20">
                <Megaphone className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight font-heading">Latest Announcements</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Live updates and essential announcements</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {announcements.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass rounded-2xl p-6 flex flex-col justify-between border-l-4 border-l-cyan-500/40 hover:border-l-violet-500/80 transition-all duration-300 glow-card"
                >
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-cyan-400 tracking-wider mb-3 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                      <ShieldCheck className="h-3 w-3" /> Info Verified
                    </span>
                    <h3 className="font-bold text-slate-200 text-lg sm:text-xl mb-3 font-heading rich-text" dangerouslySetInnerHTML={{ __html: a.title }} />
                    <div className="text-sm text-slate-400 leading-relaxed rich-text" dangerouslySetInnerHTML={{ __html: a.body }} />
                  </div>
                  <div className="text-xs text-slate-500 mt-6 font-semibold flex justify-between items-center border-t border-slate-900 pt-4">
                    <span>Aayam TechFest 2026 Admin</span>
                    <span>
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }).format(new Date(a.created_at))}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Events Section */}
      {featured.length > 0 && (
        <section className="py-24 border-t border-violet-500/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading">Featured Highlights</h2>
                <p className="mt-2 text-slate-400 text-sm">Hand-picked events you absolutely cannot miss</p>
              </div>
              <Link href="/events" className="text-violet-400 hover:text-violet-300 text-sm font-semibold flex items-center gap-1 hover:underline transition-all">
                View all events <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
