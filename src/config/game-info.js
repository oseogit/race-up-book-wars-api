// What the Library Game Hub shows about YOUR game (Hub Contract, rule 1).
// Lab Step 6: replace every CHANGE_ME value with your own.
const pkg = require('../../package.json');

module.exports = {
  slug: 'race-up-book-wars',            // your group's game, lower case with hyphens, for example shelf-climb
  name: 'Race Up: Book Wars',            // the name players will see
  team: 'Team 9 (3-2)',            // your group's name and section, for example Bookworms (3-1)
  developer: 'oseogit',       // YOUR GitHub username: this build is yours
  description: 'Books Wars, a multiplayer game where players answer questions and get mystery books to climb shelves and compete against opponents.',     // one sentence about how the game is played
  min_players: 5,               // change to the limits your game is designed for
  max_players: 20,
  version: pkg.version,         // read from package.json, do not edit here
};
