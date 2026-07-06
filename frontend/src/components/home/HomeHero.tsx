'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Trophy, Users, Megaphone, Calendar, ShieldCheck, Code2, Gamepad2, Cpu } from 'lucide-react';
import { CountdownTimer } from '@/components/shared/CountdownTimer';
import { EventCard } from '@/components/events/EventCard';
import { Event } from '@/lib/api';

const stats = [
  { icon: Zap,    label: 'Tech & Gaming Events', value: '50+',  color: '#60a5fa', glow: 'rgba(96,165,250,0.18)'  },
  { icon: Users,  label: 'Active Registrations',  value: '10K+', color: '#a78bfa', glow: 'rgba(167,139,250,0.18)' },
  { icon: Trophy, label: 'Grand Prize Pool',       value: '₹5L+', color: '#f59e0b', glow: 'rgba(245,158,11,0.18)' },
];

const featureItems = [
  { icon: Code2,    text: 'Clash in intense coding, gaming, and robotics arenas',     color: '#60a5fa' },
  { icon: Cpu,      text: 'Gain insights from industrial veterans and developers',      color: '#a78bfa' },
  { icon: Gamepad2, text: 'Build networks and grab amazing prizes along the way',       color: '#f59e0b' },
];

const item = {
  hidden: { y: 28, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } },
};
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.13, delayChildren: 0.08 } },
};

