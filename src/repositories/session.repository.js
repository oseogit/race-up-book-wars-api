
// The only file that queries game_sessions and players.
// No business decisions here.
const { GameSession, Player } = require('../models');

function findSessionByCode(joinCode) {
  return GameSession.findOne({
    where: { join_code: joinCode },
  });
}

function createSession(data) {
  return GameSession.create(data);
}

function updateSession(session, changes) {
  return session.update(changes);
}

function findPlayersBySession(sessionId) {
  return Player.findAll({
    where: { session_id: sessionId },
    order: [['player_id', 'ASC']],
  });
}

function countPlayersBySession(sessionId) {
  return Player.count({
    where: { session_id: sessionId },
  });
}

function findPlayerBySessionAndUser(sessionId, userId) {
  return Player.findOne({
    where: {
      session_id: sessionId,
      user_id: userId,
    },
  });
}

function createPlayer(data) {
  return Player.create(data);
}

function updatePlayer(player, changes) {
  return player.update(changes);
}

module.exports = {
  findSessionByCode,
  createSession,
  updateSession,
  findPlayersBySession,
  countPlayersBySession,
  findPlayerBySessionAndUser,
  createPlayer,
  updatePlayer,
};
