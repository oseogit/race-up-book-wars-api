
const { body, param } = require('express-validator');

const MAX_INT = 2147483647;

const joinCodeParam = param('code')
  .isString().withMessage('code must be text')
  .bail()
  .trim()
  .matches(/^[1-9][0-9]{5}$/)
  .withMessage('code must be exactly 6 numeric digits and cannot start with 0');

const setId = () => body('set_id')
  .exists().withMessage('set_id is required')
  .bail()
  .isInt({ min: 1, max: MAX_INT })
  .withMessage('set_id must be a positive whole number')
  .toInt();

const timeLimit = () => body('time_limit_sec')
  .exists().withMessage('time_limit_sec is required')
  .bail()
  .isInt({ min: 1, max: 3600 })
  .withMessage('time_limit_sec must be between 1 and 3600 seconds')
  .toInt();

const status = () => body('status')
  .exists().withMessage('status is required')
  .bail()
  .isIn(['RUNNING', 'CLOSED'])
  .withMessage('status must be RUNNING or CLOSED');

const createSessionRules = [setId(), timeLimit()];
const nickname = () => body('nickname')
  .exists().withMessage('nickname is required')
  .bail()
  .isString().withMessage('nickname must be text')
  .bail()
  .trim()
  .isLength({ min: 1, max: 50 })
  .withMessage('nickname must be 1 to 50 characters');

const joinPlayerRules = [joinCodeParam, nickname()];
const updateSessionRules = [joinCodeParam, status()];
const sessionCodeRules = [joinCodeParam];

module.exports = {
  createSessionRules,
  updateSessionRules,
  sessionCodeRules,
  joinPlayerRules,
};