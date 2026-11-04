'use strict';

// The X-Demo-User header (and, in Week 12, login) finds an account by school_id,
// so two accounts must never share one. NULL is still allowed more than once.
module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('users', {
      fields: ['school_id'],
      type: 'unique',
      name: 'users_school_id_key',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('users', 'users_school_id_key');
  },
};
