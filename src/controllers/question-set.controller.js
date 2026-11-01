const { matchedData } = require('express-validator');
const questionSetService = require('../services/question-set.service');

const toJson = (record) => record.toJSON();

async function createQuestionSet(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const questionSet = await questionSetService.create(data, req.user);

  res.status(201).json({ question_set: toJson(questionSet) });
}

async function getQuestionSets(req, res) {
  const questionSets = await questionSetService.findAll(req.user);

  res.status(200).json({
    question_sets: questionSets.map(toJson),
  });
}

async function getQuestionSet(req, res) {
  const questionSet = await questionSetService.findOne(
    Number(req.params.id),
    req.user
  );

  res.status(200).json({ question_set: toJson(questionSet) });
}

async function updateQuestionSet(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const questionSet = await questionSetService.update(
    Number(req.params.id),
    data,
    req.user
  );

  res.status(200).json({ question_set: toJson(questionSet) });
}

async function deleteQuestionSet(req, res) {
  await questionSetService.remove(Number(req.params.id), req.user);
  res.status(204).send();
}

module.exports = {
  createQuestionSet,
  getQuestionSets,
  getQuestionSet,
  updateQuestionSet,
  deleteQuestionSet,
};