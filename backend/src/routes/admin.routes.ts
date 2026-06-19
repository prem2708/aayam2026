import { Router } from 'express';
import { adminAuth, requireRole } from '../middleware/adminAuth';
import { validateBody } from '../middleware/validate';
import { announcementSchema, updateAdminSchema } from '../validators/schemas';
import * as admin from '../controllers/admin.controller';

const router = Router();

router.get('/dashboard', adminAuth, requireRole('admin', 'super_admin', 'event_manager'), (req, res, next) =>
  admin.getDashboard(req, res).catch(next)
);
router.get('/analytics', adminAuth, requireRole('admin', 'super_admin', 'event_manager'), (req, res, next) =>
  admin.getAnalytics(req, res).catch(next)
);
router.get('/users', adminAuth, requireRole('admin', 'super_admin'), (req, res, next) =>
  admin.listUsers(req, res).catch(next)
);
router.get('/admin-users', adminAuth, requireRole('super_admin'), (req, res, next) =>
  admin.listAdminUsers(req, res).catch(next)
);
router.patch('/admin-users/:id/role', adminAuth, requireRole('super_admin'), (req, res, next) =>
  admin.updateUserRole(req, res).catch(next)
);
router.patch('/admin-users/:id', adminAuth, requireRole('super_admin'), validateBody(updateAdminSchema), (req, res, next) =>
  admin.updateAdminUser(req, res).catch(next)
);
router.delete('/admin-users/:id', adminAuth, requireRole('super_admin'), (req, res, next) =>
  admin.deleteAdminUser(req, res).catch(next)
);
router.post('/announcements', adminAuth, requireRole('admin', 'super_admin', 'event_manager'), validateBody(announcementSchema), (req, res, next) =>
  admin.createAnnouncement(req, res).catch(next)
);
router.get('/announcements', adminAuth, requireRole('admin', 'super_admin', 'event_manager'), (req, res, next) =>
  admin.listAnnouncements(req, res).catch(next)
);
router.delete('/announcements/:id', adminAuth, requireRole('admin', 'super_admin', 'event_manager'), (req, res, next) =>
  admin.deleteAnnouncement(req, res).catch(next)
);
router.get('/announcements/public', (req, res, next) =>
  admin.listPublicAnnouncements(req, res).catch(next)
);
router.get('/events/:id/attendance', adminAuth, requireRole('admin', 'super_admin', 'event_manager', 'volunteer'), (req, res, next) =>
  admin.getEventAttendanceCount(req, res).catch(next)
);
router.patch('/users/:id', adminAuth, requireRole('admin', 'super_admin'), (req, res, next) =>
  admin.updateUser(req, res).catch(next)
);
router.delete('/users/:id', adminAuth, requireRole('super_admin'), (req, res, next) =>
  admin.deleteUser(req, res).catch(next)
);

export default router;
