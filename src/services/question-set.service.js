// The rules of Module 1. A service says no by THROWING one of the kit's errors.
// It never touches req or res.
const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden } = require('../errors/app-error');

const NOT_YOURS = 'This question set belongs to another host.';

async function findOrFail(id) {
  const questionSet = await questionSetRepository.findById(id);
  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${id}.`);
  }
  return questionSet;
}

function isOwner(questionSet, user) {
  return questionSet.host_user_id === user.user_id || user.role === 'ADMIN';
}

// Rule: a host sees their own sets. An admin sees every set.
function list(user) {
  return user.role === 'ADMIN'
    ? questionSetRepository.findAll()
    : questionSetRepository.findAllByHost(user.user_id);
}

// Rule: a set can be read by its owner or by an admin.
async function get(id, user) {
  const questionSet = await findOrFail(id);
  if (!isOwner(questionSet, user)) throw forbidden(NOT_YOURS);
  return questionSet;
}

// Rule: the owner is the caller. A client can never choose host_user_id.
function create(data, user) {
  return questionSetRepository.create({ ...data, host_user_id: user.user_id });
}

// Rule: only the owner (or an admin) may change a set.
async function update(id, changes, user) {
  const questionSet = await findOrFail(id);
  if (!isOwner(questionSet, user)) throw forbidden(NOT_YOURS);
  return questionSetRepository.update(questionSet, changes);
}

// Rule: only the owner (or an admin) may delete a set. If a game still uses it,
// the foreign key stops the delete and constraint-map.js turns that into a 409.
async function remove(id, user) {
  const questionSet = await findOrFail(id);
  if (!isOwner(questionSet, user)) throw forbidden(NOT_YOURS);
  await questionSetRepository.remove(questionSet);
}

module.exports = { list, get, create, update, remove };