export function HomeHero({ featured, announcements = [] }: { featured: Event[]; announcements?: any[] }) {
  return (
    <>
      {/* ══════ HERO ══════ */}
      <section className="relative overflow-hidden min-h-[94vh] flex items-center pt-8">
        <div className="absolute inset-0 -z-10 bg-background">
          <div className="absolute inset-0 grid-bg opacity-80" />
          {/* Soft blue blob */}
          <div className="absolute top-[5%] left-[10%] h-[480px] w-[480px] rounded-full animate-aurora-drift"
            style={{ background: 'rgba(96,165,250,0.13)', filter: 'blur(110px)', pointerEvents: 'none' }} />
          {/* Soft violet blob */}
          <div className="absolute bottom-[10%] right-[8%] h-[420px] w-[420px] rounded-full animate-aurora-drift-slow"
            style={{ background: 'rgba(167,139,250,0.11)', filter: 'blur(110px)', pointerEvents: 'none' }} />
          {/* Warm gold accent */}
          <div className="absolute top-[25%] right-[20%] h-[260px] w-[260px] rounded-full animate-pulse-glow"
            style={{ background: 'rgba(245,158,11,0.07)', filter: 'blur(90px)', pointerEvents: 'none' }} />
          {/* Soft rose bottom-left */}
          <div className="absolute bottom-[15%] left-[20%] h-[240px] w-[240px] rounded-full animate-pulse-glow"
            style={{ background: 'rgba(244,114,182,0.07)', filter: 'blur(90px)', pointerEvents: 'none' }} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_50%,transparent_45%,rgba(6,8,18,0.85)_100%)]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 w-full">
          <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col items-center text-center">

            {/* Date badge */}
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-bold uppercase tracking-widest mb-8"
                style={{
                  border: '1px solid rgba(245,158,11,0.3)',
                  background: 'rgba(245,158,11,0.08)',
                  color: '#f59e0b',
                  boxShadow: '0 0 20px rgba(245,158,11,0.1)',
                }}>
                <Calendar className="h-3.5 w-3.5" />
                October 15–17, 2026
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-ring-pulse" />
              </span>
            </motion.div>

            {/* Main title */}
            <motion.h1 variants={item}
              className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] font-heading">
              Welcome to
              <br />
              <span className="gradient-text" style={{ display: 'inline-block', paddingBottom: '0.05em' }}>
                Aayam TechFest
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={item}
              className="mx-auto mt-8 max-w-2xl text-base sm:text-xl leading-relaxed font-sans"
              style={{ color: 'rgba(232,238,255,0.58)' }}>
              India&apos;s premier technical festival. Unify with thousands of innovators, compete in
              intense hackathons, clash in gaming arenas, and attend world-class workshops.
            </motion.p>

            {/* CTA row */}
            <motion.div variants={item} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/events"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-9 py-4 text-base font-bold text-white transition-all duration-300 premium-btn animate-glitch-pulse"
                style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 55%, #f472b6 100%)' }}
              >
                Browse All Events <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-9 py-4 text-base font-semibold transition-all duration-300 hover:scale-[1.02]"
                style={{
                  border: '1px solid rgba(96,165,250,0.22)',
                  background: 'rgba(96,165,250,0.06)',
                  color: '#93c5fd',
                }}
              >
                About the Fest
              </Link>
            </motion.div>

            {/* Countdown */}
            <motion.div variants={item} className="mt-20 w-full">
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] mb-7 font-heading"
                style={{ color: 'rgba(96,165,250,0.45)' }}>
                ◈ The Countdown Has Begun ◈
              </p>
              <CountdownTimer />
            </motion.div>
          </motion.div>

          {/* Stats */}
          <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {stats.map(({ icon: Icon, label, value, color, glow }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.13, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass rounded-2xl p-6 text-center cyber-card glow-card group"
                style={{ borderColor: `${color}20` }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `${color}14`, border: `1px solid ${color}28` }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <div className="text-3xl sm:text-4xl font-black font-heading"
                  style={{ color, textShadow: `0 0 24px ${glow}` }}>{value}</div>
                <div className="text-xs sm:text-sm mt-2 font-medium font-sans" style={{ color: 'rgba(232,238,255,0.48)' }}>
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ VIDEO + DESCRIPTION ══════ */}
      <section className="py-28 relative overflow-hidden" style={{ borderTop: '1px solid rgba(96,165,250,0.07)' }}>
        <div className="absolute top-[20%] right-[-8%] h-[350px] w-[350px] rounded-full animate-pulse-glow"
          style={{ background: 'rgba(167,139,250,0.07)', filter: 'blur(120px)', pointerEvents: 'none' }} />
        <div className="absolute bottom-[10%] left-[-5%] h-[300px] w-[300px] rounded-full animate-pulse-glow"
          style={{ background: 'rgba(96,165,250,0.06)', filter: 'blur(120px)', pointerEvents: 'none' }} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="relative aspect-video rounded-3xl overflow-hidden group cyber-card"
              style={{
                border: '1px solid rgba(96,165,250,0.15)',
                boxShadow: '0 0 40px rgba(96,165,250,0.08), 0 0 80px rgba(167,139,250,0.05)',
              }}
            >
              <video className="w-full h-full object-cover" controls playsInline
                poster="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800"
                src="https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-loop-41851-large.mp4" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-500" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="space-y-7"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.22)', color: '#f59e0b' }}>
                <Zap className="h-3.5 w-3.5" /> The Ultimate Tech Experience
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white leading-tight">
                Feel the Power &amp; Energy of <span className="gradient-text">Aayam TechFest</span>
              </h2>
              <p className="leading-relaxed font-sans text-sm sm:text-base" style={{ color: 'rgba(232,238,255,0.52)' }}>
                Step into a realm where imagination meets reality. Aayam brings together the brightest minds
                to collaborate, innovate, and compete. From high-octane robotics battles to groundbreaking
                development challenges, experience tech like never before.
              </p>
              <div className="space-y-4">
                {featureItems.map(({ icon: Icon, text, color }, i) => (
                  <div key={i} className="flex items-start gap-3 group/feat">
                    <div className="mt-0.5 h-8 w-8 shrink-0 flex items-center justify-center rounded-lg transition-all duration-300 group-hover/feat:scale-110"
                      style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                      <Icon className="h-4 w-4" style={{ color }} />
                    </div>
                    <p className="text-sm font-medium pt-1.5" style={{ color: 'rgba(232,238,255,0.72)' }}>{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════ ANNOUNCEMENTS ══════ */}
      {announcements && announcements.length > 0 && (
        <section className="py-24 relative" style={{ borderTop: '1px solid rgba(167,139,250,0.07)' }}>
          <div className="absolute inset-0 -z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(167,139,250,0.03), transparent)' }} />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-12">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.22)' }}>
                <Megaphone className="h-5 w-5" style={{ color: '#f472b6' }} />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight font-heading">Latest Announcements</h2>
                <p className="text-xs sm:text-sm mt-1" style={{ color: 'rgba(232,238,255,0.38)' }}>
                  Live updates and essential announcements
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {announcements.map((a, i) => (
                <motion.div key={a.id}
                  initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass rounded-2xl p-6 flex flex-col justify-between glow-card cyber-card"
                  style={{ borderLeft: '3px solid rgba(167,139,250,0.4)' }}>
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider mb-3 px-2 py-0.5 rounded-md"
                      style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', color: '#a78bfa' }}>
                      <ShieldCheck className="h-3 w-3" /> Info Verified
                    </span>
                    <h3 className="font-bold text-lg sm:text-xl mb-3 font-heading rich-text"
                      dangerouslySetInnerHTML={{ __html: a.title }}
                      style={{ color: 'rgba(232,238,255,0.95)' }} />
                    <div className="text-sm leading-relaxed rich-text"
                      dangerouslySetInnerHTML={{ __html: a.body }}
                      style={{ color: 'rgba(232,238,255,0.52)' }} />
                  </div>
                  <div className="text-xs mt-6 font-semibold flex justify-between items-center pt-4"
                    style={{ borderTop: '1px solid rgba(96,165,250,0.07)', color: 'rgba(232,238,255,0.3)' }}>
                    <span>Aayam TechFest 2026 Admin</span>
                    <span>{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(a.created_at))}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ FEATURED EVENTS ══════ */}
      {featured.length > 0 && (
        <section className="py-24" style={{ borderTop: '1px solid rgba(96,165,250,0.07)' }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold font-heading mb-2 block"
                  style={{ color: 'rgba(245,158,11,0.7)' }}>◈ Hand-picked for you</span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading">
                  Featured <span className="gradient-text">Highlights</span>
                </h2>
              </div>
              <Link href="/events" className="flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5"
                style={{ color: '#60a5fa' }}>
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
