const e = require("express");
const {
  Flight_schedulle,
  Airline,
  Airport,
  Airplane,
  SeatClass,
  Seat,
} = require("../db/models");
const moment = require("moment");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  index: async (req, res, next) => {
    try {
      const flight_schedulle = await Flight_schedulle.findAll({
        include: ["airplane", "departure_airport", "arrival_airport", "class"],
      });

      return res.status(200).json({
        status: true,
        message: "success",
        data: flight_schedulle,
      });
    } catch (error) {
      next(error);
    }
  },
  store: async (req, res, next) => {
    try {
      const {
        airplane_id,
        departure_airport_id,
        arrival_airport_id,
        flight_number,
        free_baggage,
        cabin_baggage,
        price,
        class_id,
        departure_terminal_name,
        arrival_terminal_name,
        departure_time,
        arrival_time,
      } = req.body;

      const convertedDepartureTime = moment(departure_time);
      const convertedArrivalTime = moment(arrival_time);

      const ready = await Flight_schedulle.findOne({
        where: {
          airplane_id,
          departure_airport_id,
          arrival_airport_id,
          flight_number,
          free_baggage,
          cabin_baggage,
          price,
          class_id,
        },
      });

      const airlineReady = await Airline.findOne({
        where: { id: airplane_id },
      });
      const depatureAirportReady = await Airport.findOne({
        where: { id: departure_airport_id },
      });
      const arrivalAirportReady = await Airport.findOne({
        where: { id: arrival_airport_id },
      });

      if (ready) {
        return res.status(404).json({
          status: false,
          message: "flight_schedulle is already exist",
          data: null,
        });
      }
      if (!airlineReady) {
        return res.status(404).json({
          status: false,
          message: "airline is not found",
          data: null,
        });
      }
      if (!depatureAirportReady) {
        return res.status(404).json({
          status: false,
          message: "depature airport is not found",
          data: null,
        });
      }
      if (!arrivalAirportReady) {
        return res.status(404).json({
          status: false,
          message: "arrival airport is not found",
          data: null,
        });
      }

      const timeDifferenceMs = convertedArrivalTime - convertedDepartureTime;
      const durationMinutes = Math.floor(timeDifferenceMs / (1000 * 60));

      const departureDateTime = new Date(departure_time);
      const departureDate = departureDateTime.toISOString().split("T")[0];
      const departureTime = departureDateTime
        .toISOString()
        .split("T")[1]
        .slice(0, 8);

      const arrivalDateTime = new Date(arrival_time);
      const arrivalDate = arrivalDateTime.toISOString().split("T")[0];
      const arrivalTime = arrivalDateTime
        .toISOString()
        .split("T")[1]
        .slice(0, 8);

      let seatAvaiable = 30;

      const airplane = await Airplane.findOne({ where: { id: airplane_id } });

      if (airplane.total_seat != null) {
        seatAvaiable = airplane.total_seat;
      }

      const flight_schedulle = await Flight_schedulle.create({
        airplane_id: airplane_id,
        departure_time,
        arrival_time,
        departure_airport_id: departure_airport_id,
        arrival_airport_id: arrival_airport_id,
        flight_number,
        free_baggage,
        cabin_baggage,
        price,
        class_id,
        duration: durationMinutes,
        departure_terminal_name,
        arrival_terminal_name,
        seat_available: seatAvaiable,
      });

      await generateSeats(
        flight_schedulle.id,
        airplane.seat_layout,
        airplane.total_seat
      );

      return res.status(201).json({
        status: true,
        message: "success",
        data: flight_schedulle,
      });
    } catch (error) {
      next(error);
    }
  },
  show: async (req, res, next) => {
    try {
      const { flight_schedulle_id, flight_schedulle_return_id } = req.query;

      const flight_schedulle = await Flight_schedulle.findOne({
        where: { id: flight_schedulle_id },
        include: [
          "airplane",
          "departure_airport",
          "arrival_airport",
          "class",
          "seats",
        ],
      });

      if (!flight_schedulle) {
        return res.status(401).json({
          status: false,
          message: `can't find flight_schedulle with id ${flight_schdulle_id}`,
          data: null,
        });
      }

      if (flight_schedulle_return_id) {
        const flight_schedulle_return = await Flight_schedulle.findOne({
          where: { id: flight_schedulle_return_id },
          include: [
            "airplane",
            "departure_airport",
            "arrival_airport",
            "class",
            "seats",
          ],
        });

        return res.status(200).json({
          status: true,
          message: "success",
          data: {
            departure: flight_schedulle,
            return: flight_schedulle_return,
          },
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "success",
          data: {
            departure: flight_schedulle,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { flight_schdulle_id } = req.params;

      const updated = await Flight_schedulle.update(req.body, {
        where: { id: flight_schdulle_id },
      });

      if (updated[0] == 0) {
        return res.status(404).json({
          status: false,
          message: `can't find flight_schedulle with id ${flight_schdulle_id}`,
          data: null,
        });
      }

      return res.status(201).json({
        status: true,
        message: "success",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },
  destroy: async (req, res, next) => {
    try {
      const { flight_schdulle_id } = req.params;

      const deleted = await Flight_schedulle.destroy({
        where: { id: flight_schdulle_id },
      });

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: `can't find flight_schedulle with id ${flight_schdulle_id}`,
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "success",
        data: deleted,
      });
    } catch (error) {
      next(error);
    }
  },

  getSearch: async (req, res, next) => {
    try {
      const { sort, page } = req.query;
      const {
        dep_airport,
        arr_airport,
        departure_time,
        return_time,
        seatclass,
        person,
      } = req.body;

      const pageSize = 20;

      let sortBy = "";
      let orderBy = "";
      if (sort == "price_asc" || !sort) {
        sortBy = "price";
        orderBy = "ASC";
      } else if (sort == "duration_asc") {
        sortBy = "duration";
        orderBy = "ASC";
      } else if (sort == "arrival_asc") {
        sortBy = "arrival_time";
        orderBy = "ASC";
      } else if (sort == "arrival_desc") {
        sortBy = "arrival_time";
        orderBy = "DESC";
      } else if (sort == "departure_asc") {
        sortBy = "departure_time";
        orderBy = "ASC";
      } else if (sort == "departure_asc") {
        sortBy = "departure_time";
        orderBy = "DESC";
      }

      // Parse the departure_time string into a Date object
      const departureTime = new Date(departure_time);

      // Get the start and end of the departure_time date
      const startDate = new Date(
        departureTime.getFullYear(),
        departureTime.getMonth(),
        departureTime.getDate()
      );

      const endDate = new Date(
        departureTime.getFullYear(),
        departureTime.getMonth(),
        departureTime.getDate()
      );
      endDate.setDate(endDate.getDate() + 1);

      const offset = (page - 1) * pageSize; // Calculate the offset based on the page number and page size
      const limit = parseInt(pageSize); // Convert the pageSize to an integer

      const flight_schedulle = await Flight_schedulle.findAll({
        include: [
          {
            model: Airplane,
            as: "airplane",
          },
          {
            model: Airport,
            as: "departure_airport",
            where: { code: dep_airport },
          },
          {
            model: Airport,
            as: "arrival_airport",
            where: { code: arr_airport },
          },
          {
            model: SeatClass,
            as: "class",
            where: { name: seatclass },
          },
          {
            model: Seat,
            as: "seats",
            order: ["id"],
          },
        ],
        where: {
          departure_date: {
            [Op.eq]: departure_time,
          },
          seat_available: {
            [Op.gte]: person,
          },
        },
        order: [[sortBy, orderBy]],
        offset,
        limit,
      });

      if (!flight_schedulle || flight_schedulle.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Can't find flight_schedule",
          data: null,
        });
      }

      if (return_time) {
        const returnTime = new Date(return_time);
        const endReturnDate = new Date(
          returnTime.getFullYear(),
          returnTime.getMonth(),
          returnTime.getDate()
        );

        const flight_schedulle_return = await Flight_schedulle.findAll({
          include: [
            {
              model: Airplane,
              as: "airplane",
            },
            {
              model: Airport,
              as: "departure_airport",
              where: { code: arr_airport },
            },
            {
              model: Airport,
              as: "arrival_airport",
              where: { code: dep_airport },
            },
            {
              model: SeatClass,
              as: "class",
              where: { name: seatclass },
            },
            {
              model: Seat,
              as: "seats",
            },
          ],
          where: {
            departure_date: {
              [Op.between]: [departure_time, return_time],
            },
            seat_available: {
              [Op.gte]: person,
            },
          },
          order: [[sortBy, orderBy]],
          offset, // Apply the offset
          limit, // Apply the limit
        });

        return res.status(200).json({
          status: true,
          message: "Success",
          data: {
            departure: flight_schedulle,
            return: flight_schedulle_return,
          },
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Success",
          data: {
            departure: flight_schedulle,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },
};

function generateSeats(schedule_id, seat_layout, total_seat) {
  const seats = [];

  let seatLayout;
  if (seat_layout != null) {
    seatLayout = seat_layout;
  } else {
    seatLayout = "3-3";
  }

  const [leftSeats, rightSeats] = seatLayout.split("-").map(Number);
  const totalSeats = total_seat; // Specify the total number of seats

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

      // Assuming you have a Seat model or schema defined, you can create a new seat entry here
      const newSeat = new Seat({
        schedulle_id: schedule_id,
        seat_no: seat,
        status: "available",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Save the new seat entry to the database or perform any necessary operations
      newSeat.save();

      seatCounter++;
    }
  }
}
