module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'QuestionSet',
    {
      set_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      subject: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      grade_level: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: 'question_sets',
      timestamps: false,
    }
  );