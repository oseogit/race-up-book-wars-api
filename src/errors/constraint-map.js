module.exports = {
  players_session_id_user_id_unique: {
    status: 409,
    code: 'PLAYER_ALREADY_JOINED',
    message: 'This player has already joined the session.',
  },

  game_sessions_set_id_fkey: {
    status: 409,
    code: 'QUESTION_SET_IN_USE',
    message: 'This question set was used in a game and cannot be deleted.',
  },
};