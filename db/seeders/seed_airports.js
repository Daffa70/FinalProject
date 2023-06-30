"use strict";

const schedules = require("./data/airports.json");
const airportcontinet = require("./data/airports_continent.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const airports = [];
    for (const [key, value] of Object.entries(schedules)) {
      let continent = airportcontinet.filter(
        (item) => item.iata === value.airportId
      );

      airports.push({
        name: value.localName,
        code: value.airportId,
        city: value.city,
        state: value.country,
        continent: continent.length > 0 ? continent[0].continent : null,
        total_visit: 0,
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
