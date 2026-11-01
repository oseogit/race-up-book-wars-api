'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('question_sets', 'host_user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.sequelize.query(`
      UPDATE question_sets
      SET host_user_id = (
        SELECT user_id FROM users WHERE nickname = 'host_demo'
      )
      WHERE host_user_id IS NULL;
    `);

    await queryInterface.changeColumn('question_sets', 'host_user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('question_sets', 'host_user_id');
  },
};