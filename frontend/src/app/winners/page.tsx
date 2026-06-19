'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Landmark, Sparkles, Star, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const editions = ['Aayam 25'];

const winnersData: Record<string, { event: string; category: string; first: string; firstCollege: string; second: string; secondCollege: string; prize: string }[]> = {
  'Aayam 25': [
    {
      event: 'HackOverflow 3.0 (Hackathon)',
      category: 'Technical',
      first: 'Team ByteSync',
      firstCollege: 'IIT Indore',
      second: 'Code Crushers',
      secondCollege: 'SGSITS Indore',
      prize: '₹50,000'
    },
    {
      event: 'RoboWars: Unleashed',
      category: 'Technical',
      first: 'Team Destructor',
      firstCollege: 'VIT Bhopal',
      second: 'Mech Gladiators',
      secondCollege: 'Medicaps University',
      prize: '₹40,000'
    },
    {
      event: 'Valorant Arena',
      category: 'Gaming',
      first: 'Team Vandalize',
      firstCollege: 'IPS Academy',
      second: 'Phantom Lords',
      secondCollege: 'DAVV Indore',
      prize: '₹20,000'
    },
    {
      event: 'Webcraft: NextGen Dev',
      category: 'Technical',
      first: 'Team Antigravity',
      firstCollege: 'SGSITS Indore',
      second: 'Dev Dudes',
      secondCollege: 'IIT Indore',
      prize: '₹15,000'
    },
  ]
};

const hallOfFame = [
  { name: 'Nikhil Saxena', award: 'Aayam 25 MVP Developer', college: 'SGSITS Indore' },
  { name: 'Sameer Khan', award: 'Best Robotics Innovator', college: 'VIT Bhopal' },
  { name: 'Ritu Sen', award: 'Aayam 24 Best Pitcher', college: 'IIT Indore' },
];

export default function WinnersPage() {
  const [activeEdition, setActiveEdition] = useState('Aayam 25');

  const winners = winnersData[activeEdition] || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20 relative overflow-hidden font-sans">
      {/* Background radial glows */}
      <div className="absolute top-[15%] left-[-10%] h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[150px] -z-10" />
      <div className="absolute bottom-[10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-cyan-600/5 blur-[150px] -z-10" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 -z-20" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/20 text-xs font-semibold text-violet-300 mb-4 tracking-wider uppercase">
            <Trophy className="h-3.5 w-3.5 text-amber-400 animate-bounce" /> Hall of Champions
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight mb-4">
            Aayam <span className="gradient-text">Past Winners</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Celebrating the champions of previous Aayam iterations who pushed the boundaries of creativity and technology.
          </p>
        </div>

        {/* Edition Tabs */}
        {editions.length > 1 && (
          <div className="flex justify-center gap-3 mb-12">
            {editions.map((edition) => {
              const isActive = activeEdition === edition;
              return (
                <button
                  key={edition}
                  onClick={() => setActiveEdition(edition)}
                  className={`relative px-6 py-2.5 text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-violet-600 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeEditionTab"
                      className="absolute inset-0 bg-violet-500/10 rounded-xl -z-10 border border-violet-500/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {edition}
                </button>
              );
            })}
          </div>
        )}

        {/* Winners Grid */}
        <motion.div 
          layout
          className="grid gap-6 md:grid-cols-2 mb-20"
        >
          <AnimatePresence mode="popLayout">
            {winners.map((w, idx) => (
              <motion.div
                key={`${activeEdition}-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="glass rounded-3xl p-6 border border-slate-900/60 hover:border-violet-500/20 relative overflow-hidden group transition-all duration-300"
              >
                {/* Accent glow corner */}
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-violet-500/10 to-transparent pointer-events-none" />
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                      {w.category} Category
                    </span>
                    <h3 className="font-bold text-lg text-white font-heading truncate max-w-[260px] sm:max-w-[340px]">
                      {w.event}
                    </h3>
                  </div>
                  <span className="rounded-lg bg-amber-950/30 border border-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-400">
                    {w.prize} Pool
                  </span>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.05)]">
                      <Trophy className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Winner (1st)</span>
                      <p className="font-extrabold text-slate-200 text-sm">{w.first}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Landmark className="h-3 w-3" /> {w.firstCollege}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-400/10 border border-slate-400/20 text-slate-300">
                      <Award className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Runner Up (2nd)</span>
                      <p className="font-bold text-slate-300 text-sm">{w.second}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Landmark className="h-3 w-3" /> {w.secondCollege}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Hall of Fame List */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-900 relative overflow-hidden max-w-4xl mx-auto">
          <div className="absolute top-0 right-0 h-32 w-32 bg-cyan-600/5 blur-2xl pointer-events-none" />
          <h2 className="text-xl sm:text-2xl font-black font-heading mb-6 text-white flex items-center gap-2">
            <Star className="h-6 w-6 text-cyan-400 animate-pulse" /> MVP Honors & Special Awards
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-3">
            {hallOfFame.map((f, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900 flex flex-col justify-between group hover:border-slate-800/80 transition-all"
              >
                <div>
                  <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider border border-cyan-500/20 px-2 py-0.5 rounded bg-cyan-950/20 block w-fit mb-3">
                    {f.award}
                  </span>
                  <h3 className="font-bold text-white text-base leading-tight mb-1 group-hover:text-cyan-300 transition-colors">
                    {f.name}
                  </h3>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {f.college}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
