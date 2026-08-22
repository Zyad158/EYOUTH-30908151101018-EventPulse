const Event = require('../models/event.model');
const Registration = require('../models/registration.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/registrations
exports.registerForEvent = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const eventId = req.body.event;

  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const existing = await Registration.findOne({ event: eventId, attendee: userId });
  if (existing) {
    return next(new AppError('You are already registered for this event', 400));
  }

  const currentCount = await Registration.countDocuments({ event: eventId });
  if (currentCount >= event.capacity) {
    return next(new AppError('This event is full', 400));
  }

  const registration = await Registration.create({ event: eventId, attendee: userId });

  res.status(201).json({ status: 'success', data: registration });
});

// GET /api/registrations/my
exports.getMyRegistrations = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const registrations = await Registration.find({ attendee: userId }).populate('event');

  res.status(200).json({ status: 'success', total: registrations.length, data: registrations });
});

// DELETE /api/registrations/:id
exports.cancelRegistration = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const registrationId = req.params.id;

  const registration = await Registration.findById(registrationId);
  if (!registration) {
    return next(new AppError('Registration not found', 404));
  }

  if (registration.attendee.toString() !== userId) {
    return next(new AppError('You can only cancel your own registration', 403));
  }

  await registration.deleteOne();

  res.status(200).json({ status: 'success', message: 'Registration cancelled successfully' });
});
