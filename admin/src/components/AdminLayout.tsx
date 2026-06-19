'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Users, ScanLine, Megaphone, Shield, LogOut, Menu, X, Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from './auth-context';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'super_admin', 'event_manager'] },
  { href: '/events', label: 'Events', icon: Calendar, roles: ['admin', 'super_admin', 'event_manager'] },
  { href: '/registrations', label: 'Registrations', icon: Users, roles: ['admin', 'super_admin', 'event_manager'] },
  { href: '/students', label: 'Students', icon: Users, roles: ['admin', 'super_admin'] },
  { href: '/scanner', label: 'QR Scanner', icon: ScanLine, roles: ['admin', 'super_admin', 'event_manager', 'volunteer'] },
  { href: '/announcements', label: 'Announcements', icon: Megaphone, roles: ['admin', 'super_admin', 'event_manager'] },
  { href: '/users', label: 'Admin Users', icon: Shield, roles: ['super_admin'] },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const visibleLinks = links.filter((l) => user && l.roles.includes(user.role));

  return (
    <>
      <button className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg" onClick={() => setOpen(!open)}>
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-border transform transition-transform lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-full flex-col p-4">
          <div className="flex items-center gap-2 px-2 py-4 mb-4">
            <img 
              src="https://ik.imagekit.io/ioyklag3bb/ChatGPT%20Image%20Jun%2019,%202026,%2001_03_57%20PM.png" 
              alt="Aayam Logo" 
              className="h-9 w-auto object-contain rounded" 
            />
            <div>
              <p className="font-bold text-sm">Aayam Admin</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {visibleLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  pathname.startsWith(href)
                    ? 'bg-violet-600/20 text-violet-300'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-border pt-4">
            <p className="px-3 text-xs text-slate-500 truncate mb-2">{user?.email}</p>
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="h-8 w-8 rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (pathname === '/login') return <>{children}</>;
  if (!user) return null;

  return (
    <div className="min-h-screen lg:pl-64">
      <AdminSidebar />
      <main className="p-4 lg:p-8">{children}</main>
    </div>
  );
}
