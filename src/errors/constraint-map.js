// A database rule was broken -> what the client should hear.
// The key is the constraint name from YOUR migration. PostgreSQL names a
// foreign key "<table>_<column>_fkey" when the migration does not name it.
// A constraint that is not listed here still answers 409, with the code CONFLICT.
module.exports = {
  // game_sessions.set_id -> question_sets.set_id, ON DELETE RESTRICT:
  // a set that a game used cannot be deleted.
  game_sessions_set_id_fkey: {
    status: 409,
    code: 'QUESTION_SET_IN_USE',
    message: 'This question set was used in a game and cannot be deleted.',
  },
};
