const { Router } = require('express');
const sessionController = require('../controllers/session.controller');
const playerController = require('../controllers/player.controller');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');

const {
  createSessionRules,
  updateSessionRules,
  sessionCodeRules,
  joinPlayerRules,
} = require('../validators/session.validator');

const router = Router();

// Create session
router.post(
  '/',
  requireUser('HOST', 'ADMIN'),
  createSessionRules,
  validate,
  sessionController.createSession
);

// Get session details
router.get(
  '/:code',
  sessionCodeRules,
  validate,
  sessionController.getSession
);

// Update session
router.patch(
  '/:code',
  requireUser('HOST', 'ADMIN'),
  updateSessionRules,
  validate,
  sessionController.updateSession
);

// Join or rejoin session
router.post(
  '/:code/players',
  requireUser(),
  joinPlayerRules,
  validate,
  playerController.joinPlayer
);

// List session players
router.get(
  '/:code/players',
  sessionCodeRules,
  validate,
  playerController.listPlayers
);

module.exports = router;