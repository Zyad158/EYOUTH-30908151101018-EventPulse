const Event = require('../models/event.model');
const Registration = require('../models/registration.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const ALLOWED_SORT_FIELDS = ['date', 'registrations'];

// GET /api/events
exports.getEvents = asyncHandler(async (req, res) => {
  const { category, city, startDate, endDate, search, sortBy, order, page, limit } = req.query;

  const filter = {};

  if (category) filter.category = category;
  if (city) filter.city = city;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const sortDirection = order === 'desc' ? -1 : 1;
  const sortField = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'date';

  let data;
  let total;

  if (sortField === 'registrations') {
    // Sort by number of registrations using an aggregation pipeline
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'registrations',
          localField: '_id',
          foreignField: 'event',
          as: 'registrations',
        },
      },
      { $addFields: { registrationsCount: { $size: '$registrations' } } },
      { $project: { registrations: 0 } },
      { $sort: { registrationsCount: sortDirection } },
      { $skip: skip },
      { $limit: limitNum },
    ];

    data = await Event.aggregate(pipeline);
    data = await Event.populate(data, { path: 'category' });
    total = await Event.countDocuments(filter);
  } else {
    [data, total] = await Promise.all([
      Event.find(filter)
        .populate('category')
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limitNum),
      Event.countDocuments(filter),
    ]);
  }

  const totalPages = Math.ceil(total / limitNum) || 0;

  res.status(200).json({
    status: 'success',
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    data,
  });
});

// GET /api/events/:id
exports.getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate('category').populate('organizer', 'name email');

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(200).json({ status: 'success', data: event });
});

// POST /api/events (admin only)
exports.createEvent = asyncHandler(async (req, res) => {
  const { title, description, category, date, city, venue, capacity } = req.body;

  const event = await Event.create({
    title,
    description,
    category,
    date,
    city,
    venue,
    capacity,
    organizer: req.user.id,
  });

  res.status(201).json({ status: 'success', data: event });
});

// PATCH /api/events/:id (admin only)
exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('category');

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(200).json({ status: 'success', data: event });
});

// DELETE /api/events/:id (admin only)
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(200).json({ status: 'success', message: 'Event deleted successfully' });
});
