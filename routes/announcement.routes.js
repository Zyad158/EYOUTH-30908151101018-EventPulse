const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');
const {
  createAnnouncementValidator,
  eventIdRouteParamValidator,
} = require('../middleware/validators');
const ctrl = require('../controllers/announcement.controller');

/**
 * @openapi
 * /api/announcements:
 *   post:
 *     summary: Broadcast a live announcement to an event's room (admin only)
 *     tags: [Announcements]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [event, text]
 *             properties:
 *               event: { type: string }
 *               text: { type: string }
 *     responses:
 *       201: { description: Announcement created and broadcast }
 *       401: { description: Not authenticated }
 *       403: { description: Not an admin }
 *       404: { description: Event not found }
 */
router.post('/', requireAuth, requireRole('admin'), createAnnouncementValidator, validate, ctrl.createAnnouncement);

/**
 * @openapi
 * /api/announcements/{eventId}:
 *   get:
 *     summary: Get the announcement history for an event
 *     tags: [Announcements]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Announcement history, oldest to newest }
 */
router.get('/:eventId', eventIdRouteParamValidator, validate, ctrl.getAnnouncementHistory);

module.exports = router;
