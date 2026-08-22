const { body, param } = require('express-validator');

exports.registerValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Email must be valid').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Email must be valid').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.createEventValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isMongoId().withMessage('Category must be a valid MongoId'),
  body('date').isISO8601().toDate().withMessage('Date must be a valid date'),
  body('city').notEmpty().withMessage('City is required'),
  body('venue').notEmpty().withMessage('Venue is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive number'),
];

exports.updateEventValidator = [
  param('id').isMongoId().withMessage('Id must be a valid MongoId'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional().isMongoId().withMessage('Category must be a valid MongoId'),
  body('date').optional().isISO8601().toDate().withMessage('Date must be a valid date'),
  body('city').optional().notEmpty().withMessage('City cannot be empty'),
  body('venue').optional().notEmpty().withMessage('Venue cannot be empty'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive number'),
];

exports.eventIdParamValidator = [param('id').isMongoId().withMessage('Id must be a valid MongoId')];

exports.createRegistrationValidator = [
  body('event').isMongoId().withMessage('event must be a valid MongoId'),
];

exports.registrationIdParamValidator = [param('id').isMongoId().withMessage('Id must be a valid MongoId')];

exports.createAnnouncementValidator = [
  body('event').isMongoId().withMessage('event must be a valid MongoId'),
  body('text').notEmpty().withMessage('text is required'),
];

exports.eventIdRouteParamValidator = [
  param('eventId').isMongoId().withMessage('eventId must be a valid MongoId'),
];
