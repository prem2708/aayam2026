import { Router } from 'express';
import { loginLimiter } from '../middleware/rateLimit';
import { validateBody } from '../middleware/validate';
import {
  adminLoginSchema,
  adminVerify2faSchema,
  createAdminSchema,
} from '../validators/schemas';
import { adminAuth, requireRole } from '../middleware/adminAuth';
import * as auth from '../controllers/auth.controller';

const router = Router();

router.post('/login', loginLimiter, validateBody(adminLoginSchema), (req, res, next) =>
  auth.adminLogin(req, res).catch(next)
);
router.post('/verify-2fa', loginLimiter, validateBody(adminVerify2faSchema), (req, res, next) =>
  auth.adminVerify2FA(req, res).catch(next)
);
router.get('/me', adminAuth, (req, res, next) => auth.getMe(req, res).catch(next));
router.post('/2fa/setup', adminAuth, (req, res, next) => auth.setup2FA(req, res).catch(next));
router.post('/2fa/enable', adminAuth, (req, res, next) => auth.enable2FA(req, res).catch(next));
router.post('/users', adminAuth, requireRole('super_admin'), validateBody(createAdminSchema), (req, res, next) =>
  auth.createAdmin(req, res).catch(next)
);

export default router;
