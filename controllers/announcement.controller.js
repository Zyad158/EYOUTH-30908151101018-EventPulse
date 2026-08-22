const Event = require('../models/event.model');
const Message = require('../models/message.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/announcements (admin only)
exports.createAnnouncement = asyncHandler(async (req, res, next) => {
  const { event: eventId, text } = req.body;

  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const message = await Message.create({
    event: eventId,
    sender: req.user.id,
    text,
  });

  const populatedMessage = await message.populate('sender', 'name email');

  const io = req.app.get('io');
  if (io) {
    io.to(eventId).emit('announcement', populatedMessage);
  }

  res.status(201).json({ status: 'success', data: populatedMessage });
});

// GET /api/announcements/:eventId
exports.getAnnouncementHistory = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const messages = await Message.find({ event: eventId })
    .populate('sender', 'name email')
    .sort({ createdAt: 1 });

  res.status(200).json({ status: 'success', total: messages.length, data: messages });
});
