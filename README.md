# Race Up: Book Wars API

Backend API for **Race Up: Book Wars**, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Ria Angela Oseo (oseogit), BSCS 3-2
- Group and game concept: Team 9

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone https://github.com/oseogit/race-up-book-wars-api.git
cd race-up-book-wars-api
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

To start again from a known state (empty database, all tables rebuilt, seed data loaded):

```
npm run db:reset
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | Race_Up_Book_Wars | Database name |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Who may call it | Success |
|---|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | Anyone | 200 (503 when the database is down) |
| GET | /game-info | Slug, name, group, developer, description, player limits, version | Anyone | 200 |
| GET | /results | Finished games, every player, and the top 3. Optional `?since=` | The Library Game Hub (needs the `X-Hub-Key` header) | 200 (401 without the key) |

## Module 1: question sets (Week 11)

Until login exists (Week 12), say who is calling with the header `X-Demo-User: <school ID of a seeded account>`, for example `2099-0001`. This is **not security**; it is replaced in Week 12.

| Method | Path | Purpose | Who may call it | Success |
|---|---|---|---|---|
| GET | /question-sets | List the caller's question sets (an admin sees all) | HOST, ADMIN | 200 |
| GET | /question-sets/{id} | Read one question set | Its owner, or an ADMIN | 200 |
| POST | /question-sets | Create a question set. The owner is the caller. | HOST, ADMIN | 201 |
| PATCH | /question-sets/{id} | Change one or more fields | Its owner, or an ADMIN | 200 |
| DELETE | /question-sets/{id} | Delete a question set that no game used | Its owner, or an ADMIN | 204 |

Every error answers `{ "error": { "code": "...", "message": "..." } }`. A body that is wrong answers 400 with a message that names the field. Another host's set answers 403. A set that a game used cannot be deleted: 409 `QUESTION_SET_IN_USE`.

Test accounts (from the seed data): host `2099-0001`, other host `2099-0007`, third host `2099-0008`, players `2099-0002` to `2099-0006`.

The Postman collection is in `postman/collections/race-up-book-wars-api`. Import it, then run the whole collection after `npm run db:reset` and `npm run dev`.

## What "completed" means in my game

A player is considered completed when their `finished_at` value in the `players` table is not NULL. If `finished_at` is NULL, the player has not completed the game. The results endpoint returns `completed: true` for completed players and `completed: false` for players who did not finish.

## Tables

`users`, `question_sets`, `questions`, `game_sessions`, `players`, `answers`, `player_question_progress`, `leaderboard`, `book_effects`, `retry_pool`

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |
