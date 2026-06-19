import { randomBytes } from 'crypto';

export function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  const bytes = randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function paginate(page = 1, limit = 20) {
  const p = Math.max(1, page);
  const l = Math.min(100, Math.max(1, limit));
  return { from: (p - 1) * l, to: p * l - 1, page: p, limit: l };
}
