const { QuestionSet } = require('../models');

const create = (data) => QuestionSet.create(data);

const findAllByHost = (hostUserId) =>
  QuestionSet.findAll({
    where: { host_user_id: hostUserId },
    order: [['set_id', 'ASC']],
  });

const findById = (setId) =>
  QuestionSet.findByPk(setId);

const update = (setId, data) =>
  QuestionSet.update(data, {
    where: { set_id: setId },
    returning: true,
  });

const remove = (setId) =>
  QuestionSet.destroy({
    where: { set_id: setId },
  });

module.exports = {
  create,
  findAllByHost,
  findById,
  update,
  remove,
};