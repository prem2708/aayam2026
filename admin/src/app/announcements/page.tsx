'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Trash2, Loader2 } from 'lucide-react';
import { adminFetch } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { RichTextEditor } from '@/components/RichTextEditor';

export default function AnnouncementsPage() {
  const qc = useQueryClient();
  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: { title: '', body: '', scope: 'all' },
  });

  const { data: announcements } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => (await adminFetch<Record<string, unknown>[]>('/admin/announcements')).data || [],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const res = await adminFetch('/admin/announcements', { method: 'POST', body: JSON.stringify(data) });
      if (!res.success) {
        throw new Error(res.error?.message || 'Failed to post announcement');
      }
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements'] });
      reset();
      toast.success('Announcement posted');
    },
    onError: (e: any) => toast.error(e.message || 'Failed to post'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminFetch(`/admin/announcements/${id}`, { method: 'DELETE' });
      if (!res.success) {
        throw new Error(res.error?.message || 'Failed to delete announcement');
      }
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Announcement deleted');
    },
    onError: (e: any) => toast.error(e.message || 'Failed to delete'),
  });

  const inputClass = 'w-full rounded-lg bg-slate-900/80 border border-slate-700 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50';

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Announcements</h1>
      <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="glass rounded-xl p-6 space-y-4 mb-8">
        <div>
          <label className="text-sm text-slate-300 mb-1 block">Title</label>
          <input {...register('title', { required: true })} className="hidden" />
          <RichTextEditor
            value={watch('title')}
            onChange={(val) => setValue('title', val)}
            placeholder="Announcement title..."
          />
        </div>
        <div>
          <label className="text-sm text-slate-300 mb-1 block">Message</label>
          <textarea {...register('body', { required: true })} className="hidden" />
          <RichTextEditor
            value={watch('body')}
            onChange={(val) => setValue('body', val)}
            placeholder="Announcement message..."
          />
        </div>
        <select {...register('scope')} className={inputClass}>
          <option value="all">All Students</option>
          <option value="event">Event Participants</option>
          <option value="category">Category</option>
        </select>
        <button type="submit" disabled={createMutation.isPending} className="w-full rounded-xl bg-violet-600 py-2.5 font-semibold hover:bg-violet-500 disabled:opacity-50 flex items-center justify-center gap-2">
          {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post Announcement'}
        </button>
      </form>
      <div className="space-y-3">
        {announcements?.map((a) => (
          <div key={a.id as string} className="glass rounded-xl p-4 flex justify-between items-start">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="font-semibold text-slate-200" dangerouslySetInnerHTML={{ __html: a.title as string }} />
              <div className="text-sm text-slate-400 mt-1 leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: a.body as string }} />
              <p className="text-xs text-slate-500 mt-2">{formatDate(a.created_at as string)} · {a.scope as string}</p>
            </div>
            <button
              onClick={() => {
                if (confirm('Delete this announcement?')) {
                  deleteMutation.mutate(a.id as string);
                }
              }}
              disabled={deleteMutation.isPending}
              className="inline-flex rounded-lg border border-red-500/20 p-1.5 hover:bg-red-500/10 text-red-400 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
