const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');
const {
  createEventValidator,
  updateEventValidator,
  eventIdParamValidator,
} = require('../middleware/validators');
const ctrl = require('../controllers/event.controller');

/**
 * @openapi
 * /api/events:
 *   get:
 *     summary: List events with filtering, pagination, sorting and search
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [date, registrations] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paginated list of events }
 *   post:
 *     summary: Create an event (admin only)
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, category, date, city, venue, capacity]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               date: { type: string, format: date-time }
 *               city: { type: string }
 *               venue: { type: string }
 *               capacity: { type: integer }
 *     responses:
 *       201: { description: Event created }
 *       401: { description: Not authenticated }
 *       403: { description: Not an admin }
 *       422: { description: Validation error }
 */
router.get('/', ctrl.getEvents);
router.post('/', requireAuth, requireRole('admin'), createEventValidator, validate, ctrl.createEvent);

/**
 * @openapi
 * /api/events/{id}:
 *   get:
 *     summary: Get a single event populated with category and organizer
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Event details }
 *       404: { description: Event not found }
 *   patch:
 *     summary: Update an event (admin only)
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Event updated }
 *       401: { description: Not authenticated }
 *       403: { description: Not an admin }
 *       404: { description: Event not found }
 *   delete:
 *     summary: Delete an event (admin only)
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Event deleted }
 *       401: { description: Not authenticated }
 *       403: { description: Not an admin }
 *       404: { description: Event not found }
 */
router.get('/:id', eventIdParamValidator, validate, ctrl.getEventById);
router.patch('/:id', requireAuth, requireRole('admin'), updateEventValidator, validate, ctrl.updateEvent);
router.delete('/:id', requireAuth, requireRole('admin'), eventIdParamValidator, validate, ctrl.deleteEvent);

module.exports = router;
