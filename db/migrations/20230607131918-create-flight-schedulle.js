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
      departure_date: {
        type: Sequelize.DATEONLY,
      },
      departure_time: {
        type: Sequelize.TIME,
      },
      arrival_date: {
        type: Sequelize.DATEONLY,
      },
      arrival_time: {
        type: Sequelize.TIME,
      },
      departure_airport_id: {
        type: Sequelize.INTEGER,
      },
      arrival_airport_id: {
        type: Sequelize.INTEGER,
      },
      duration: {
        type: Sequelize.INTEGER,
      },
      departure_terminal_name: {
        type: Sequelize.STRING,
      },
      arrival_terminal_name: {
        type: Sequelize.STRING,
      },
      free_baggage: {
        type: Sequelize.INTEGER,
      },
      cabin_baggage: {
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      class_id: {
        type: Sequelize.INTEGER,
      },
      flight_number: {
        type: Sequelize.STRING,
      },
      seat_available: {
        type: Sequelize.INTEGER,
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
