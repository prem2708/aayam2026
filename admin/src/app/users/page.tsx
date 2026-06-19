'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { adminFetch, getAdminUser } from '@/lib/api';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'event_manager' });
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name: string; role: string } | null>(null);

  // Edit State
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
  });

  useEffect(() => {
    setCurrentUser(getAdminUser());
  }, []);

  const { data: admins } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await adminFetch<AdminUser[]>('/admin/admin-users')).data || [],
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch('/admin/auth/users', { method: 'POST', body: JSON.stringify(form) });
      if (!res.success) {
        throw new Error(res.error?.message || 'Failed to create admin');
      }
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      setShowForm(false);
      setForm({ email: '', password: '', name: '', role: 'event_manager' });
      toast.success('Admin created');
    },
    onError: (e: any) => toast.error(e.message || 'Failed to create admin'),
  });

  const editMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminFetch(`/admin/admin-users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          role: editForm.role,
          password: editForm.password || undefined,
        }),
      });
      if (!res.success) {
        throw new Error(res.error?.message || 'Update failed');
      }
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      setEditingAdmin(null);
      toast.success('Admin updated successfully');
    },
    onError: (e: any) => toast.error(e.message || 'Update failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminFetch(`/admin/admin-users/${id}`, { method: 'DELETE' });
      if (!res.success) {
        throw new Error(res.error?.message || 'Delete failed');
      }
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Admin deleted successfully');
    },
    onError: (e: any) => toast.error(e.message || 'Delete failed'),
  });

  const handleStartEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setEditForm({
      name: admin.name || '',
      email: admin.email || '',
      role: admin.role || '',
      password: '',
    });
  };

  const inputClass = 'w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Users</h1>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500 transition-colors">
          <Plus className="h-4 w-4" /> Add Admin
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-xl p-6 space-y-4 mb-6 max-w-md">
          {(['email', 'password', 'name'] as const).map((f) => (
            <input
              key={f}
              type={f === 'password' ? 'password' : 'text'}
              placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
              value={form[f]}
              onChange={(e) => setForm({ ...form, [f]: e.target.value })}
              className={inputClass}
            />
          ))}
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass}>
            {['volunteer', 'event_manager', 'admin', 'super_admin'].map((r) => (
              <option key={r} value={r}>{r.replace('_', ' ')}</option>
            ))}
          </select>
          <button onClick={() => createMutation.mutate()} disabled={createMutation.isPending} className="w-full rounded-xl bg-violet-600 py-2.5 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 flex items-center justify-center gap-2">
            {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
          </button>
        </div>
      )}

      {editingAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="glass rounded-xl p-6 w-full max-w-md space-y-4 relative border border-slate-800">
            <button
              onClick={() => setEditingAdmin(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold text-violet-400 mb-2">Edit Administrative User</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className={inputClass}
                  disabled={currentUser?.id === editingAdmin.id && editingAdmin.role === 'super_admin'}
                >
                  {['volunteer', 'event_manager', 'admin', 'super_admin'].map((r) => (
                    <option key={r} value={r}>
                      {r.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                {currentUser?.id === editingAdmin.id && editingAdmin.role === 'super_admin' && (
                  <p className="text-xs text-amber-500 mt-1">You cannot change your own super admin role.</p>
                )}
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep unchanged"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <button
              onClick={() => editMutation.mutate(editingAdmin.id)}
              disabled={editMutation.isPending}
              className="w-full rounded-xl bg-violet-600 py-2.5 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {editMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {admins?.map((a) => {
          const isAdminRole = ['admin', 'event_manager', 'volunteer'].includes(a.role);
          const isSelf = currentUser?.id === a.id;

          return (
            <div key={a.id} className="glass rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-200">{a.name}</p>
                <p className="text-sm text-slate-400">{a.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-violet-600/20 text-violet-300 px-3 py-1 text-xs capitalize">
                  {a.role.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(a)}
                    className="inline-flex rounded-lg border border-slate-700 p-1.5 hover:bg-slate-800 text-slate-300 transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  {isAdminRole && !isSelf && (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete admin "${a.name}"?`)) {
                          deleteMutation.mutate(a.id);
                        }
                      }}
                      className="inline-flex rounded-lg border border-red-500/20 p-1.5 hover:bg-red-500/10 text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
