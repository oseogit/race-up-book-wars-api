// The shape of a good request. Rules come from the data dictionary:
//   question_sets.title        VARCHAR(150) NOT NULL
//   question_sets.description  TEXT, may be NULL
//   question_sets.subject      VARCHAR(100) NOT NULL
//   question_sets.grade_level  VARCHAR(50)  NOT NULL
// A validator looks only at the request. It never asks the database.
const { body, param } = require('express-validator');

const MAX_INT = 2147483647; // the largest value an INTEGER column can hold

const idParam = param('id')
  .isInt({ min: 1, max: MAX_INT }).withMessage('id must be a positive whole number')
  .toInt();

const title = () => body('title')
  .exists().withMessage('title is required')
  .bail()
  .isString().withMessage('title must be text')
  .bail()
  .trim()
  .isLength({ min: 3, max: 150 }).withMessage('title must be 3 to 150 characters long');

// null is a real value here ("clear the description"), so only undefined counts as "not sent".
const description = () => body('description')
  .optional({ values: 'undefined' })
  .custom((value) => value === null || typeof value === 'string')
  .withMessage('description must be text or null');

const subject = () => body('subject')
  .exists().withMessage('subject is required')
  .bail()
  .isString().withMessage('subject must be text')
  .bail()
  .trim()
  .isLength({ min: 2, max: 100 }).withMessage('subject must be 2 to 100 characters long');

const gradeLevel = () => body('grade_level')
  .exists().withMessage('grade_level is required')
  .bail()
  .isString().withMessage('grade_level must be text')
  .bail()
  .trim()
  .isLength({ min: 1, max: 50 }).withMessage('grade_level must be 1 to 50 characters long');

const FIELDS = ['title', 'description', 'subject', 'grade_level'];

const createQuestionSetRules = [title(), description(), subject(), gradeLevel()];

// PATCH changes only what is sent: every field is optional, but not all of them at once.
const updateQuestionSetRules = [
  idParam,
  title().optional(),
  description(),
  subject().optional(),
  gradeLevel().optional(),
  body().custom((value) => {
    const sent = Object.keys(value || {});
    if (!sent.some((key) => FIELDS.includes(key))) {
      throw new Error(`send at least one of: ${FIELDS.join(', ')}`);
    }
    return true;
  }),
];

const questionSetIdRules = [idParam];

module.exports = { createQuestionSetRules, updateQuestionSetRules, questionSetIdRules };
