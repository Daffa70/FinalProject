"use strict";

/** @type {import('sequelize-cli').Migration} */

const {
  Flight_schedulle,
  Airline,
  Airport,
  Airplane,
  SeatClass,
  Seat,
} = require("../models");
const moment = require("moment");
const rawSchedules = require("./data/schedules.json");
const seatRecords = [];

module.exports = {
  async up(queryInterface, Sequelize) {
    const flightRecords = [];
    let count_id_flight = 1;

    const dbAirport = await Airport.findAll();
    const dbAirplane = await Airplane.findAll();

    const airports = {};
    const airplanes = {};

    dbAirport.forEach((airport) => {
      airports[airport.code] = airport;
    });
    dbAirplane.forEach((airplane) => {
      airplanes[airplane.code] = airplane;
    });

    for (const [key, value] of Object.entries(rawSchedules)) {
      const airportDepart = airports[value.departureAirport];
      const airportArrival = airports[value.arrivalAirport];
      const airplane = airplanes[value.aircraftId];

      let seatAvailable = 30;

      if (airplane.total_seat != null) {
        seatAvailable = airplane.total_seat;
      }

      if (value.class == "ECONOMY") {
        const scheduleDates = getScheduleDates(value);
        for (const date of scheduleDates) {
          const departureTime = moment(date).format("YYYY-MM-DD");
          const arrivalTime = moment(date).format("YYYY-MM-DD");

          flightRecords.push({
            airplane_id: airplane.id,
            departure_date: departureTime,
            arrival_date: arrivalTime,
            departure_time: value.departureTime,
            arrival_time: value.arrivalTime,
            departure_airport_id: airportDepart.id,
            arrival_airport_id: airportArrival.id,
            flight_number: value.flightNumber,
            free_baggage: value.freeBaggage,
            cabin_baggage: value.cabinBaggage,
            price: value.price,
            class_id: 1,
            duration: value.durationMinute,
            departure_terminal_name: value.departureTerminalName,
            arrival_terminal_name: value.arrivalTerminalName,
            seat_available: seatAvailable,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          await generateSeats(
            count_id_flight,
            airplane.seat_layout,
            airplane.total_seat
          );

          count_id_flight = count_id_flight + 1;
        }
      }
    }

    await queryInterface.bulkInsert("Flight_schedulles", flightRecords, {});
    await queryInterface.bulkInsert("Seats", seatRecords, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Flight_schedulles", null, {});
  },
};

function getScheduleDates(schedule) {
  const today = moment().startOf("day");
  const currentDay = today.day(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

  const scheduleDates = [];
  for (let i = currentDay; i <= 6; i++) {
    const isScheduledDay = schedule[`is${moment.weekdays(true)[i]}`];
    if (isScheduledDay) {
      const date = today.clone().add(i - currentDay, "days");
      scheduleDates.push(date);
    }
  }

  const remainingWeeks = Math.ceil(
    moment().endOf("month").diff(today, "days") / 7
  );
  for (let week = 1; week <= remainingWeeks; week++) {
    for (let i = 0; i <= 6; i++) {
      const isScheduledDay = schedule[`is${moment.weekdays(true)[i]}`];
      if (isScheduledDay) {
        const date = today.clone().add(week, "weeks").day(i);
        if (date.isBefore(moment().endOf("month"))) {
          scheduleDates.push(date);
        }
      }
    }
  }

  return scheduleDates;
}

function generateSeats(schedule_id, seat_layout, total_seat) {
  const seats = [];

  let seatLayout;
  if (seat_layout != null) {
    seatLayout = seat_layout;
  } else {
    seatLayout = "3-3";
  }

  const [leftSeats, rightSeats] = seatLayout.split("-").map(Number);

  let totalSeats = 30;
  if (total_seat) {
    totalSeats = total_seat;
  }

  const rowCount = Math.ceil(totalSeats / (leftSeats + rightSeats));

  const rows = Array.from({ length: rowCount }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const columns = Array.from(
    { length: leftSeats + rightSeats },
    (_, i) => i + 1
  );

  let seatCounter = 1;
  for (let row of rows) {
    for (let column of columns) {
      if (seatCounter > totalSeats) {
        break;
      }

      const seat = `${row}${column}`;

      seatRecords.push({
        schedulle_id: schedule_id,
        seat_no: seat,
        status: "available",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      seatCounter++;
    }
  }
}
