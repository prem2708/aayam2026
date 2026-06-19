import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(date));
}

export const CATEGORY_LABELS: Record<string, string> = {
  technical: 'Technical', cultural: 'Cultural', gaming: 'Gaming', workshop: 'Workshop', hackathon: 'Hackathon',
};

export const STATUS_COLORS: Record<string, string> = {
  open: 'bg-emerald-500/20 text-emerald-400',
  closed: 'bg-zinc-500/20 text-zinc-400',
  draft: 'bg-amber-500/20 text-amber-400',
  ongoing: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-purple-500/20 text-purple-400',
  cancelled: 'bg-red-500/20 text-red-400',
};
