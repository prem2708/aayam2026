import bcrypt from 'bcryptjs';
import { generateSecret, generateURI, verify } from 'otplib';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/errors';
import {
  signAdminToken,
  signTempToken,
  verifyTempToken,
  AdminAuthRequest,
} from '../middleware/adminAuth';
import { AuthRequest } from '../middleware/clerkAuth';

const SALT_ROUNDS = 12;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

export async function registerProfile(req: AuthRequest, res: import('express').Response) {
  const userId = req.userId!;
  const email = req.userEmail || req.body.email;
  const { name, college, branch, year, phone } = req.body;

  if (!email) {
    throw new AppError(400, 'Email is required to complete profile registration');
  }

  const existing = await prisma.users.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (existing) {
    return res.json({ success: true, data: existing, message: 'Profile already exists' });
  }

  try {
    const data = await prisma.users.create({
      data: {
        id: userId,
        email,
        name,
        college,
        branch,
        year: year ? Number(year) : null,
        phone,
      },
    });
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function getProfile(req: AuthRequest, res: import('express').Response) {
  const data = await prisma.users.findUnique({
    where: { id: req.userId! },
  });
  if (!data) throw new AppError(404, 'Profile not found. Complete registration first.');
  res.json({ success: true, data });
}

export async function updateProfile(req: AuthRequest, res: import('express').Response) {
  try {
    const data = await prisma.users.update({
      where: { id: req.userId! },
      data: {
        ...req.body,
        year: req.body.year ? Number(req.body.year) : undefined,
      },
    });
    res.json({ success: true, data });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function adminLogin(req: import('express').Request, res: import('express').Response) {
  const { email, password } = req.body;

  const admin = await prisma.admin_users.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!admin) throw new AppError(401, 'Invalid email or password');

  if (admin.locked_until && admin.locked_until > new Date()) {
    throw new AppError(429, 'Account temporarily locked. Try again later.');
  }

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) {
    const attempts = admin.failed_login_attempts + 1;
    const updates: Record<string, any> = { failed_login_attempts: attempts };
    if (attempts >= MAX_FAILED_ATTEMPTS) {
      updates.locked_until = new Date(Date.now() + LOCK_DURATION_MS);
    }
    await prisma.admin_users.update({
      where: { id: admin.id },
      data: updates,
    });
    throw new AppError(401, 'Invalid email or password');
  }

  await prisma.admin_users.update({
    where: { id: admin.id },
    data: {
      failed_login_attempts: 0,
      locked_until: null,
      last_login_at: new Date(),
    },
  });

  if (admin.totp_enabled) {
    const tempToken = signTempToken(admin.id);
    return res.json({ success: true, data: { requires2FA: true, tempToken } });
  }

  const token = signAdminToken(admin);
  res.json({
    success: true,
    data: {
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    },
  });
}

export async function adminVerify2FA(req: import('express').Request, res: import('express').Response) {
  const { tempToken, code } = req.body;
  const adminId = verifyTempToken(tempToken);

  const admin = await prisma.admin_users.findUnique({
    where: { id: adminId },
  });

  if (!admin || !admin.totp_secret) throw new AppError(401, '2FA verification failed');

  const valid = (await verify({ secret: admin.totp_secret, token: code })).valid;
  if (!valid) throw new AppError(401, 'Invalid 2FA code');

  const token = signAdminToken(admin);
  res.json({
    success: true,
    data: {
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    },
  });
}

export async function setup2FA(req: AdminAuthRequest, res: import('express').Response) {
  const secret = generateSecret();
  const otpauth = generateURI({
    issuer: 'AayamTechFest Admin',
    label: req.admin!.email,
    secret,
  });

  await prisma.admin_users.update({
    where: { id: req.admin!.id },
    data: { totp_secret: secret },
  });

  res.json({ success: true, data: { secret, otpauth } });
}

export async function enable2FA(req: AdminAuthRequest, res: import('express').Response) {
  const { code } = req.body;
  const admin = await prisma.admin_users.findUnique({
    where: { id: req.admin!.id },
    select: { totp_secret: true },
  });

  if (!admin?.totp_secret) throw new AppError(400, 'Setup 2FA first');
  const valid = (await verify({ secret: admin.totp_secret, token: code })).valid;
  if (!valid) throw new AppError(401, 'Invalid code');

  await prisma.admin_users.update({
    where: { id: req.admin!.id },
    data: { totp_enabled: true },
  });
  res.json({ success: true, message: '2FA enabled' });
}

export async function createAdmin(req: AdminAuthRequest, res: import('express').Response) {
  const { email, password, name, role } = req.body;
  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const data = await prisma.admin_users.create({
      data: {
        email: email.toLowerCase(),
        password_hash: hash,
        name,
        role: role as any,
      },
      select: { id: true, email: true, name: true, role: true, created_at: true },
    });

    await prisma.audit_logs.create({
      data: {
        admin_id: req.admin!.id,
        action: 'create_admin',
        resource_type: 'admin_users',
        resource_id: data.id,
      },
    });

    res.status(201).json({ success: true, data });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function getMe(req: AdminAuthRequest, res: import('express').Response) {
  res.json({ success: true, data: req.admin });
}
