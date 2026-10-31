'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        nickname: 'host_second',
        password_hash: 'demo_hash_not_for_login',
        school_id: '2099-0007',
        full_name: 'Demo Host Two',
        email: 'host2@demo.test',
        role: 'HOST',
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'users',
      { nickname: 'host_second' },
      {}
    );
  },
};