'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        nickname: 'host_demo',
        password_hash: 'demo_hash_not_for_login',
        school_id: '2099-0001',
        full_name: 'Demo Host',
        email: 'host@demo.test',
        role: 'HOST',
        created_at: now,
        updated_at: now,
      },
      {
        nickname: 'student_one',
        password_hash: 'demo_hash_not_for_login',
        school_id: '2099-0002',
        full_name: 'Demo Student One',
        email: 'student1@demo.test',
        role: 'PLAYER',
        created_at: now,
        updated_at: now,
      },
      {
        nickname: 'student_two',
        password_hash: 'demo_hash_not_for_login',
        school_id: '2099-0003',
        full_name: 'Demo Student Two',
        email: 'student2@demo.test',
        role: 'PLAYER',
        created_at: now,
        updated_at: now,
      },
      {
        nickname: 'student_three',
        password_hash: 'demo_hash_not_for_login',
        school_id: '2099-0004',
        full_name: 'Demo Student Three',
        email: 'student3@demo.test',
        role: 'PLAYER',
        created_at: now,
        updated_at: now,
      },
      {
        nickname: 'student_four',
        password_hash: 'demo_hash_not_for_login',
        school_id: '2099-0005',
        full_name: 'Demo Student Four',
        email: 'student4@demo.test',
        role: 'PLAYER',
        created_at: now,
        updated_at: now,
      },
      {
        nickname: 'never_joined',
        password_hash: 'demo_hash_not_for_login',
        school_id: '2099-0006',
        full_name: 'Demo Account Never Joined',
        email: 'unused@demo.test',
        role: 'PLAYER',
        created_at: now,
        updated_at: now,
      },
      {
        nickname: 'host_other_demo',
        password_hash: 'demo_hash_not_for_login',
        school_id: '2099-0007',
        full_name: 'Demo Other Host',
        email: 'otherhost@demo.test',
        role: 'HOST',
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'users',
      {
        nickname: [
          'host_demo',
          'student_one',
          'student_two',
          'student_three',
          'student_four',
          'never_joined',
          'host_other_demo',
        ],
      },
      {}
    );
  },
};