'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { AuroraBackground } from '@/components/shared/AuroraBackground';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <AuroraBackground variant="page" className="opacity-60" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center text-center space-y-6"
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 rounded-2xl border-2 border-primary/20 border-t-primary animate-spin" />
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-accent-secondary shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] overflow-hidden">
            <motion.img 
              animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              src="https://ik.imagekit.io/ioyklag3bb/ChatGPT%20Image%20Jun%2019,%202026,%2001_03_57%20PM.png" 
              alt="Aayam Logo" 
              className="h-7 w-7 object-contain rounded" 
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-black tracking-widest uppercase text-white font-heading">
            Aayam<span className="gradient-text">TechFest</span>
          </h2>
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium font-sans">
            <Loader2 className="h-3 w-3 animate-spin text-accent" />
            Loading environment...
          </div>
        </div>
      </motion.div>
    </div>
  );
}
