import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/50 mt-auto">
      {/* Collaborators section */}
      <div className="border-b border-slate-850 bg-slate-900/10 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-[0.25em] mb-6">
            In Collaboration With
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-75">
            {/* RKDF University */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <img 
                src="https://ik.imagekit.io/ioyklag3bb/RKDF-LOGO.png" 
                alt="RKDF University" 
                className="h-10 sm:h-12 w-auto object-contain brightness-95"
              />
              <div className="text-left">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Host Partner</p>
                <span className="text-sm font-bold text-slate-300 font-heading">RKDF University</span>
              </div>
            </motion.div>

            {/* divider line */}
            <div className="hidden sm:block h-8 w-px bg-slate-800" />

            {/* Aayam Club */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Organized By</p>
                <span className="text-sm font-bold text-slate-300 font-heading">Aayam Tech Club</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="flex items-center gap-2.5">
                <motion.img 
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  src="https://ik.imagekit.io/ioyklag3bb/ChatGPT%20Image%20Jun%2019,%202026,%2001_03_57%20PM.png" 
                  alt="Aayam Logo" 
                  className="h-8 w-auto object-contain rounded" 
                />
                <span className="font-bold tracking-wider font-heading text-lg">
                  Aayam<span className="gradient-text">TechFest</span>
                </span>
              </Link>
            </div>
            <p className="text-sm text-slate-400">
              India&apos;s premier technical festival. Innovate. Compete. Celebrate.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 mb-4 tracking-wider text-sm uppercase">Important Links</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-violet-400 transition-colors">Home</Link></li>
              <li><Link href="/events" className="hover:text-violet-400 transition-colors">Events</Link></li>
              <li><Link href="/winners" className="hover:text-violet-400 transition-colors">Winners</Link></li>
              <li><Link href="/about" className="hover:text-violet-400 transition-colors">About Us</Link></li>
              <li><Link href="/help" className="hover:text-violet-400 transition-colors">Help</Link></li>
              <li><Link href="/dashboard" className="hover:text-violet-400 transition-colors">Registrations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 mb-4 tracking-wider text-sm uppercase">Contact</h3>
            <p className="text-sm text-slate-400 mb-4">fest@aayamtechfest.com</p>
            <div className="flex items-center gap-4">
              <a 
                href="mailto:fest@aayamtechfest.com" 
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-violet-400 hover:border-violet-500/30 transition-all duration-300"
                title="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all duration-300"
                title="YouTube"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/919153449690" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all duration-300"
                title="WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.054L2 22l5.077-1.331a9.932 9.932 0 004.93 1.306c5.507 0 9.99-4.478 9.99-9.984a9.988 9.988 0 00-2.927-7.06A9.929 9.929 0 0012.012 2zm5.727 14.126c-.25.704-1.25 1.285-1.74 1.34-.49.054-.97.23-3.13-.63a11.442 11.442 0 01-4.95-4.35 6.012 6.012 0 01-1.2-3.188c0-1.685.87-2.52 1.18-2.85.31-.33.68-.41.9-.41.22 0 .44.004.63.01.2.01.46-.07.72.55.27.65.9 2.2.98 2.36.08.16.13.35.03.55-.1.2-.15.33-.3.49-.15.17-.32.38-.45.51-.15.15-.3.32-.13.61.17.3.76 1.25 1.63 2.02.16.14.3.26.46.36.81.67 1.28.53 1.54.23.27-.3.72-.84.97-1.12.25-.28.51-.24.84-.12.33.12 2.11 1 2.47 1.18.36.18.6.27.69.41.09.15.09.84-.16 1.54z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Aayam TechFest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
