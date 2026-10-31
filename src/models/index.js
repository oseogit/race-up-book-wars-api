const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Load models
const User = require('./user')(sequelize, DataTypes);
const QuestionSet = require('./question-set')(sequelize, DataTypes);
const GameSession = require('./game-session')(sequelize, DataTypes);
const Player = require('./player')(sequelize, DataTypes);

// Relationships
User.hasMany(GameSession, { foreignKey: 'host_user_id', as: 'hostedSessions' });
GameSession.belongsTo(User, { foreignKey: 'host_user_id', as: 'host' });

QuestionSet.hasMany(GameSession, { foreignKey: 'set_id', as: 'sessions' });
GameSession.belongsTo(QuestionSet, { foreignKey: 'set_id', as: 'questionSet' });

GameSession.hasMany(Player, { foreignKey: 'session_id', as: 'players' });
Player.belongsTo(GameSession, { foreignKey: 'session_id', as: 'session' });

User.hasMany(Player, { foreignKey: 'user_id', as: 'playerEntries' });
Player.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  User,
  QuestionSet,
  GameSession,
  Player,
};