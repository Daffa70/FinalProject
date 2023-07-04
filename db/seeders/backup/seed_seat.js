"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const seats = [];

    const seatLayout = "3-2"; // Specify the desired seat layout
    const [desiredRowCount, desiredColumnCount] = seatLayout
      .split("-")
      .map(Number);
    const totalSeats = 29; // Specify the total number of seats

    const maxRowCount = Math.floor(totalSeats / desiredColumnCount);
    const rowCount = Math.min(desiredRowCount, maxRowCount);
    const columnCount = Math.ceil(totalSeats / rowCount);

    const rows = Array.from({ length: rowCount }, (_, i) => (i + 1).toString());
    const columns = Array.from({ length: columnCount }, (_, i) =>
      String.fromCharCode(65 + i)
    );

    let seatCounter = 1;
    for (let row of rows) {
      for (let column of columns) {
        if (seatCounter > totalSeats) {
          break;
        }

        seats.push({
          schedulle_id: 1,
          seat_no: column + row,
          status: "available",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        seatCounter++;
      }
    }

    await queryInterface.bulkInsert("Seats", seats, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Seats", null, {});
  },
};
