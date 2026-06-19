const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export function setAdminToken(token: string) {
  localStorage.setItem('admin_token', token);
}

export function clearAdminToken() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

export function getAdminUser(): { id: string; email: string; name: string; role: string } | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('admin_user');
  return raw ? JSON.parse(raw) : null;
}

export function setAdminUser(user: { id: string; email: string; name: string; role: string }) {
  localStorage.setItem('admin_user', JSON.stringify(user));
}

export async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: { message: string }; meta?: Record<string, unknown> }> {
  const token = getAdminToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  
  if (res.status === 401 && token) {
    clearAdminToken();
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  return res.json();
}

export interface DashboardStats {
  totalEvents: number;
  totalRegistrations: number;
  checkinsToday: number;
  revenue: number;
}

export interface AdminEvent {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  event_start_at: string;
  event_end_at: string;
  reg_start_at: string;
  reg_end_at: string;
  is_team_event: boolean;
  min_team_size: number;
  max_team_size: number;
  participant_cap?: number;
  amount?: number;
  is_featured: boolean;
  requires_approval: boolean;
  allow_cancellation: boolean;
  description: string;
  rules?: string;
  whatsapp_link?: string | null;
  venue?: string;
  poster_url?: string;
  poster_file_id?: string;
  banner_url?: string;
  banner_file_id?: string;
  payment_qr_url?: string;
  payment_qr_file_id?: string;
  bank_name?: string;
  bank_account_no?: string;
  bank_ifsc?: string;
  bank_recipient_name?: string;
  [key: string]: unknown;
}
