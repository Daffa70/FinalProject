"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Airports", "continent", {
      type: Sequelize.STRING,
      allowNull: true, // Set to false if the column should not allow null values
    });

    await queryInterface.addColumn("Airports", "total_visit", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Airports", "continent");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Airports", "total_visit");
  },
};
