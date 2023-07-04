"use strict";

/** @type {import('sequelize-cli').Migration} */

const schedules = require("./data/airlines.json");

module.exports = {
  async up(queryInterface, Sequelize) {
    const airlines = [];
    for (const [key, value] of Object.entries(schedules)) {
      airlines.push({
        name: value.name,
        code: value.airlineId,
        icon_url: value.iconUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("Airlines", airlines, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Airlines", null, {});
  },
};
