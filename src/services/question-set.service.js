
const repository = require('../repositories/question-set.repository');

const create = async (data, user) => {
  return repository.create({
    ...data,
    host_user_id: user.user_id,
  });
};

const findAll = async (user) => {
  return repository.findAllByHost(user.user_id);
};

const findOne = async (setId, user) => {
  const questionSet = await repository.findById(setId);

  if (!questionSet) {
    const error = new Error('Question set not found.');
    error.status = 404;
    error.code = 'QUESTION_SET_NOT_FOUND';
    throw error;
  }

  if (questionSet.host_user_id !== user.user_id) {
    const error = new Error('You do not own this question set.');
    error.status = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  return questionSet;
};

const update = async (setId, data, user) => {
  await findOne(setId, user);

  await repository.update(setId, data);

  return repository.findById(setId);
};

const remove = async (setId, user) => {
  await findOne(setId, user);

  try {
    return await repository.remove(setId);
  } catch (err) {
    if (err.parent?.code === '23001') {
      const error = new Error(
        'Cannot delete this question set because it is being used by a game session.'
      );

      error.status = 409;
      error.code = 'QUESTION_SET_IN_USE';

      throw error;
    }

    throw err;
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove,
};
