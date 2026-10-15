
'use strict';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    // Do not duplicate the demo data when seeding again.
    const [[existing]] = await db.query(
      'SELECT COUNT(*)::int AS total FROM users'
    );
    if (existing.total > 0) return;

    const now = new Date();
    const started = new Date(now.getTime() - 15 * 60 * 1000);
    const ended = new Date(now.getTime() - 5 * 60 * 1000);

    // 1. Create fictional accounts.
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
    ]);

    const [[host]] = await db.query(
      "SELECT user_id FROM users WHERE nickname = 'host_demo'"
    );
    const [[studentOne]] = await db.query(
      "SELECT user_id FROM users WHERE nickname = 'student_one'"
    );
    const [[studentTwo]] = await db.query(
      "SELECT user_id FROM users WHERE nickname = 'student_two'"
    );
    const [[studentThree]] = await db.query(
      "SELECT user_id FROM users WHERE nickname = 'student_three'"
    );
    const [[studentFour]] = await db.query(
      "SELECT user_id FROM users WHERE nickname = 'student_four'"
    );

    // 2. Create a question set, then retrieve its generated ID.
    await queryInterface.bulkInsert('question_sets', [
      {
        title: 'Library Orientation Basics',
        description: 'Fictional demo questions for Race Up: Book Wars.',
        subject: 'General Knowledge',
        grade_level: 'College',
      },
    ]);

    const [[questionSet]] = await db.query(
      "SELECT set_id FROM question_sets WHERE title = 'Library Orientation Basics'"
    );

    // 3. Create questions, then retrieve their generated IDs.
    await queryInterface.bulkInsert('questions', [
      {
        set_id: questionSet.set_id,
        text: 'Which planet is known as the Red Planet?',
        type: 'MULTIPLE_CHOICE',
        choices: JSON.stringify(['Earth', 'Mars', 'Venus', 'Jupiter']),
        correct_index: 1,
        time_limit_sec: 30,
        difficulty: 'EASY',
      },
      {
        set_id: questionSet.set_id,
        text: 'How many sides does a triangle have?',
        type: 'MULTIPLE_CHOICE',
        choices: JSON.stringify(['Two', 'Three', 'Four', 'Five']),
        correct_index: 1,
        time_limit_sec: 30,
        difficulty: 'EASY',
      },
    ]);

    const [[questionOne]] = await db.query(
      "SELECT question_id FROM questions WHERE text = 'Which planet is known as the Red Planet?'"
    );
    const [[questionTwo]] = await db.query(
      "SELECT question_id FROM questions WHERE text = 'How many sides does a triangle have?'"
    );

    // 4. Create a finished game.
    await queryInterface.bulkInsert('game_sessions', [
      {
        host_user_id: host.user_id,
        set_id: questionSet.set_id,
        join_code: '123456',
        status: 'CLOSED',
        created_at: started,
        started_at: started,
        ended_at: ended,
        time_limit_sec: 30,
      },
    ]);

    const [[game]] = await db.query(
      "SELECT session_id FROM game_sessions WHERE join_code = '123456'"
    );

    // 5. Add three completed players and one unfinished player.
    await queryInterface.bulkInsert('players', [
      {
        session_id: game.session_id,
        user_id: studentOne.user_id,
        nickname: 'student_one',
        player_token_hash: 'demo-token-hash-one',
        shelf_position: 5,
        score: 100,
        joined_at: started,
        finished_at: ended,
      },
      {
        session_id: game.session_id,
        user_id: studentTwo.user_id,
        nickname: 'student_two',
        player_token_hash: 'demo-token-hash-two',
        shelf_position: 4,
        score: 80,
        joined_at: started,
        finished_at: ended,
      },
      {
        session_id: game.session_id,
        user_id: studentThree.user_id,
        nickname: 'student_three',
        player_token_hash: 'demo-token-hash-three',
        shelf_position: 3,
        score: 60,
        joined_at: started,
        finished_at: ended,
      },
      {
        session_id: game.session_id,
        user_id: studentFour.user_id,
        nickname: 'student_four',
        player_token_hash: 'demo-token-hash-four',
        shelf_position: 1,
        score: 10,
        joined_at: started,
        finished_at: null,
      },
    ]);

    const players = await db.query(
      'SELECT player_id, nickname FROM players WHERE session_id = :sessionId',
      {
        replacements: { sessionId: game.session_id },
        type: db.QueryTypes.SELECT,
      }
    );

    const playerByNickname = Object.fromEntries(
      players.map((player) => [player.nickname, player.player_id])
    );

    // 6. Answers.
    await queryInterface.bulkInsert('answers', [
      {
        player_id: playerByNickname.student_one,
        question_id: questionOne.question_id,
        choices_index: 1,
        is_correct: true,
        answered_at: started,
      },
      {
        player_id: playerByNickname.student_two,
        question_id: questionOne.question_id,
        choices_index: 1,
        is_correct: true,
        answered_at: started,
      },
      {
        player_id: playerByNickname.student_three,
        question_id: questionOne.question_id,
        choices_index: 0,
        is_correct: false,
        answered_at: started,
      },
      {
        player_id: playerByNickname.student_four,
        question_id: questionOne.question_id,
        choices_index: 0,
        is_correct: false,
        answered_at: started,
      },
    ]);

    // 7. Question progress.
    await queryInterface.bulkInsert('player_question_progress', [
      {
        player_id: playerByNickname.student_one,
        question_id: questionOne.question_id,
        status: 'COMPLETED',
        attempts: 1,
        completed_at: ended,
      },
      {
        player_id: playerByNickname.student_two,
        question_id: questionOne.question_id,
        status: 'COMPLETED',
        attempts: 1,
        completed_at: ended,
      },
      {
        player_id: playerByNickname.student_three,
        question_id: questionOne.question_id,
        status: 'COMPLETED',
        attempts: 2,
        completed_at: ended,
      },
      {
        player_id: playerByNickname.student_four,
        question_id: questionOne.question_id,
        status: 'IN_PROGRESS',
        attempts: 1,
        completed_at: null,
      },
    ]);

    // 8. Leaderboard entries for completed players.
    await queryInterface.bulkInsert('leaderboard', [
      {
        player_id: playerByNickname.student_one,
        score: 100,
        rank_position: 1,
        achieved_at: ended,
      },
      {
        player_id: playerByNickname.student_two,
        score: 80,
        rank_position: 2,
        achieved_at: ended,
      },
      {
        player_id: playerByNickname.student_three,
        score: 60,
        rank_position: 3,
        achieved_at: ended,
      },
    ]);

    // 9. Book effects.
    await queryInterface.bulkInsert('book_effects', [
      { effect_type: 'CLIMB', effect_value: 1 },
      { effect_type: 'CLIMB', effect_value: 2 },
      { effect_type: 'CLIMB', effect_value: 3 },
    ]);

    // 10. Retry pool.
    await queryInterface.bulkInsert('retry_pool', [
      {
        player_id: playerByNickname.student_three,
        question_id: questionTwo.question_id,
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
