const {
  Flight_schedulle,
  Airline,
  Airport,
  Airplane,
} = require("../db/models");
const moment = require("moment");
const { Op } = require("sequelize");

module.exports = {
  index: async (req, res, next) => {
    try {
      const flight_schedulle = await Flight_schedulle.findAll({
        include: ["airplane", "departure_airport", "arrival_airport"],
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
        departure_time,
        arrival_time,
        departure_airport_id,
        arrival_airport_id,
        flight_number,
        free_baggage,
        cabin_baggage,
      } = req.body;
      const ready = await Flight_schedulle.findOne({
        where: {
          airplane_id,
          departure_time: moment(departure_time).format("YYYY-MM-DD HH:mm:ss"),
          arrival_time: moment(arrival_time).format("YYYY-MM-DD HH:mm:ss"),
          departure_airport_id,
          arrival_airport_id,
          flight_number,
          free_baggage,
          cabin_baggage,
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
      const flight_schedulle = await Flight_schedulle.create({
        airplane_id: airplane_id,
        departure_time: departure_time,
        arrival_time: arrival_time,
        departure_airport_id: departure_airport_id,
        arrival_airport_id: arrival_airport_id,
      });

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
      const { flight_schedulle_id } = req.params;

      const flight_schedulle = await Flight_schedulle.findOne({
        where: { id: flight_schedulle_id },
      });

      if (!flight_schedulle) {
        return res.status(401).json({
          status: false,
          message: `can't find flight_schedulle with id ${flight_schdulle_id}`,
          data: null,
        });
      }
      return res.status(200).json({
        status: true,
        message: "success",
        data: flight_schedulle,
      });
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
      const { dep, arr, departure_time } = req.params;

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

      const flight_schedulle = await Flight_schedulle.findAll({
        include: [
          {
            model: Airplane,
            as: "airplane",
          },
          {
            model: Airport,
            as: "departure_airport",
            where: { code: dep },
          },
          {
            model: Airport,
            as: "arrival_airport",
            where: { code: arr },
          },
        ],
        where: {
          departure_time: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      if (!flight_schedulle || flight_schedulle.length === 0) {
        return res.status(401).json({
          status: false,
          message: "Can't find flight_schedule",
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "Success",
        data: flight_schedulle,
      });
    } catch (error) {
      next(error);
    }
  },
};
