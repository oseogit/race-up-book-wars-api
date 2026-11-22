module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'GameSession',
    {
      session_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      host_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      set_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      join_code: {
        type: DataTypes.STRING(6),
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'WAITING',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      started_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ended_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      time_limit_sec: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'game_sessions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );