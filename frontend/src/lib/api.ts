const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<{ success: boolean; data?: T; error?: { message: string }; meta?: Record<string, unknown> }> {
  const { token, ...fetchOptions } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });
  return res.json();
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  rules?: string;
  whatsapp_link?: string | null;
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
  venue?: string;
  event_start_at: string;
  event_end_at: string;
  reg_start_at: string;
  reg_end_at: string;
  is_team_event: boolean;
  min_team_size: number;
  max_team_size: number;
  participant_cap?: number;
  amount?: number;
  status: string;
  is_featured: boolean;
  prizes?: Record<string, string>;
  coordinators?: { name: string; contact?: string }[];
}

export interface Registration {
  id: string;
  event_id: string;
  status: string;
  qr_token: string;
  registration_no?: string;
  transaction_id?: string;
  registered_at: string;
  attended_at?: string;
  events: Event;
  teams?: { name: string; registration_no?: string };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  college: string;
  branch?: string;
  year?: number;
  phone?: string;
  avatar_url?: string;
}
