"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const flightRecords = [];
    const numFlights = 10;
    for (let i = 0; i < numFlights; i++) {
      const departureTime = getRandomDateTime(new Date(), 7);
      const flightDurationHours = getRandomNumber(1, 8);
      const arrivalTime = new Date(
        departureTime.getTime() + flightDurationHours * 60 * 60 * 1000
      );

      const flightData = {
        airplane_id: getRandomNumber(1, 19),
        departure_time: departureTime,
        departure_date: departureTime,
        arrival_time: arrivalTime,
        arrival_date: arrivalTime,
        departure_airport_id: getRandomNumber(1, 49),
        arrival_airport_id: getRandomNumber(1, 49),
        flight_number: generateFlightNumber(),
        free_baggage: getRandomNumber(10, 30),
        cabin_baggage: getRandomNumber(5, 15),
        price: getRandomNumber(500000, 2000000),
        class_id: getRandomNumber(1, 3),
        departure_terminal_name: generateTerminalName(),
        arrival_terminal_name: generateTerminalName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      flightRecords.push(flightData);
    }

    await queryInterface.bulkInsert("Flight_schedulles", flightRecords, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Flight_schedulles", null, {});
  },
};

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate a random date and time within a range
function getRandomDateTime(startDate, maxDays) {
  const minTimestamp = startDate.getTime();
  const maxTimestamp = startDate.getTime() + maxDays * 24 * 60 * 60 * 1000;
  const randomTimestamp = getRandomNumber(minTimestamp, maxTimestamp);
  return new Date(randomTimestamp);
}

// Helper function to generate a random flight number
function generateFlightNumber() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters =
    letters.charAt(getRandomNumber(0, letters.length - 1)) +
    letters.charAt(getRandomNumber(0, letters.length - 1)) +
    letters.charAt(getRandomNumber(0, letters.length - 1));

  const randomDigits = getRandomNumber(100, 999);

  return randomLetters + randomDigits;
}

// Helper function to generate a random terminal name
function generateTerminalName() {
  const terminals = ["Terminal A", "Terminal B", "Terminal C", "Terminal D"];
  return terminals[getRandomNumber(0, terminals.length - 1)];
}
