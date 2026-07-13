'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/winners', label: 'Winners' },
  { href: '/about', label: 'About Us' },
  { href: '/help', label: 'Help' },
  { href: '/dashboard', label: 'My Registrations' },
];

export function Footer() {
  return (
    <footer className="mt-auto" style={{ borderTop: '1px solid rgba(96,165,250,0.1)', background: 'rgba(6,8,18,0.95)' }}>

      {/* ── In Collaboration With ── */}
      <div className="py-14" style={{ borderBottom: '1px solid rgba(96,165,250,0.08)', background: 'rgba(8,12,30,0.6)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section label */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="flex-1 max-w-[120px] h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(96,165,250,0.35))' }} />
            <p className="text-xs font-bold uppercase tracking-[0.3em] font-heading"
              style={{ color: 'rgba(96,165,250,0.7)' }}>
              In Collaboration With
            </p>
            <div className="flex-1 max-w-[120px] h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(96,165,250,0.35))' }} />
          </div>

          {/* Partner cards */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">

            {/* RKDF University */}
            <motion.div
              whileHover={{ scale: 1.04, y: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex items-center gap-4 rounded-2xl px-6 py-4"
              style={{
                background: 'rgba(96,165,250,0.06)',
                border: '1px solid rgba(96,165,250,0.14)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
            >
              <img
                src="https://ik.imagekit.io/ioyklag3bb/RKDF-LOGO.png"
                alt="RKDF University"
                className="h-12 sm:h-14 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(96,165,250,0.2))' }}
              />
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
                  style={{ color: 'rgba(245,158,11,0.8)' }}>Host Partner</p>
                <span className="text-base font-bold font-heading text-white">RKDF University</span>
              </div>
            </motion.div>

            {/* Divider */}
            <div className="hidden sm:block h-14 w-px" style={{ background: 'linear-gradient(to bottom, transparent, rgba(96,165,250,0.2), transparent)' }} />

            {/* Aayam Tech Club */}
            <motion.div
              whileHover={{ scale: 1.04, y: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex items-center gap-4 rounded-2xl px-6 py-4"
              style={{
                background: 'rgba(167,139,250,0.06)',
                border: '1px solid rgba(167,139,250,0.14)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
            >
              <img
                src="https://ik.imagekit.io/ioyklag3bb/ChatGPT%20Image%20Jun%2019,%202026,%2001_03_57%20PM.png?updatedAt=1781854543014"
                alt="Aayam Logo"
                className="h-12 sm:h-14 w-auto object-contain rounded-xl shrink-0"
                style={{ filter: 'drop-shadow(0 2px 10px rgba(167,139,250,0.35))' }}
              />
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
                  style={{ color: 'rgba(167,139,250,0.8)' }}>Organized By</p>
                <span className="text-base font-bold font-heading text-white">Aayam Tech Club</span>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <motion.img
                whileHover={{ scale: 1.1, rotate: 15 }}
                src="https://ik.imagekit.io/ioyklag3bb/ChatGPT%20Image%20Jun%2019,%202026,%2001_03_57%20PM.png?updatedAt=1781854543014"
                alt="Aayam Logo"
                className="h-8 w-auto object-contain rounded"
              />
              <span className="font-bold tracking-wider font-heading text-lg">
                Aayam<span className="gradient-text">TechFest</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(232,238,255,0.45)' }}>
              India&apos;s premier technical festival.<br />Innovate. Compete. Celebrate.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-5 font-heading"
              style={{ color: 'rgba(96,165,250,0.7)' }}>
              Important Links
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-200 hover:text-primary"
                    style={{ color: 'rgba(232,238,255,0.5)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-5 font-heading"
              style={{ color: 'rgba(167,139,250,0.7)' }}>
              Contact
            </h3>
            <a
              href="mailto:aayamhackathon@gmail.com"
              className="text-sm mb-2 block hover:text-primary transition-colors"
              style={{ color: 'rgba(232,238,255,0.5)' }}
            >
              
              aayamhackathon@gmail.com
            </a>
            <a
              href="https://instagram.com/aayamtechfest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm mb-5 block hover:text-primary transition-colors"
              style={{ color: 'rgba(232,238,255,0.5)' }}
            >
              
            </a>
            <div className="flex items-center gap-3">
              {/* Email */}
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="mailto:aayamhackathon@gmail.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300"
                style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.18)', color: 'rgba(232,238,255,0.5)' }}
                title="Email"
              >
                <Mail className="h-4 w-4" />
              </motion.a>
              {/* YouTube */}
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://www.youtube.com/@AayamTechFest"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300"
                style={{ background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.18)', color: 'rgba(232,238,255,0.5)' }}
                title="YouTube"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </motion.a>
              {/* WhatsApp */}
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://wa.me/919153449690"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300"
                style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.18)', color: 'rgba(232,238,255,0.5)' }}
                title="WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.054L2 22l5.077-1.331a9.932 9.932 0 004.93 1.306c5.507 0 9.99-4.478 9.99-9.984a9.988 9.988 0 00-2.927-7.06A9.929 9.929 0 0012.012 2zm5.727 14.126c-.25.704-1.25 1.285-1.74 1.34-.49.054-.97.23-3.13-.63a11.442 11.442 0 01-4.95-4.35 6.012 6.012 0 01-1.2-3.188c0-1.685.87-2.52 1.18-2.85.31-.33.68-.41.9-.41.22 0 .44.004.63.01.2.01.46-.07.72.55.27.65.9 2.2.98 2.36.08.16.13.35.03.55-.1.2-.15.33-.3.49-.15.17-.32.38-.45.51-.15.15-.3.32-.13.61.17.3.76 1.25 1.63 2.02.16.14.3.26.46.36.81.67 1.28.53 1.54.23.27-.3.72-.84.97-1.12.25-.28.51-.24.84-.12.33.12 2.11 1 2.47 1.18.36.18.6.27.69.41.09.15.09.84-.16 1.54z"/>
                </svg>
              </motion.a>
              {/* Instagram */}
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://instagram.com/aayamtechfest"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300"
                style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.18)', color: 'rgba(232,238,255,0.5)' }}
                title="Instagram"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: '1px solid rgba(96,165,250,0.08)', color: 'rgba(232,238,255,0.3)' }}
        >
          <span>© {new Date().getFullYear()} Aayam TechFest. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with <span style={{ color: '#f472b6' }}>♥</span> by Aayam Tech Club
          </span>
        </div>
      </div>
    </footer>
  );
}
