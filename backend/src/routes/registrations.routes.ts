import { Router } from 'express';
import { clerkAuth } from '../middleware/clerkAuth';
import { adminAuth, requireRole } from '../middleware/adminAuth';
import { validateBody } from '../middleware/validate';
import { registerSchema, joinTeamSchema, scanSchema } from '../validators/schemas';
import * as reg from '../controllers/registrations.controller';

const router = Router();

router.post('/', clerkAuth, validateBody(registerSchema), (req, res, next) =>
  reg.registerForEvent(req, res).catch(next)
);
router.post('/join-team', clerkAuth, validateBody(joinTeamSchema), (req, res, next) =>
  reg.joinTeam(req, res).catch(next)
);
router.get('/me', clerkAuth, (req, res, next) => reg.myRegistrations(req, res).catch(next));
router.get('/bookmarks', clerkAuth, (req, res, next) => reg.myBookmarks(req, res).catch(next));
router.post('/bookmarks', clerkAuth, (req, res, next) => reg.toggleBookmark(req, res).catch(next));
router.get('/:id/ticket', clerkAuth, (req, res, next) => reg.downloadTicket(req, res).catch(next));
router.delete('/:id', clerkAuth, (req, res, next) => reg.cancelRegistration(req, res).catch(next));
router.post('/scan', adminAuth, requireRole('admin', 'super_admin', 'event_manager', 'volunteer'), validateBody(scanSchema), (req, res, next) =>
  reg.scanQr(req, res).catch(next)
);
router.patch('/:id/status', adminAuth, requireRole('admin', 'super_admin', 'event_manager'), (req, res, next) =>
  reg.updateRegistrationStatus(req, res).catch(next)
);
router.patch('/:id/attendance', adminAuth, requireRole('admin', 'super_admin', 'event_manager', 'volunteer'), (req, res, next) =>
  reg.toggleAttendance(req, res).catch(next)
);
router.get('/:id/admin-ticket', adminAuth, requireRole('admin', 'super_admin'), (req, res, next) =>
  reg.adminDownloadTicket(req, res).catch(next)
);

export default router;
