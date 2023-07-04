"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Orders", "schedulle_return_id", {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to false if the column should not allow null values
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Orders", "schedulle_return_id");
  },
};
