'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { adminFetch, setAdminToken, setAdminUser } from '@/lib/api';
import { useAuth } from '@/components/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refresh } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminFetch<{ requires2FA?: boolean; tempToken?: string; token?: string; admin?: { id: string; email: string; name: string; role: string } }>(
        '/admin/auth/login',
        { method: 'POST', body: JSON.stringify({ email, password }) }
      );
      if (!res.success) throw new Error(res.error?.message);

      if (res.data?.requires2FA) {
        setRequires2FA(true);
        setTempToken(res.data.tempToken || '');
        toast.info('Enter your 2FA code');
        return;
      }

      if (res.data?.token && res.data.admin) {
        setAdminToken(res.data.token);
        setAdminUser(res.data.admin);
        refresh();
        router.push('/dashboard');
        toast.success('Welcome back!');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handle2FA(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminFetch<{ token: string; admin: { id: string; email: string; name: string; role: string } }>(
        '/admin/auth/verify-2fa',
        { method: 'POST', body: JSON.stringify({ tempToken, code }) }
      );
      if (!res.success) throw new Error(res.error?.message);
      setAdminToken(res.data!.token);
      setAdminUser(res.data!.admin);
      refresh();
      router.push('/dashboard');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '2FA verification failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-72 w-72 rounded-full bg-cyan-600/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 mb-4">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-1">Aayam TechFest Management</p>
        </div>

        {!requires2FA ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg bg-slate-900/80 border border-slate-700 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg bg-slate-900/80 border border-slate-700 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Lock className="h-4 w-4" /> Sign In</>}
            </button>
          </form>
        ) : (
          <form onSubmit={handle2FA} className="space-y-4">
            <div className="text-center mb-4">
              <ShieldCheck className="h-10 w-10 mx-auto text-violet-400 mb-2" />
              <p className="text-sm text-slate-400">Enter the 6-digit code from your authenticator app</p>
            </div>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} placeholder="000000" className="w-full rounded-lg bg-slate-900/80 border border-slate-700 px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
            <button type="submit" disabled={loading || code.length !== 6} className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 py-3 font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify'}
            </button>
            <button type="button" onClick={() => setRequires2FA(false)} className="w-full text-sm text-slate-500 hover:text-slate-300">Back to login</button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
