// The only file that queries question_sets. No decisions here: it returns a
// row, a list, or null, and the service decides what that means.
const { QuestionSet } = require('../models');

function findAll() {
  return QuestionSet.findAll({ order: [['set_id', 'ASC']] });
}

function findAllByHost(hostUserId) {
  return QuestionSet.findAll({
    where: { host_user_id: hostUserId },
    order: [['set_id', 'ASC']],
  });
}

function findById(setId) {
  return QuestionSet.findByPk(setId); // a row, or null
}

function create(data) {
  return QuestionSet.create(data);
}

function update(questionSet, changes) {
  return questionSet.update(changes);
}

function remove(questionSet) {
  return questionSet.destroy();
}

module.exports = { findAll, findAllByHost, findById, create, update, remove };
