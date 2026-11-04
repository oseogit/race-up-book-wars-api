'use strict';

// Fills every table that the first seeder left empty, so that:
//   - npm run db:check shows rows in every table,
//   - there is one finished game with 3+ completed players (GET /results),
//   - a question set that a game used exists (deleting it must answer 409).
const { QueryTypes } = require('sequelize');

const SET_TITLES = ['Library Basics', 'Famous Books and Authors'];
const JOIN_CODE = '483920'; // six digits, does not start with 0
const EFFECT_TYPES = ['EXTRA_POINTS', 'SKIP_SHELF'];

module.exports = {
  async up(queryInterface) {
    const q = (sql) => queryInterface.sequelize.query(sql, { type: QueryTypes.SELECT });
    const now = new Date();
    const minutesAgo = (m) => new Date(now.getTime() - m * 60 * 1000);

    // ---- accounts created by the first seeder -------------------------------
    const users = await q(`SELECT user_id, school_id FROM users`);
    const userId = (schoolId) => users.find((u) => u.school_id === schoolId).user_id;

    // ---- question_sets -------------------------------------------------------
    await queryInterface.bulkInsert('question_sets', [
      {
        host_user_id: userId('2099-0001'),
        title: SET_TITLES[0],
        description: 'How to find, borrow and return books in the library.',
        subject: 'Library Science',
        grade_level: 'College',
      },
      {
        host_user_id: userId('2099-0007'),
        title: SET_TITLES[1],
        description: 'Well-known books and the people who wrote them.',
        subject: 'Literature',
        grade_level: 'College',
      },
    ]);
    const sets = await q(`SELECT set_id, title FROM question_sets WHERE title IN ('${SET_TITLES.join("','")}')`);
    const setId = (title) => sets.find((s) => s.title === title).set_id;

    // ---- questions -----------------------------------------------------------
    const question = (title, text, choices, correctIndex, difficulty) => ({
      set_id: setId(title),
      text,
      type: 'MULTIPLE_CHOICE',
      choices: JSON.stringify(choices), // JSONB column: send JSON text
      correct_index: correctIndex,
      time_limit_sec: 20,
      difficulty,
    });
    await queryInterface.bulkInsert('questions', [
      question(SET_TITLES[0], 'Where do you ask for help finding a book?', ['Circulation desk', 'Parking lot', 'Cafeteria', 'Gym'], 0, 'EASY'),
      question(SET_TITLES[0], 'What do you need to borrow a book?', ['A library card or school ID', 'A bicycle', 'A raffle ticket', 'Nothing at all'], 0, 'EASY'),
      question(SET_TITLES[0], 'What is a call number used for?', ['Finding where a book sits on the shelf', 'Calling the librarian', 'Counting pages', 'Pricing a book'], 0, 'MEDIUM'),
      question(SET_TITLES[1], 'Who wrote "Noli Me Tangere"?', ['Jose Rizal', 'Andres Bonifacio', 'Francisco Balagtas', 'Emilio Aguinaldo'], 0, 'EASY'),
      question(SET_TITLES[1], 'Who wrote "Florante at Laura"?', ['Jose Rizal', 'Francisco Balagtas', 'Lope K. Santos', 'Nick Joaquin'], 1, 'MEDIUM'),
    ]);
    const questions = await q(`SELECT question_id FROM questions WHERE set_id = ${setId(SET_TITLES[0])} ORDER BY question_id`);

    // ---- game_sessions: one game that has ended ------------------------------
    await queryInterface.bulkInsert('game_sessions', [
      {
        host_user_id: userId('2099-0001'),
        set_id: setId(SET_TITLES[0]),
        join_code: JOIN_CODE,
        status: 'CLOSED',
        created_at: minutesAgo(60),
        started_at: minutesAgo(50),
        ended_at: minutesAgo(30),
        time_limit_sec: 600,
      },
    ]);
    const [session] = await q(`SELECT session_id FROM game_sessions WHERE join_code = '${JOIN_CODE}'`);

    // ---- players: three finished, one not -----------------------------------
    const player = (schoolId, nickname, score, shelf, finished) => ({
      session_id: session.session_id,
      user_id: userId(schoolId),
      nickname,
      player_token_hash: 'demo_token_hash_not_for_login',
      token_expires_at: null,
      shelf_position: shelf,
      joined_at: minutesAgo(55),
      score,
      finished_at: finished ? minutesAgo(32) : null,
    });
    await queryInterface.bulkInsert('players', [
      player('2099-0002', 'PageTurner', 300, 5, true),
      player('2099-0003', 'ShelfClimber', 200, 5, true),
      player('2099-0004', 'QuietReader', 200, 5, true),
      player('2099-0005', 'LateBloomer', 100, 3, false),
    ]);
    const players = await q(`SELECT player_id, nickname FROM players WHERE session_id = ${session.session_id} ORDER BY player_id`);
    const pid = (nickname) => players.find((p) => p.nickname === nickname).player_id;

    // ---- answers -------------------------------------------------------------
    await queryInterface.bulkInsert('answers', [
      { player_id: pid('PageTurner'), question_id: questions[0].question_id, choices_index: 0, is_correct: true, answered_at: minutesAgo(45) },
      { player_id: pid('ShelfClimber'), question_id: questions[0].question_id, choices_index: 0, is_correct: true, answered_at: minutesAgo(45) },
      { player_id: pid('LateBloomer'), question_id: questions[0].question_id, choices_index: 2, is_correct: false, answered_at: minutesAgo(44) },
    ]);

    // ---- player_question_progress -------------------------------------------
    await queryInterface.bulkInsert('player_question_progress', [
      { player_id: pid('PageTurner'), question_id: questions[0].question_id, status: 'COMPLETED', attempts: 1, completed_at: minutesAgo(45) },
      { player_id: pid('LateBloomer'), question_id: questions[0].question_id, status: 'IN_PROGRESS', attempts: 1, completed_at: null },
    ]);

    // ---- leaderboard ---------------------------------------------------------
    await queryInterface.bulkInsert('leaderboard', [
      { player_id: pid('PageTurner'), score: 300, rank_position: 1, achieved_at: minutesAgo(32) },
      { player_id: pid('ShelfClimber'), score: 200, rank_position: 2, achieved_at: minutesAgo(32) },
      { player_id: pid('QuietReader'), score: 200, rank_position: 2, achieved_at: minutesAgo(32) },
      { player_id: pid('LateBloomer'), score: 100, rank_position: 4, achieved_at: minutesAgo(30) },
    ]);

    // ---- book_effects --------------------------------------------------------
    await queryInterface.bulkInsert('book_effects', [
      { effect_type: EFFECT_TYPES[0], effect_value: 10 },
      { effect_type: EFFECT_TYPES[1], effect_value: 1 },
    ]);

    // ---- retry_pool ----------------------------------------------------------
    await queryInterface.bulkInsert('retry_pool', [
      { player_id: pid('LateBloomer'), question_id: questions[0].question_id, added_at: minutesAgo(44) },
    ]);
  },

  async down(queryInterface) {
    // Deleting the game removes its players, answers, progress, leaderboard and
    // retry rows (ON DELETE CASCADE). The sets can only go after the game.
    await queryInterface.bulkDelete('game_sessions', { join_code: JOIN_CODE }, {});
    await queryInterface.bulkDelete('question_sets', { title: SET_TITLES }, {}); // questions cascade
    await queryInterface.bulkDelete('book_effects', { effect_type: EFFECT_TYPES }, {});
  },
};
