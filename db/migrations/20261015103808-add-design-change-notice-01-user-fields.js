
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'school_id', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'full_name', {
      type: Sequelize.STRING(150),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'email', {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'email');
    await queryInterface.removeColumn('users', 'full_name');
    await queryInterface.removeColumn('users', 'school_id');
  },
};
