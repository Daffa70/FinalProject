"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const seatClassesData = [
      {
        name: "Economy",
        description: "Economy class seats",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Premium Economy",
        description: "Premium economy class seats",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Business",
        description: "Business class seats",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "First Class",
        description: "First class seats",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("SeatClasses", seatClassesData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("SeatClasses", null, {});
  },
};
