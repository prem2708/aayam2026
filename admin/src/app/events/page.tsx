'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Copy, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { adminFetch, AdminEvent } from '@/lib/api';
import { CATEGORY_LABELS, STATUS_COLORS, formatDate, cn } from '@/lib/utils';

export default function EventsPage() {
  const qc = useQueryClient();
  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const res = await adminFetch<AdminEvent[]>('/events/admin/all');
      return res.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminFetch(`/events/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-events'] }); toast.success('Event deleted'); },
    onError: () => toast.error('Delete failed'),
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => adminFetch(`/events/${id}/duplicate`, { method: 'POST' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-events'] }); toast.success('Event duplicated'); },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminFetch(`/events/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-events'] }); toast.success('Status updated'); },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <Link href="/events/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold hover:bg-violet-500">
          <Plus className="h-4 w-4" /> Create Event
        </Link>
      </div>

      {isLoading ? (
        <p className="text-slate-400">Loading...</p>
      ) : !events?.length ? (
        <div className="glass rounded-xl p-12 text-center text-slate-400">No events yet. Create your first event.</div>
      ) : (
        <div className="space-y-3">
          {events.map((event, i) => (
            <motion.div key={event.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{event.title}</h3>
                  <span className={cn('rounded-full px-2 py-0.5 text-xs capitalize', STATUS_COLORS[event.status])}>{event.status}</span>
                  <span className="text-xs text-slate-500">{CATEGORY_LABELS[event.category]}</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">{formatDate(event.event_start_at)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select value={event.status} onChange={(e) => statusMutation.mutate({ id: event.id, status: e.target.value })} className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs capitalize">
                  {['draft', 'open', 'closed', 'ongoing', 'completed', 'cancelled'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <Link href={`/events/${event.id}/edit`} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">Edit</Link>
                <Link href={`/registrations?event=${event.id}`} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">Regs</Link>
                <button onClick={() => duplicateMutation.mutate(event.id)} className="rounded-lg border border-slate-700 p-1.5 hover:bg-slate-800"><Copy className="h-3.5 w-3.5" /></button>
                <button onClick={() => confirm('Delete this event?') && deleteMutation.mutate(event.id)} className="rounded-lg border border-red-500/30 p-1.5 text-red-400 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
