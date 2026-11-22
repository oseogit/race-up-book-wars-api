const { User } = require('../models');

function findBySchoolId(schoolId) {
  return User.findOne({ where: { school_id: schoolId } });
}

function findById(userId) {
  return User.findByPk(userId);
}

module.exports = {
  findBySchoolId,
  findById,
};