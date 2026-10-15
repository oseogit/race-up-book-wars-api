
'use strict';

module.exports = {
  async up(queryInterface) {
    const [existing] = await queryInterface.sequelize.query(
      'SELECT COUNT(*)::int AS total FROM users'
    );

    // Avoid duplicate seed data when run again.
    if (Number(existing[0].total) > 0) return;

    const now = new Date();
    const started = new Date(now.getTime() - 10 * 60 * 1000);
    const ended = new Date(now.getTime() - 2 * 60 * 1000);

    await queryInterface.bulkInsert('users', [
      {
        user_id: 1,
        nickname: 'host_demo',
        password_hash: 'demo_hash_not_for_login',
        school_id: 'SORSU-BULAN',
        full_name: 'Demo Host',
        email: 'host@example.com',
        role: 'HOST',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: 2,
        nickname: 'student_one',
        password_hash: 'demo_hash_not_for_login',
        school_id: 'SORSU-BULAN',
        full_name: 'Demo Student One',
        email: 'student1@example.com',
        role: 'PLAYER',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: 3,
        nickname: 'student_two',
        password_hash: 'demo_hash_not_for_login',
        school_id: 'SORSU-BULAN',
        full_name: 'Demo Student Two',
        email: 'student2@example.com',
        role: 'PLAYER',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: 4,
        nickname: 'student_three',
        password_hash: 'demo_hash_not_for_login',
        school_id: 'SORSU-BULAN',
        full_name: 'Demo Student Three',
        email: 'student3@example.com',
        role: 'PLAYER',
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('question_sets', [
      {
        set_id: 1,
        title: 'General Knowledge Demo',
        description: 'Sample questions for testing Race Up: Book Wars.',
        subject: 'General Knowledge',
        grade_level: 'College',
      },
    ]);

    await queryInterface.bulkInsert('questions', [
      {
        question_id: 1,
        set_id: 1,
        text: 'Which planet is known as the Red Planet?',
        type: 'MULTIPLE_CHOICE',
        choices: JSON.stringify(['Earth', 'Mars', 'Venus', 'Jupiter']),
        correct_index: 1,
        time_limit_sec: 30,
        difficulty: 'EASY',
      },
      {
        question_id: 2,
        set_id: 1,
        text: 'How many sides does a triangle have?',
        type: 'MULTIPLE_CHOICE',
        choices: JSON.stringify(['Two', 'Three', 'Four', 'Five']),
        correct_index: 1,
        time_limit_sec: 30,
        difficulty: 'EASY',
      },
    ]);

    await queryInterface.bulkInsert('game_sessions', [
      {
        session_id: 1,
        host_user_id: 1,
        set_id: 1,
        join_code: '123456',
        status: 'CLOSED',
        created_at: started,
        started_at: started,
        ended_at: ended,
        time_limit_sec: 30,
      },
    ]);

    await queryInterface.bulkInsert('players', [
      {
        player_id: 1,
        session_id: 1,
        user_id: 2,
        nickname: 'student_one',
        player_token_hash: 'demo-token-hash-1',
        token_expires_at: null,
        shelf_position: 5,
        score: 100,
        joined_at: started,
        finished_at: ended,
      },
      {
        player_id: 2,
        session_id: 1,
        user_id: 3,
        nickname: 'student_two',
        player_token_hash: 'demo-token-hash-2',
        token_expires_at: null,
        shelf_position: 4,
        score: 80,
        joined_at: started,
        finished_at: ended,
      },
      {
        player_id: 3,
        session_id: 1,
        user_id: 4,
        nickname: 'student_three',
        player_token_hash: 'demo-token-hash-3',
        token_expires_at: null,
        shelf_position: 3,
        score: 60,
        joined_at: started,
        finished_at: ended,
      },
    ]);

    await queryInterface.bulkInsert('answers', [
      {
        answer_id: 1,
        player_id: 1,
        question_id: 1,
        choices_index: 1,
        is_correct: true,
        answered_at: started,
      },
      {
        answer_id: 2,
        player_id: 2,
        question_id: 1,
        choices_index: 1,
        is_correct: true,
        answered_at: started,
      },
      {
        answer_id: 3,
        player_id: 3,
        question_id: 1,
        choices_index: 0,
        is_correct: false,
        answered_at: started,
      },
    ]);

    await queryInterface.bulkInsert('player_question_progress', [
      {
        progress_id: 1,
        player_id: 1,
        question_id: 1,
        status: 'COMPLETED',
        attempts: 1,
        completed_at: ended,
      },
      {
        progress_id: 2,
        player_id: 2,
        question_id: 1,
        status: 'COMPLETED',
        attempts: 1,
        completed_at: ended,
      },
      {
        progress_id: 3,
        player_id: 3,
        question_id: 1,
        status: 'COMPLETED',
        attempts: 1,
        completed_at: ended,
      },
    ]);

    await queryInterface.bulkInsert('leaderboard', [
      {
        entry_id: 1,
        player_id: 1,
        score: 100,
        rank_position: 1,
        achieved_at: ended,
      },
      {
        entry_id: 2,
        player_id: 2,
        score: 80,
        rank_position: 2,
        achieved_at: ended,
      },
      {
        entry_id: 3,
        player_id: 3,
        score: 60,
        rank_position: 3,
        achieved_at: ended,
      },
    ]);

    await queryInterface.bulkInsert('book_effects', [
      {
        book_effects_id: 1,
        effect_type: 'CLIMB',
        effect_value: 1,
      },
      {
        book_effects_id: 2,
        effect_type: 'CLIMB',
        effect_value: 2,
      },
      {
        book_effects_id: 3,
        effect_type: 'CLIMB',
        effect_value: 3,
      },
    ]);

    await queryInterface.bulkInsert('retry_pool', [
      {
        pool_id: 1,
        player_id: 3,
        question_id: 1,
        added_at: ended,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('retry_pool', null, {});
    await queryInterface.bulkDelete('book_effects', null, {});
    await queryInterface.bulkDelete('leaderboard', null, {});
    await queryInterface.bulkDelete('player_question_progress', null, {});
    await queryInterface.bulkDelete('answers', null, {});
    await queryInterface.bulkDelete('players', null, {});
    await queryInterface.bulkDelete('game_sessions', null, {});
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('question_sets', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
