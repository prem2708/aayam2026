import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';
import { env } from '../config/env';
import { AppError } from '../utils/errors';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export async function clerkAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'Authentication required');
    }
    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token, { secretKey: env.clerkSecretKey });
    req.userId = payload.sub;
    req.userEmail = payload.email as string | undefined;
    next();
  } catch {
    next(new AppError(401, 'Invalid or expired token'));
  }
}

export function optionalClerkAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next();
  verifyToken(authHeader.split(' ')[1], { secretKey: env.clerkSecretKey })
    .then((payload) => {
      req.userId = payload.sub;
      req.userEmail = payload.email as string | undefined;
      next();
    })
    .catch(() => next());
}
