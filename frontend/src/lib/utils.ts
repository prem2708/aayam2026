import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export const FEST_DATE = new Date('2026-10-15T09:00:00');

export const CATEGORY_LABELS: Record<string, string> = {
  technical: 'Technical',
  cultural: 'Cultural',
  gaming: 'Gaming',
  workshop: 'Workshop',
  hackathon: 'Hackathon',
};

export const CATEGORY_COLORS: Record<string, string> = {
  technical: 'from-blue-500 to-cyan-500',
  cultural: 'from-pink-500 to-rose-500',
  gaming: 'from-purple-500 to-violet-500',
  workshop: 'from-amber-500 to-orange-500',
  hackathon: 'from-emerald-500 to-teal-500',
};

export const STATUS_COLORS: Record<string, string> = {
  open: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  closed: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  ongoing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  completed: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  draft: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  confirmed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  cancelled: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
};

export function stripHtml(html?: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}
