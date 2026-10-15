'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'question_sets',
          key: 'set_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      choices: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      correct_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      time_limit_sec: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      difficulty: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'MEDIUM',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('questions');
  },
};