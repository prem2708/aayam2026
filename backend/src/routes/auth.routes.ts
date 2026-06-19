import { Router } from 'express';
import { clerkAuth } from '../middleware/clerkAuth';
import { validateBody } from '../middleware/validate';
import { registerProfileSchema, updateProfileSchema } from '../validators/schemas';
import * as auth from '../controllers/auth.controller';

const router = Router();

router.post('/register', clerkAuth, validateBody(registerProfileSchema), (req, res, next) =>
  auth.registerProfile(req, res).catch(next)
);
router.get('/me', clerkAuth, (req, res, next) => auth.getProfile(req, res).catch(next));
router.patch('/me', clerkAuth, validateBody(updateProfileSchema), (req, res, next) =>
  auth.updateProfile(req, res).catch(next)
);

export default router;
