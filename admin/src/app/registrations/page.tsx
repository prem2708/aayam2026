'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { Download, Eye, Edit2, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { adminFetch, AdminEvent } from '@/lib/api';
import { formatDate, cn, STATUS_COLORS } from '@/lib/utils';

function RegistrationsContent() {
  const params = useSearchParams();
  const eventId = params.get('event');
  const qc = useQueryClient();

  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    college: '',
    branch: '',
    year: 1,
    phone: '',
  });

  const { data: events } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => (await adminFetch<AdminEvent[]>('/events/admin/all')).data || [],
  });

  const { data: registrations, isLoading } = useQuery({
    queryKey: ['registrations', eventId],
    queryFn: async () => {
      if (!eventId) return [];
      const res = await adminFetch<Record<string, unknown>[]>(`/events/${eventId}/registrations?limit=100`);
      return res.data || [];
    },
    enabled: !!eventId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await adminFetch(`/registrations/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (!res.success) {
        throw new Error(res.error?.message || 'Failed to update status');
      }
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['registrations', eventId] });
      toast.success('Registration status updated');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    onError: (e: any) => toast.error(e.message || 'Failed to update status'),
  });

  const editUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminFetch(`/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...editForm,
          year: editForm.year ? Number(editForm.year) : null,
        }),
      });
      if (!res.success) {
        throw new Error(res.error?.message || 'Update failed');
      }
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['registrations', eventId] });
      setEditingUser(null);
      toast.success('User profile updated');
    },
    onError: (e: any) => toast.error(e.message || 'Update failed'),
  });

  const handleStartEditUser = (user: any, registrationId: string) => {
    // Falls back to r.user_id if user.id is not returned directly
    const userId = user.id || (registrations?.find((reg: any) => reg.id === registrationId) as any)?.user_id;
    setEditingUser({ ...user, id: userId });
    setEditForm({
      name: user.name || '',
      college: user.college || '',
      branch: user.branch || '',
      year: user.year || 1,
      phone: user.phone || '',
    });
  };

  async function exportExcel() {
    if (!eventId) return;
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${base}/events/${eventId}/export`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (!res.ok) {
        const text = await res.text();
        let message = 'Failed to export registrations';
        try {
          const parsed = JSON.parse(text);
          message = parsed.error?.message || parsed.message || message;
        } catch (_) {}
        throw new Error(message);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `registrations-${eventId}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error(err.message || 'Failed to export registrations');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Registrations</h1>
        {eventId && (
          <button onClick={exportExcel} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 text-sm">
            <Download className="h-4 w-4" /> Export Excel
          </button>
        )}
      </div>

      <select
        value={eventId || ''}
        onChange={(e) => window.location.href = `/registrations?event=${e.target.value}`}
        className="w-full max-w-md rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm mb-6 text-slate-200"
      >
        <option value="">Select an event</option>
        {events?.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
      </select>

      {!eventId ? (
        <p className="text-slate-400">Select an event to view registrations.</p>
      ) : isLoading ? (
        <p className="text-slate-400">Loading...</p>
      ) : !registrations?.length ? (
        <p className="text-slate-400">No registrations yet.</p>
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">College</th>
                <th className="text-left p-3">Team & Members</th>
                <th className="text-left p-3">Payment Proof</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Attendance</th>
                <th className="text-left p-3">Registered</th>
                <th className="text-right p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r: Record<string, any>) => {
                const users = r.users as { id?: string; name?: string; email?: string; phone?: string; college?: string; branch?: string; year?: number } | undefined;
                const teams = r.teams as { name?: string; members?: unknown } | undefined;
                const membersList = Array.isArray(teams?.members) ? (teams.members as string[]) : [];

                return (
                  <tr key={r.id as string} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="p-3 font-medium text-slate-200">
                      <div>
                        <p className="font-semibold text-slate-200">{users?.name}</p>
                        {r.registration_no && <p className="text-xs text-violet-400 font-semibold">Reg ID: {r.registration_no}</p>}
                        <p className="text-xs text-slate-500">{users?.email}</p>
                        {users?.phone && <p className="text-xs text-slate-500">{users.phone}</p>}
                      </div>
                    </td>
                    <td className="p-3 text-slate-400">
                      <div>
                        <p className="text-slate-300">{users?.college}</p>
                        <p className="text-xs text-slate-500">
                          {users?.branch || 'No branch'} {users?.year ? `· Year ${users.year}` : ''}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 text-slate-400">
                      {teams?.name ? (
                        <div>
                          <p className="font-semibold text-slate-300">{teams.name}</p>
                          {membersList.length > 0 && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Members: {membersList.join(', ')}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">Solo</span>
                      )}
                    </td>
                    <td className="p-3">
                      {r.payment_proof_url ? (
                        <a
                          href={r.payment_proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 bg-violet-600/10 border border-violet-500/20 px-2 py-1 rounded"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Proof
                        </a>
                      ) : (
                        <span className="text-xs text-slate-600">None</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={cn('rounded-full px-2 py-0.5 text-xs capitalize', STATUS_COLORS[r.status as string])}>
                        {r.status as string}
                      </span>
                    </td>
                    <td className="p-3">
                      {r.attended_at ? (
                        <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-xs font-semibold">
                          Checked In
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 text-xs font-semibold">
                          Checked Out
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-400">{formatDate(r.registered_at as string)}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5 items-center">
                        <button
                          onClick={() => handleStartEditUser(users, r.id as string)}
                          className="inline-flex rounded-lg border border-slate-700 p-1.5 hover:bg-slate-800 text-slate-300 transition-colors"
                          title="Edit User Profile"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        
                        {r.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => updateStatusMutation.mutate({ id: r.id as string, status: 'confirmed' })}
                              className="px-2 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-[10px] text-white font-semibold transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatusMutation.mutate({ id: r.id as string, status: 'rejected' })}
                              className="px-2 py-1.5 rounded bg-red-600/30 border border-red-500/30 hover:bg-red-500/20 text-[10px] text-red-400 font-semibold transition"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <select
                              value={r.status as string}
                              onChange={(e) => updateStatusMutation.mutate({ id: r.id as string, status: e.target.value })}
                              className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-xs text-slate-300"
                            >
                              {['pending', 'confirmed', 'rejected', 'cancelled'].map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="glass rounded-xl p-6 w-full max-w-md space-y-4 relative border border-slate-800">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold text-violet-400 mb-2">Edit Student Profile</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">College</label>
                <input
                  type="text"
                  value={editForm.college}
                  onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Branch</label>
                <input
                  type="text"
                  value={editForm.branch}
                  onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Year</label>
                  <select
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: Number(e.target.value) })}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  >
                    {[1, 2, 3, 4, 5, 6].map((y) => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => editUserMutation.mutate(editingUser.id)}
              disabled={editUserMutation.isPending}
              className="w-full rounded-xl bg-violet-600 py-2.5 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {editUserMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegistrationsPage() {
  return (
    <Suspense fallback={<p className="text-slate-400">Loading...</p>}>
      <RegistrationsContent />
    </Suspense>
  );
}
