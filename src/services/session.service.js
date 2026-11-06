
const crypto = require('crypto');
const sessionRepository = require('../repositories/session.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden, conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

const MAX_PLAYERS = 20;

function generateJoinCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function createSession(data, user) {
  const questionSet = await questionSetRepository.findById(data.set_id);

  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND', 'Question set not found.');
  }

  if (
    questionSet.host_user_id !== user.user_id &&
    user.role !== 'ADMIN'
  ) {
    throw forbidden('You cannot use this question set.');
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const joinCode = generateJoinCode();

    try {
      return await sessionRepository.createSession({
        host_user_id: user.user_id,
        set_id: data.set_id,
        join_code: joinCode,
        status: 'WAITING',
        time_limit_sec: data.time_limit_sec,
      });
    } catch (error) {
      if (constraintOf(error) !== 'game_sessions_join_code_key') {
        throw error;
      }
    }
  }

  throw conflict(
    'JOIN_CODE_GENERATION_FAILED',
    'Could not generate a unique join code. Please try again.'
  );
}

async function findSession(code) {
  const session = await sessionRepository.findSessionByCode(code);

  if (!session) {
    throw notFound('SESSION_NOT_FOUND', 'Session not found.');
  }

  return session;
}

async function updateSession(code, changes, user) {
  const session = await findSession(code);

  if (session.host_user_id !== user.user_id && user.role !== 'ADMIN') {
    throw forbidden('Only the session host can update this session.');
  }

  const allowedTransitions = {
    WAITING: ['RUNNING', 'CLOSED'],
    RUNNING: ['CLOSED'],
    CLOSED: [],
  };

  if (!allowedTransitions[session.status]?.includes(changes.status)) {
    throw conflict(
      'INVALID_STATUS_TRANSITION',
      `Cannot change session status from ${session.status} to ${changes.status}.`
    );
  }

  const updates = { ...changes };

  if (changes.status === 'RUNNING') {
    updates.started_at = new Date();
  }

  if (changes.status === 'CLOSED') {
    updates.ended_at = new Date();
  }

  return sessionRepository.updateSession(session, updates);
}

async function joinSession(code, data, user) {
  const session = await findSession(code);

  const existingPlayer =
    await sessionRepository.findPlayerBySessionAndUser(
      session.session_id,
      user.user_id
    );

  if (existingPlayer) {
    return { player: existingPlayer, rejoined: true };
  }

  if (session.status !== 'WAITING') {
    throw conflict(
      'SESSION_NOT_JOINABLE',
      'This session is no longer accepting new players.'
    );
  }

  const existingNickname =
    await sessionRepository.findPlayerBySessionAndNickname(
      session.session_id,
      data.nickname
    );

  if (existingNickname) {
    throw conflict(
      'DUPLICATE_NICKNAME',
      'This nickname is already taken in this session.'
    );
  }

  const playerCount = await sessionRepository.countPlayersBySession(
    session.session_id
  );

  if (playerCount >= MAX_PLAYERS) {
    throw conflict('SESSION_FULL', 'This session is already full.');
  }

  try {
    const player = await sessionRepository.createPlayer({
      session_id: session.session_id,
      user_id: user.user_id,
      nickname: data.nickname,
      player_token_hash: crypto
        .createHash('sha256')
        .update(crypto.randomBytes(32))
        .digest('hex'),
      token_expires_at: null,
      shelf_position: 0,
      joined_at: new Date(),
      score: 0,
    });

    return { player, rejoined: false };
  } catch (error) {
    if (constraintOf(error) === 'players_session_id_user_id_unique') {
      const player =
        await sessionRepository.findPlayerBySessionAndUser(
          session.session_id,
          user.user_id
        );

      if (player) {
        return { player, rejoined: true };
      }
    }

    throw error;
  }
}

async function listPlayers(code) {
  const session = await findSession(code);

  return sessionRepository.findPlayersBySession(session.session_id);
}

module.exports = {
  createSession,
  findSession,
  updateSession,
  joinSession,
  listPlayers,
};
