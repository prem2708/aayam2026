'use client';

import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030014]">
      {/* Background Grids & Orbs */}
      <div className="absolute inset-0 grid-bg opacity-30 -z-10" />
      <div className="absolute h-[250px] w-[250px] rounded-full bg-violet-600/10 blur-[80px] -z-10 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center text-center space-y-6"
      >
        {/* Glowing loader logo */}
        <div className="relative flex items-center justify-center">
          {/* Rotating outer ring */}
          <div className="absolute h-16 w-16 rounded-2xl border-2 border-violet-500/20 border-t-violet-400 animate-spin" />
          {/* Pulse center logo */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-black tracking-widest uppercase text-white font-heading">
            Aayam<span className="gradient-text">TechFest</span>
          </h2>
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium font-sans">
            <Loader2 className="h-3 w-3 animate-spin text-cyan-400" />
            Loading environment...
          </div>
        </div>
      </motion.div>
    </div>
  );
}
