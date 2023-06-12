"use strict";

const schedules = require("./data/airports.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const airports = [];
    for (const [key, value] of Object.entries(schedules)) {
      airports.push({
        name: value.localName,
        code: value.airportId,
        city: value.city,
        state: value.country,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("Airports", airports, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Airports", null, {});
  },
};
