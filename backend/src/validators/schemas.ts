import { z } from 'zod';

export const registerProfileSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(2).max(100),
  college: z.string().min(2).max(200),
  branch: z.string().max(100).optional(),
  year: z.number().int().min(1).max(6).optional(),
  phone: z.string().max(20).optional(),
});

export const updateProfileSchema = registerProfileSchema.partial();

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const adminVerify2faSchema = z.object({
  tempToken: z.string(),
  code: z.string().length(6),
});

export const createAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  name: z.string().min(2),
  role: z.enum(['volunteer', 'event_manager', 'admin', 'super_admin']),
});

export const updateAdminSchema = z.object({
  email: z.string().email().optional(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number')
    .optional()
    .or(z.literal('')),
  name: z.string().min(2).optional(),
  role: z.enum(['volunteer', 'event_manager', 'admin', 'super_admin']).optional(),
});


const isoDateTime = z.preprocess((val) => {
  if (typeof val === 'string' && val.trim() !== '') {
    const d = new Date(val);
    return !isNaN(d.getTime()) ? d.toISOString() : val;
  }
  return val;
}, z.string().datetime());

export const eventSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200).optional(),
  category: z.enum(['technical', 'cultural', 'gaming', 'workshop', 'hackathon']),
  description: z.string().min(10),
  rules: z.string().optional().nullable(),
  poster_url: z.string().url().optional().nullable().or(z.literal('')),
  poster_file_id: z.string().optional().nullable(),
  banner_url: z.string().url().optional().nullable().or(z.literal('')),
  banner_file_id: z.string().optional().nullable(),
  payment_qr_url: z.string().url().optional().nullable().or(z.literal('')),
  payment_qr_file_id: z.string().optional().nullable(),
  bank_name: z.string().optional().nullable(),
  bank_account_no: z.string().optional().nullable(),
  bank_ifsc: z.string().optional().nullable(),
  bank_recipient_name: z.string().optional().nullable(),
  whatsapp_link: z.string().url().optional().nullable().or(z.literal('')),
  venue: z.string().optional().nullable(),
  event_start_at: isoDateTime,
  event_end_at: isoDateTime,
  reg_start_at: isoDateTime,
  reg_end_at: isoDateTime,
  is_team_event: z.boolean().default(false),
  min_team_size: z.number().int().min(1).default(1),
  max_team_size: z.number().int().min(1).default(1),
  participant_cap: z.number().int().positive().optional().nullable(),
  amount: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val.trim() === '') return null;
      return Number(val);
    }
    return val;
  }, z.number().int().nonnegative().optional().nullable()),
  requires_approval: z.boolean().default(false),
  allow_cancellation: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  status: z.enum(['draft', 'open', 'closed', 'ongoing', 'completed', 'cancelled']).default('draft'),
  prizes: z.record(z.string(), z.string()).optional(),
  coordinators: z.array(z.object({ name: z.string(), contact: z.string().optional() })).optional(),
});

export const updateEventSchema = eventSchema.partial();

export const eventQuerySchema = z.object({
  category: z.enum(['technical', 'cultural', 'gaming', 'workshop', 'hackathon']).optional(),
  status: z.enum(['open', 'closed', 'ongoing', 'completed']).optional(),
  q: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export const registerSchema = z.object({
  event_id: z.string().uuid(),
  team_name: z.string().min(2).max(50).optional(),
  team_members: z.array(z.string()).optional(),
  payment_proof_url: z.string().url().optional().nullable().or(z.literal('')),
  payment_proof_file_id: z.string().optional().nullable(),
});

export const joinTeamSchema = z.object({
  join_code: z.string().length(6),
  event_id: z.string().uuid(),
  payment_proof_url: z.string().url().optional().nullable().or(z.literal('')),
  payment_proof_file_id: z.string().optional().nullable(),
});

export const scanSchema = z.object({
  qr_token: z.string().min(1),
});

export const announcementSchema = z.object({
  title: z.string().min(1, 'Title must be at least 1 character').max(200),
  body: z.string().min(1, 'Message must be at least 1 character'),
  scope: z.enum(['all', 'event', 'category']),
  event_id: z.string().uuid().optional(),
  category: z.enum(['technical', 'cultural', 'gaming', 'workshop', 'hackathon']).optional(),
  scheduled_at: z.string().datetime().optional(),
});
