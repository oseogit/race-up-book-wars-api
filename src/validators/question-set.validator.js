
const { body, param } = require('express-validator');

const createQuestionSetRules = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be between 3 and 150 characters.'),

  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be a string.'),

  body('subject')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Subject must be between 2 and 100 characters.'),

  body('grade_level')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Grade level is required.'),
];

const updateQuestionSetRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid question set ID.'),

  body().custom((value) => {
    const allowedFields = [
      'title',
      'description',
      'subject',
      'grade_level',
    ];

    return Object.keys(value || {}).some((key) =>
      allowedFields.includes(key)
    );
  }).withMessage('At least one valid field is required for update.'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be between 3 and 150 characters.'),

  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be a string.'),

  body('subject')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Subject must be between 2 and 100 characters.'),

  body('grade_level')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Grade level is required.'),
];

const questionSetIdRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid question set ID.'),
];

module.exports = {
  createQuestionSetRules,
  updateQuestionSetRules,
  questionSetIdRules,
};
