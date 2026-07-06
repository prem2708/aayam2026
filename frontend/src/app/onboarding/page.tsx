'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  college: z.string().min(2, 'College required'),
  branch: z.string().optional(),
  year: z.number().int().min(1).max(6).optional(),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function OnboardingPage() {
  const { getToken, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.fullName || '',
    },
  });

  useEffect(() => {
    async function checkProfile() {
      if (!isLoaded) return;
      const token = await getToken();
      const res = await apiFetch('/auth/me', { token: token || undefined });
      if (res.success) router.replace('/dashboard');
    }
    checkProfile();
  }, [isLoaded, getToken, router]);

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    try {
      const token = await getToken();
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify({
          ...data,
          email: user?.primaryEmailAddress?.emailAddress || '',
        }),
      });
      if (!res.success) throw new Error(res.error?.message);
      toast.success('Profile created!');
      router.push('/dashboard');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create profile');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
      <p className="text-slate-400 mb-8 text-sm">One quick step before you can register for events.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 glass rounded-xl p-6">
        {(['name', 'college', 'branch', 'phone'] as const).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-slate-300 mb-1 capitalize">{field}</label>
            <input {...register(field)} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
            {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]?.message}</p>}
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Year</label>
          <select {...register('year')} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50">
            <option value="">Select year</option>
            {[1, 2, 3, 4, 5, 6].map((y) => (
              <option key={y} value={y}>Year {y}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={submitting} className="w-full rounded-xl bg-gradient-to-r from-primary to-accent-secondary py-3 font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2">
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Continue'}
        </button>
      </form>
    </div>
  );
}
