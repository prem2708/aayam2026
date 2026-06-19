import { Router } from 'express';
import { validateBody, validateQuery } from '../middleware/validate';
import { eventSchema, eventQuerySchema, updateEventSchema } from '../validators/schemas';
import { adminAuth, requireRole } from '../middleware/adminAuth';
import * as events from '../controllers/events.controller';

const router = Router();

router.get('/', validateQuery(eventQuerySchema), (req, res, next) =>
  events.listEvents(req, res).catch(next)
);
router.get('/admin/all', adminAuth, requireRole('admin', 'super_admin', 'event_manager'), (req, res, next) =>
  events.adminListEvents(req, res).catch(next)
);
router.get('/:slug', (req, res, next) => events.getEventBySlug(req, res).catch(next));
router.post('/', adminAuth, requireRole('admin', 'super_admin', 'event_manager'), validateBody(eventSchema), (req, res, next) =>
  events.createEvent(req, res).catch(next)
);
router.patch('/:id', adminAuth, requireRole('admin', 'super_admin', 'event_manager'), validateBody(updateEventSchema), (req, res, next) =>
  events.updateEvent(req, res).catch(next)
);
router.delete('/:id', adminAuth, requireRole('admin', 'super_admin'), (req, res, next) =>
  events.deleteEvent(req, res).catch(next)
);
router.patch('/:id/status', adminAuth, requireRole('admin', 'super_admin', 'event_manager'), (req, res, next) =>
  events.updateEventStatus(req, res).catch(next)
);
router.post('/:id/duplicate', adminAuth, requireRole('admin', 'super_admin', 'event_manager'), (req, res, next) =>
  events.duplicateEvent(req, res).catch(next)
);
router.get('/:id/registrations', adminAuth, requireRole('admin', 'super_admin', 'event_manager', 'volunteer'), (req, res, next) =>
  events.getEventRegistrations(req, res).catch(next)
);
router.get('/:id/export', adminAuth, requireRole('admin', 'super_admin', 'event_manager'), (req, res, next) =>
  events.exportRegistrations(req, res).catch(next)
);

export default router;
