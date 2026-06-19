# Aayam TechFest Management Platform

Full-stack fest management with three deployable apps:

| App | Folder | Port | Purpose |
|-----|--------|------|---------|
| **Student Portal** | `frontend/` | 3000 | Event discovery, registration, e-tickets (Clerk auth) |
| **Admin Panel** | `admin/` | 3001 | Event CRUD, analytics, QR scanner (email/password + 2FA) |
| **API Server** | `backend/` | 4000 | REST API, PDF tickets, Supabase DB |

## Stack

- **Frontend**: Next.js 16, Tailwind CSS, Framer Motion, Clerk, TanStack Query
- **Admin**: Next.js 16, Recharts, html5-qrcode scanner
- **Backend**: Node.js 20, Express, Supabase, bcrypt + JWT (admin), Clerk JWT (students)
- **Database**: Supabase PostgreSQL (no Redis, no email automation)

## Quick Start (Local)

### 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run `supabase/schema.sql`
3. Copy **Project URL** and **service_role key** (Settings → API)

### 2. Clerk Setup (Student Auth)

1. Create app at [clerk.com](https://clerk.com)
2. Enable Email + Google OAuth
3. Copy publishable and secret keys

### 3. Backend

```bash
cd backend
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CLERK_SECRET_KEY, JWT_SECRET

npm install
npm run dev          # http://localhost:4000
npm run seed:admin   # Creates admin@aayamtechfest.com / Admin@123456
```

### 4. Frontend (Student Portal)

```bash
cd frontend
cp .env.example .env.local
# Fill in Clerk keys + NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

npm install
npm run dev          # http://localhost:3000
```

### 5. Admin Panel

```bash
cd admin
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

npm install
npm run dev -- -p 3001   # http://localhost:3001
```

Login: `admin@aayamtechfest.com` / `Admin@123456` (change after first login)

## Deployment

### Recommended (Easy)

| Service | Deploy To | Notes |
|---------|-----------|-------|
| `frontend/` | **Vercel** | Set env vars, auto SSL |
| `admin/` | **Vercel** | Separate project, set `robots: noindex` |
| `backend/` | **Railway** or **Render** | Docker or `npm start` |
| Database | **Supabase Cloud** | Already hosted |

### Environment Variables Checklist

**Backend** (`backend/.env`):
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `CLERK_SECRET_KEY`
- `JWT_SECRET` (32+ char random string)
- `FRONTEND_URL`, `ADMIN_URL` (production URLs for CORS)

**Frontend** (`frontend/.env.local`):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`

**Admin** (`admin/.env.local`):
- `NEXT_PUBLIC_API_URL`

### Docker (Backend only)

```bash
cd backend && npm run build
docker compose up -d
```

## Architecture

```
Students → frontend (Clerk) ──┐
                               ├──→ backend (Express) ──→ Supabase
Admins   → admin (JWT)     ───┘
```

- **Students**: Clerk handles signup/OTP/Google OAuth. Backend verifies Clerk JWT.
- **Admins**: Separate `admin_users` table with bcrypt passwords, optional TOTP 2FA, JWT sessions.
- **No Redis**: PDF generation and CSV export run synchronously.
- **No email automation**: Confirmations shown in-app; announcements stored in DB.

## API Base URL

`http://localhost:4000/api/v1`

Key routes:
- `GET /events` — Public event list
- `POST /registrations` — Student register (Clerk token)
- `POST /admin/auth/login` — Admin login
- `POST /registrations/scan` — QR attendance (admin token)

## Security

- Admin: bcrypt (12 rounds), account lockout after 5 failures, optional TOTP 2FA
- Rate limiting on all routes (no Redis — in-memory)
- Helmet security headers, CORS whitelist
- Service role key server-side only

## License

MIT — Aayam TechFest Organizing Committee
