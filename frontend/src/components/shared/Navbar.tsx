'use client';
 
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass navbar-glow border-b border-primary/15'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      {/* Animated top shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none overflow-hidden"
        aria-hidden
      >
        <div
          className="h-full w-full"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.8) 20%, rgba(188,19,254,0.9) 50%, rgba(255,0,127,0.8) 80%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'border-shimmer 4s linear infinite',
          }}
        />
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="https://ik.imagekit.io/ioyklag3bb/RKDF-LOGO.png"
            alt="RKDF Logo"
            className="h-7 sm:h-9 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <motion.img
            whileHover={{ scale: 1.12, rotate: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            src="https://ik.imagekit.io/ioyklag3bb/ChatGPT%20Image%20Jun%2019,%202026,%2001_03_57%20PM.png?updatedAt=1781854543014"
            alt="Aayam Logo"
            className="h-7 sm:h-9 w-auto object-contain rounded"
          />
          <span className="text-sm sm:text-lg font-bold tracking-wide font-heading">
            Aayam<span className="gradient-text font-black">TechFest</span>
          </span>

          {/* LIVE indicator */}
          <span className="hidden sm:inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.28)', color: '#f59e0b' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-ring-pulse inline-block" />
            Live
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks
            .filter((l) => !l.auth || isSignedIn)
            .map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative text-sm font-medium transition-all duration-200 hover:text-white px-4 py-2 rounded-xl',
                    isActive ? 'text-primary font-semibold' : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavTab"
                      className="absolute inset-0 rounded-xl -z-10"
                      style={{
                        background: 'rgba(96,165,250,0.08)',
                        border: '1px solid rgba(96,165,250,0.2)',
                        boxShadow: '0 0 12px rgba(96,165,250,0.1)',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <motion.div whileHover={{ scale: 1.06 }}>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      'h-9 w-9 border border-primary/30 hover:border-primary shadow-[0_0_10px_rgba(96,165,250,0.2)] transition-all',
                  },
                }}
              />
            </motion.div>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="rounded-xl border border-primary/15 bg-primary/5 hover:bg-primary/10 hover:border-primary/30 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-primary transition-all duration-300">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-bold text-white transition-all duration-300 animate-glitch-pulse premium-btn"
                  style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 55%, #f472b6 100%)' }}
                >
                  <Zap className="h-3.5 w-3.5" />
                  Register
                </motion.button>
              </SignUpButton>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          className="md:hidden flex items-center justify-center p-2 rounded-xl border border-primary/15 bg-primary/5 text-slate-300 hover:text-primary hover:border-primary/30 transition-all"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-primary/10 bg-background/97 backdrop-blur-2xl"
          >
            <div className="px-5 py-5 space-y-1.5">
              {navLinks
                .filter((l) => !l.auth || isSignedIn)
                .map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all',
                        pathname === link.href
                          ? 'bg-primary/10 border border-primary/20 text-primary shadow-[0_0_12px_rgba(0,240,255,0.1)]'
                          : 'text-slate-400 hover:bg-primary/5 hover:text-white hover:border-primary/10 border border-transparent'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
            </div>

            <div className="px-5 pb-5 flex gap-3">
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <button className="flex-1 rounded-xl border border-primary/15 bg-primary/5 py-2.5 text-sm font-semibold text-slate-300 hover:text-primary transition-all">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white shadow-lg animate-glitch-pulse"
                      style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)' }}>
                      Register
                    </button>
                  </SignUpButton>
                </>
              ) : (
                <div className="flex flex-1 justify-between items-center px-4 py-2.5 bg-primary/5 rounded-xl border border-primary/15">
                  <span className="text-sm text-slate-400">My Account</span>
                  <UserButton appearance={{ elements: { avatarBox: 'h-9 w-9 border border-primary/30' } }} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
