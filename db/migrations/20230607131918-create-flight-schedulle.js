"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Flight_schedulles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      airplane_id: {
        type: Sequelize.INTEGER,
      },
      departure_time: {
        type: Sequelize.DATE,
      },
      arrival_time: {
        type: Sequelize.DATE,
      },
      departure_airport_id: {
        type: Sequelize.INTEGER,
      },
      arrival_airport_id: {
        type: Sequelize.INTEGER,
      },
      free_baggage: {
        type: Sequelize.INTEGER,
      },
      cabin_baggage: {
        type: Sequelize.INTEGER,
      },
      flight_number: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Flight_schedulles");
  },
};
