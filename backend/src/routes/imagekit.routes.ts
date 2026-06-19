import { Router } from 'express';
import ImageKit from 'imagekit';
import { env } from '../config/env';
import { adminAuth, requireRole } from '../middleware/adminAuth';
import { clerkAuth } from '../middleware/clerkAuth';
import { AppError } from '../utils/errors';

const router = Router();

const imagekit =
  env.imagekitPublicKey && env.imagekitPrivateKey
    ? new ImageKit({
        publicKey: env.imagekitPublicKey,
        privateKey: env.imagekitPrivateKey,
        urlEndpoint: env.imagekitUrlEndpoint,
      })
    : null;

router.get('/auth', clerkAuth, (_req, res, next) => {
  try {
    if (!imagekit) throw new AppError(503, 'ImageKit not configured');
    res.json({ success: true, data: imagekit.getAuthenticationParameters() });
  } catch (e) {
    next(e);
  }
});

router.get('/admin/auth', adminAuth, (_req, res, next) => {
  try {
    if (!imagekit) throw new AppError(503, 'ImageKit not configured');
    res.json({ success: true, data: imagekit.getAuthenticationParameters() });
  } catch (e) {
    next(e);
  }
});

router.delete('/file/:fileId', adminAuth, requireRole('admin', 'super_admin', 'event_manager'), async (req, res, next) => {
  try {
    if (!imagekit) throw new AppError(503, 'ImageKit not configured');
    await imagekit.deleteFile(String(req.params.fileId));
    res.json({ success: true, message: 'File deleted' });
  } catch (e) {
    next(e);
  }
});

export default router;
