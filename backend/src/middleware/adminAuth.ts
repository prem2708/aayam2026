import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/errors';
import { prisma } from '../config/prisma';

export interface AdminAuthRequest extends Request {
  admin?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

interface AdminJwtPayload {
  sub: string;
  email: string;
  role: string;
  type: 'admin';
}

export async function adminAuth(req: AdminAuthRequest, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'Admin authentication required');
    }
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, env.jwtSecret) as AdminJwtPayload;
    if (payload.type !== 'admin') throw new AppError(401, 'Invalid admin token');

    const admin = await prisma.admin_users.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!admin) throw new AppError(401, 'Admin account not found');

    req.admin = admin;
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError(401, 'Invalid or expired admin token'));
  }
}

export function requireRole(...roles: string[]) {
  return (req: AdminAuthRequest, _res: Response, next: NextFunction) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return next(new AppError(403, 'Insufficient permissions'));
    }
    next();
  };
}

export function signAdminToken(admin: { id: string; email: string; role: string }) {
  return jwt.sign(
    { sub: admin.id, email: admin.email, role: admin.role, type: 'admin' },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn } as SignOptions
  );
}

export function signTempToken(adminId: string) {
  return jwt.sign({ sub: adminId, type: 'admin_2fa' }, env.jwtSecret, { expiresIn: '5m' });
}

export function verifyTempToken(token: string): string {
  const payload = jwt.verify(token, env.jwtSecret) as { sub: string; type: string };
  if (payload.type !== 'admin_2fa') throw new AppError(401, 'Invalid 2FA token');
  return payload.sub;
}
