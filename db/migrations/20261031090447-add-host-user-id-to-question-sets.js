'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: add the column as nullable, with its foreign key (added once).
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

    // Step 2: give any question set that already exists an owner.
    await queryInterface.sequelize.query(`
      UPDATE question_sets
      SET host_user_id = (
        SELECT user_id FROM users WHERE nickname = 'host_demo'
      )
      WHERE host_user_id IS NULL;
    `);

    // Step 3: make the column required. A plain SET NOT NULL is used on purpose:
    // changeColumn() with "references" would add a SECOND foreign key.
    await queryInterface.sequelize.query(
      'ALTER TABLE question_sets ALTER COLUMN host_user_id SET NOT NULL;'
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('question_sets', 'host_user_id');
  },
};
