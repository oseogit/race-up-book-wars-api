const { Router } = require('express');
const questionSetController = require('../controllers/question-set.controller');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');

const {
  createQuestionSetRules,
  updateQuestionSetRules,
  questionSetIdRules,
} = require('../validators/question-set.validator');

const router = Router();

router.use(requireUser('HOST', 'ADMIN'));

router.post(
  '/',
  createQuestionSetRules,
  validate,
  questionSetController.createQuestionSet
);

router.get('/', questionSetController.getQuestionSets);

router.get(
  '/:id',
  questionSetIdRules,
  validate,
  questionSetController.getQuestionSet
);

router.patch(
  '/:id',
  updateQuestionSetRules,
  validate,
  questionSetController.updateQuestionSet
);

router.delete(
  '/:id',
  questionSetIdRules,
  validate,
  questionSetController.deleteQuestionSet
);

module.exports = router;