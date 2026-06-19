'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { Edit2, Trash2, Search, X, Loader2 } from 'lucide-react';
import { adminFetch } from '@/lib/api';

interface StudentUser {
  id: string;
  email: string;
  name: string;
  college: string;
  branch?: string;
  year?: number;
  phone?: string;
  created_at: string;
}

export default function StudentsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editingStudent, setEditingStudent] = useState<StudentUser | null>(null);
  
  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: '',
    college: '',
    branch: '',
    year: 1,
    phone: '',
  });

  // Fetch student users
  const { data: res, isLoading } = useQuery({
    queryKey: ['students-list', search, page],
    queryFn: async () => {
      const query = `?page=${page}&limit=10${search ? `&q=${encodeURIComponent(search)}` : ''}`;
      const res = await adminFetch<StudentUser[]>(`/admin/users${query}`);
      return res;
    },
  });

  const students = res?.data || [];
  const total = (res?.meta?.total as number) || 0;
  const totalPages = Math.ceil(total / 10);

  // Edit Mutation
  const editMutation = useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...editForm,
          year: editForm.year ? Number(editForm.year) : null,
        }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students-list'] });
      setEditingStudent(null);
      toast.success('Student profile updated');
    },
    onError: () => toast.error('Update failed'),
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminFetch(`/admin/users/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students-list'] });
      toast.success('Student deleted');
    },
    onError: (e: any) => toast.error(e.message || 'Delete failed'),
  });

  const handleStartEdit = (student: StudentUser) => {
    setEditingStudent(student);
    setEditForm({
      name: student.name || '',
      college: student.college || '',
      branch: student.branch || '',
      year: student.year || 1,
      phone: student.phone || '',
    });
  };

  const inputClass = 'w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Students Directory</h1>
        <div className="relative w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, college..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>
      </div>

      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="glass rounded-xl p-6 w-full max-w-md space-y-4 relative">
            <button
              onClick={() => setEditingStudent(null)}
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
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">College</label>
                <input
                  type="text"
                  value={editForm.college}
                  onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Branch</label>
                <input
                  type="text"
                  value={editForm.branch}
                  onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Year</label>
                  <select
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: Number(e.target.value) })}
                    className={inputClass}
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
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => editMutation.mutate(editingStudent.id)}
              disabled={editMutation.isPending}
              className="w-full rounded-xl bg-violet-600 py-2.5 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {editMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-slate-400">Loading students...</p>
      ) : !students.length ? (
        <p className="text-slate-400">No students registered yet.</p>
      ) : (
        <div className="space-y-4">
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700 text-slate-400">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">College</th>
                  <th className="text-left p-3">Branch & Year</th>
                  <th className="text-left p-3">Phone</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                    <td className="p-3 font-medium text-slate-200">{student.name}</td>
                    <td className="p-3 text-slate-400">{student.email}</td>
                    <td className="p-3 text-slate-400">{student.college}</td>
                    <td className="p-3 text-slate-400">
                      {student.branch || 'N/A'} {student.year ? `(Year ${student.year})` : ''}
                    </td>
                    <td className="p-3 text-slate-400">{student.phone || 'N/A'}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleStartEdit(student)}
                        className="inline-flex rounded-lg border border-slate-700 p-1.5 hover:bg-slate-800 text-slate-300"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          confirm('Delete this user? This will also remove all their registrations, bookmarks, and teams they lead.') &&
                          deleteMutation.mutate(student.id)
                        }
                        className="inline-flex rounded-lg border border-red-500/20 p-1.5 hover:bg-red-500/10 text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 text-sm text-slate-400">
              <span>Total: {total} students</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 rounded border border-slate-800 disabled:opacity-50"
                >
                  Prev
                </button>
                <span>{page} / {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 rounded border border-slate-800 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
