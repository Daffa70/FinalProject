"use strict";

/** @type {import('sequelize-cli').Migration} */
const airlines = require("./data/airlines.json");

module.exports = {
  async up(queryInterface, Sequelize) {
    let airplanesKey = 0;
    const airplanes = [];
    for (const [airlinesKey, airline] of Object.entries(airlines)) {
      airplanesKey = airplanesKey + 1;
      for (const [key, value] of Object.entries(airline.airplanes)) {
        airplanes.push({
          model: value.model,
          code: value.id,
          airline_id: airplanesKey,
          seat_layout: value.seatLayout,
          total_seat: value.seatPitch,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert("Airplanes", airplanes, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Airplanes", null, {});
  },
};
