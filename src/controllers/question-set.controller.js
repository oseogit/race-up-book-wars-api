// Three steps per function: read the validated input, call ONE service
// function, choose the status and send. No try/catch: Express 5 passes a
// thrown error to the error handler.
const { matchedData } = require('express-validator');
const questionSetService = require('../services/question-set.service');

// What a client is allowed to see of a question set. Never send the row itself.
function toJson(questionSet) {
  return {
    set_id: questionSet.set_id,
    host_user_id: questionSet.host_user_id,
    title: questionSet.title,
    description: questionSet.description,
    subject: questionSet.subject,
    grade_level: questionSet.grade_level,
  };
}

async function createQuestionSet(req, res) {
  const data = matchedData(req, { locations: ['body'] }); // only fields that passed a rule
  const questionSet = await questionSetService.create(data, req.user);
  res.status(201).json({ question_set: toJson(questionSet) });
}

async function getQuestionSets(req, res) {
  const questionSets = await questionSetService.list(req.user);
  res.status(200).json({ question_sets: questionSets.map(toJson) });
}

async function getQuestionSet(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const questionSet = await questionSetService.get(id, req.user);
  res.status(200).json({ question_set: toJson(questionSet) });
}

async function updateQuestionSet(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const changes = matchedData(req, { locations: ['body'] });
  const questionSet = await questionSetService.update(id, changes, req.user);
  res.status(200).json({ question_set: toJson(questionSet) });
}

async function deleteQuestionSet(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  await questionSetService.remove(id, req.user);
  res.status(204).end();
}

module.exports = {
  createQuestionSet,
  getQuestionSets,
  getQuestionSet,
  updateQuestionSet,
  deleteQuestionSet,
};
