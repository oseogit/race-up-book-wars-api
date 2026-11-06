# Race Up: Book Wars API

Backend API for **Race Up: Book Wars**, a tournament game for the SorSU Bulan Campus library.

CS 313 Software Engineering 1, A.Y. 2026–2027.

- **Developer:** Ria Angela Oseo (`oseogit`), BSCS 3-2
- **Group and game concept:** Team 9

This is my own build of my group's game concept. Every commit in this repository was made by me, using Git on my own computer or in my own Codespace.

## Tech Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```bash
git clone https://github.com/oseogit/race-up-book-wars-api.git
cd race-up-book-wars-api
npm install
```

Copy `.env.example` to `.env`, then enter your own PostgreSQL password in `DB_PASSWORD`.

```bash
npm run db:create
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

To start again from a known state (empty database, all tables rebuilt, and seed data loaded):

```bash
npm run db:reset
```

## Environment Variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Configuration environment |
| PORT | 3001 | Port the API listens on |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | Race_Up_Book_Wars | Database name |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | PostgreSQL password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key used by the Library Game Hub to read results |

## API Endpoints

Base URL: `http://localhost:3001/api/v1`

### Hub Contract v1.2

| Method | Path | Purpose | Who May Call It | Success |
|---|---|---|---|---|
| GET | `/health` | Check API and database availability | Anyone | 200 (503 if database is unavailable) |
| GET | `/game-info` | Get game information and player limits | Anyone | 200 |
| GET | `/results` | Get finished games, player results, and top 3 players. Supports optional `?since=` | Library Game Hub (`X-Hub-Key` required) | 200 (401 without key) |

### Module 1: Question Sets (Week 11)

Until login is implemented in Week 12, identify the caller using the `X-Demo-User: <school ID>` header. This is temporary demo authentication, not security.

| Method | Path | Purpose | Who May Call It | Success |
|---|---|---|---|---|
| GET | `/question-sets` | List the caller's question sets; ADMIN can see all | HOST, ADMIN | 200 |
| GET | `/question-sets/{id}` | Read one question set | Owner or ADMIN | 200 |
| POST | `/question-sets` | Create a question set | HOST, ADMIN | 201 |
| PATCH | `/question-sets/{id}` | Update one or more question-set fields | Owner or ADMIN | 200 |
| DELETE | `/question-sets/{id}` | Delete a question set that has not been used by a game | Owner or ADMIN | 204 |

### Module 2: Sessions and Players (Week 11)

Requests use the temporary `X-Demo-User: <school ID>` header until login is implemented in Week 12.

| Method | Path | Purpose | Who May Call It | Success |
|---|---|---|---|---|
| POST | `/sessions` | Create a game session | HOST, ADMIN | 201 |
| GET | `/sessions/{code}` | Read session details using its join code | Anyone | 200 |
| PATCH | `/sessions/{code}` | Update session status | Session host, ADMIN | 200 |
| POST | `/sessions/{code}/players` | Join or rejoin a game using a nickname | Authenticated user | 201 (new player), 200 (rejoin) |
| GET | `/sessions/{code}/players` | List players in a session | Anyone | 200 |

#### Session Rules

- Only HOST or ADMIN users can create sessions.
- The question set must belong to the host, unless the caller is an ADMIN.
- Only the session host or an ADMIN can update a session.
- New players can join only while the session status is `WAITING`.
- Existing players can rejoin using the same join endpoint, even if the session is no longer accepting new players.
- A session can have a maximum of 20 players.
- Nicknames must be unique within the same session.

#### Allowed Session Status Transitions

- `WAITING` → `RUNNING`
- `WAITING` → `CLOSED`
- `RUNNING` → `CLOSED`

Invalid status transitions return `409 Conflict`.

### Error Responses

Errors use this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Description of the error"
  }
}
```

Common responses:

| Status | Meaning |
|---|---|
| 400 | Invalid request data |
| 401 | Missing or invalid Hub key |
| 403 | Caller is not allowed to perform the action |
| 404 | Requested resource or game code was not found |
| 409 | Conflict, such as duplicate nickname, question set in use, or invalid status transition |
| 503 | Database is unavailable |

### Test Accounts

Seeded demo accounts:

| Role | School ID |
|---|---|
| Host | `2099-0001` |
| Other host | `2099-0007` |
| Third host | `2099-0008` |

Use the appropriate `X-Demo-User` header when testing protected endpoints.

### Postman Collection

The Postman collection is located at:

`postman/collections/race-up-book-wars-api`

It contains the Hub Contract tests, Module 1 Question Sets tests, and Module 2 Sessions and Players tests.

### What Completed Means

- API starts successfully.
- Database migrations and seeders run successfully.
- Hub Contract endpoints return the expected responses.
- Module 1 CRUD operations and validation tests pass.
- Module 2 session and player tests pass.
- Error handling returns consistent responses.
- Postman collection tests pass from a known database state.

### Database Tables

The database includes:

- `users`
- `question_sets`
- `questions`
- `game_sessions`
- `players`
- `answers`
- `player_question_progress`
- `leaderboard`
- `book_effects`
- `retry_pool`

### Database Scripts

| Command | Purpose |
|---|---|
| `npm run db:create` | Create the development database |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:seed` | Load seed data |
| `npm run db:check` | Check database tables and records |
| `npm run db:reset` | Rebuild the database and reload seed data |

