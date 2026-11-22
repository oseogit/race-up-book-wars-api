// Reads the name of the database constraint that an insert, update or delete broke.
// Returns null when the error is not a constraint violation.
const { UniqueConstraintError, ForeignKeyConstraintError, DatabaseError } = require('sequelize');

// PostgreSQL code 23001 (restrict_violation) is what a foreign key with
// ON DELETE RESTRICT raises. Sequelize turns only 23503 into a
// ForeignKeyConstraintError, so 23001 arrives as a plain DatabaseError and
// has to be recognised here, or the client would get a 500.
const RESTRICT_VIOLATION = '23001';

function constraintOf(error) {
  if (error instanceof UniqueConstraintError || error instanceof ForeignKeyConstraintError) {
    return (error.parent && error.parent.constraint) || error.index || 'unknown';
  }
  if (error instanceof DatabaseError && error.parent && error.parent.code === RESTRICT_VIOLATION) {
    // The name is in the constraint field; the message repeats it as a fallback:
    // ... violates foreign key constraint "game_sessions_set_id_fkey" on table ...
    const named = /constraint "([^"]+)"/.exec(error.parent.message || '');
    return error.parent.constraint || (named && named[1]) || 'unknown';
  }
  return null;
}

module.exports = { constraintOf };
