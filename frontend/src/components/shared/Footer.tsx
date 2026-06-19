import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">Aayam TechFest 2026</span>
            </div>
            <p className="text-sm text-slate-400">
              India&apos;s premier technical festival. Innovate. Compete. Celebrate.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/events" className="hover:text-violet-400 transition-colors">All Events</Link></li>
              <li><Link href="/dashboard" className="hover:text-violet-400 transition-colors">My Registrations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <p className="text-sm text-slate-400">fest@aayamtechfest.com</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Aayam TechFest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
