const { matchedData } = require('express-validator');
const sessionService = require('../services/session.service');

function toJson(player) {
  return {
    player_id: player.player_id,
    nickname: player.nickname,
    shelf_position: player.shelf_position,
    score: player.score,
    joined_at: player.joined_at,
    finished_at: player.finished_at,
  };
}

async function joinPlayer(req, res) {
  const { code, nickname } = matchedData(req, {
    locations: ['params', 'body'],
  });

  const result = await sessionService.joinSession(
    code,
    { nickname },
    req.user
  );

  res.status(result.rejoined ? 200 : 201).json({
    player: toJson(result.player),
    rejoined: result.rejoined,
  });
}

async function listPlayers(req, res) {
  const { code } = matchedData(req, {
    locations: ['params'],
  });

  const players = await sessionService.listPlayers(code);

  res.status(200).json({
    players: players.map(toJson),
  });
}

module.exports = {
  joinPlayer,
  listPlayers,
};