'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, Users, ScanLine, TrendingUp } from 'lucide-react';
import { adminFetch, DashboardStats } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#7c3aed', '#0891b2', '#ec4899', '#f59e0b', '#10b981'];

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await adminFetch<DashboardStats>('/admin/dashboard');
      if (!res.success || !res.data) {
        throw new Error(res.error?.message || 'Failed to fetch dashboard stats');
      }
      return res.data;
    },
  });

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await adminFetch<{ dailyRegistrations: { date: string; count: number }[]; collegeBreakdown: { college: string; count: number }[]; topEvents: { title: string; count: number }[] }>('/admin/analytics');
      if (!res.success || !res.data) {
        throw new Error(res.error?.message || 'Failed to fetch analytics');
      }
      return res.data;
    },
    refetchInterval: 5 * 60 * 1000,
  });

  const cards = [
    { label: 'Total Events', value: stats?.totalEvents ?? '—', icon: Calendar, color: 'from-violet-600 to-purple-600' },
    { label: 'Registrations', value: stats?.totalRegistrations ?? '—', icon: Users, color: 'from-cyan-600 to-blue-600' },
    { label: 'Check-ins Today', value: stats?.checkinsToday ?? '—', icon: ScanLine, color: 'from-emerald-600 to-teal-600' },
    { label: 'Revenue', value: `₹${stats?.revenue ?? 0}`, icon: TrendingUp, color: 'from-amber-600 to-orange-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${color} mb-3`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-slate-400">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-xl p-5">
          <h2 className="font-semibold mb-4">Registration Trend (30 days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics?.dailyRegistrations || []}>
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#161223', border: '1px solid #2e2640' }} />
              <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-xl p-5">
          <h2 className="font-semibold mb-4">College Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={(analytics?.collegeBreakdown || []).slice(0, 5)} dataKey="count" nameKey="college" cx="50%" cy="50%" outerRadius={90} label={(props) => `${props.name ?? ''} ${(((props.percent ?? 0) * 100).toFixed(0))}%`}>
                {(analytics?.collegeBreakdown || []).slice(0, 5).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#161223', border: '1px solid #2e2640' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
