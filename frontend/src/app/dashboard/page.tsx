'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, ExternalLink, Loader2, Ticket } from 'lucide-react';
import { apiFetch, Registration } from '@/lib/api';
import { STATUS_COLORS, formatDate, cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/');
  }, [isLoaded, isSignedIn, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: async () => {
      const token = await getToken();
      const res = await apiFetch<Registration[]>('/registrations/me', { token: token || undefined });
      if (!res.success) throw new Error(res.error?.message);
      return res.data || [];
    },
    enabled: isSignedIn,
  });

  async function downloadTicket(regId: string) {
    const token = await getToken();
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    const res = await fetch(`${base}/registrations/${regId}/ticket`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${regId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">My Registrations</h1>
        <p className="mt-2 text-slate-400">Track your events and download e-tickets</p>
      </motion.div>

      {!data?.length ? (
        <div className="mt-16 text-center glass rounded-2xl p-12">
          <Ticket className="h-12 w-12 mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 mb-6">No registrations yet</p>
          <Link href="/events" className="inline-flex rounded-xl bg-violet-600 px-6 py-2.5 font-semibold text-white hover:opacity-90">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {data.map((reg, i) => (
            <motion.div
              key={reg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{reg.events.title}</h3>
                  <span className={cn('rounded-full border px-2 py-0.5 text-xs capitalize', STATUS_COLORS[reg.status])}>{reg.status}</span>
                </div>
                <p className="text-sm text-slate-400">{formatDate(reg.events.event_start_at)}</p>
                <p className="text-xs text-violet-400 mt-1">
                  {reg.teams ? `Team: ${reg.teams.name} · ` : ''}
                  Registration Code: {reg.registration_no || 'N/A'}
                </p>
              </div>
              <div className="flex gap-2">
                {reg.status === 'confirmed' && (
                  <button onClick={() => downloadTicket(reg.id)} className="flex items-center gap-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 text-sm font-medium hover:bg-emerald-600/30">
                    <Download className="h-4 w-4" /> E-Ticket
                  </button>
                )}
                {reg.events.whatsapp_link && (
                  <a
                    href={reg.events.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 text-sm font-medium hover:bg-emerald-600/30"
                  >
                    WhatsApp
                  </a>
                )}
                <Link href={`/events/${reg.events.slug}`} className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
                  <ExternalLink className="h-4 w-4" /> View
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
