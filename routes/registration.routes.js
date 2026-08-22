const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const validate = require('../middleware/validate');
const {
  createRegistrationValidator,
  registrationIdParamValidator,
} = require('../middleware/validators');
const ctrl = require('../controllers/registration.controller');

/**
 * @openapi
 * /api/registrations:
 *   post:
 *     summary: Register the current user for an event
 *     tags: [Registrations]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [event]
 *             properties:
 *               event: { type: string }
 *     responses:
 *       201: { description: Registration created }
 *       400: { description: Already registered or event full }
 *       401: { description: Not authenticated }
 *       404: { description: Event not found }
 */
router.post('/', requireAuth, createRegistrationValidator, validate, ctrl.registerForEvent);

/**
 * @openapi
 * /api/registrations/my:
 *   get:
 *     summary: Get the events the current user is registered for
 *     tags: [Registrations]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of the current user's registrations }
 *       401: { description: Not authenticated }
 */
router.get('/my', requireAuth, ctrl.getMyRegistrations);

/**
 * @openapi
 * /api/registrations/{id}:
 *   delete:
 *     summary: Cancel a registration (owner only)
 *     tags: [Registrations]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Registration cancelled }
 *       401: { description: Not authenticated }
 *       403: { description: Not the owner of this registration }
 *       404: { description: Registration not found }
 */
router.delete('/:id', requireAuth, registrationIdParamValidator, validate, ctrl.cancelRegistration);

module.exports = router;
