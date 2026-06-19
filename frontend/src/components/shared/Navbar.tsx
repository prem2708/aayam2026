'use client';
 
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/winners', label: 'Winners' },
  { href: '/about', label: 'About Us' },
  { href: '/help', label: 'Help' },
  { href: '/dashboard', label: 'My Registrations', auth: true },
];

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-violet-500/10"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
          <img 
            src="https://ik.imagekit.io/ioyklag3bb/RKDF-LOGO.png" 
            alt="RKDF Logo" 
            className="h-7 sm:h-9 w-auto object-contain" 
          />
          <motion.img 
            whileHover={{ scale: 1.1, rotate: 15 }}
            src="https://ik.imagekit.io/ioyklag3bb/ChatGPT%20Image%20Jun%2019,%202026,%2001_03_57%20PM.png" 
            alt="Aayam Logo" 
            className="h-7 sm:h-9 w-auto object-contain rounded" 
          />
          <span className="text-sm sm:text-lg font-bold tracking-wider font-heading">
            Aayam<span className="gradient-text font-black">TechFest</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks
            .filter((l) => !l.auth || isSignedIn)
            .map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative text-sm font-medium transition-colors hover:text-white px-4 py-2 rounded-xl',
                    isActive ? 'text-violet-300 font-semibold' : 'text-slate-400'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-gradient-to-r from-violet-500/15 to-cyan-500/5 rounded-xl -z-10 border border-violet-500/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <motion.div whileHover={{ scale: 1.05 }}>
              <UserButton appearance={{ elements: { avatarBox: 'h-9 w-9 border border-violet-500/30 hover:border-violet-500' } }} />
            </motion.div>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900/50 hover:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-all duration-300">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-[1.02] premium-btn">
                  Register
                </button>
              </SignUpButton>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="md:hidden flex items-center justify-center p-2 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-300 hover:text-white" 
          onClick={() => setOpen(!open)} 
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </motion.button>
      </nav>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl px-5 py-5 space-y-4"
          >
            <div className="flex flex-col gap-2">
              {navLinks
                .filter((l) => !l.auth || isSignedIn)
                .map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      pathname === link.href 
                        ? "bg-violet-600/10 border border-violet-500/20 text-violet-300" 
                        : "text-slate-400 hover:bg-slate-900/50 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
            </div>
            
            {!isSignedIn ? (
              <div className="flex gap-3 pt-2">
                <SignInButton mode="modal">
                  <button className="flex-1 rounded-xl border border-slate-800 bg-slate-900/40 py-2.5 text-sm font-semibold text-slate-300">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 text-sm font-semibold text-white shadow-lg">
                    Register
                  </button>
                </SignUpButton>
              </div>
            ) : (
              <div className="flex justify-between items-center px-4 py-2 bg-slate-900/30 rounded-xl border border-slate-800/50">
                <span className="text-sm text-slate-400">My Account</span>
                <UserButton appearance={{ elements: { avatarBox: 'h-9 w-9 border border-violet-500/30' } }} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
