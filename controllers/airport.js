const { Airport, Flight_schedulle } = require("../db/models");
const { Sequelize, Op } = require("sequelize");
const moment = require("moment");

module.exports = {
  index: async (req, res, next) => {
    try {
      const airport = await Airport.findAll();

      return res.status(200).json({
        status: true,
        message: "success",
        data: airport,
      });
    } catch (error) {
      next(error);
    }
  },
  store: async (req, res, next) => {
    try {
      const { name, city, state, airport_type, code } = req.body;
      const ready = await Airport.findOne({ where: { name: name } });

      if (ready) {
        return res.status(404).json({
          status: false,
          message: "airport is already exist",
          data: null,
        });
      }
      const airport = await Airport.create({
        name: name,
        city: city,
        state: state,
        airport_type: airport_type,
        code: code,
      });

      return res.status(201).json({
        status: true,
        message: "success",
        data: airport,
      });
    } catch (error) {
      next(error);
    }
  },
  show: async (req, res, next) => {
    try {
      const { airport_id } = req.params;

      const airport = await Airport.findOne({
        where: { id: airport_id },
      });

      if (!airport) {
        return res.status(401).json({
          status: false,
          message: `can't find airport with id ${airport_id}`,
          data: null,
        });
      }
      return res.status(200).json({
        status: true,
        message: "success",
        data: airport,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { airport_id } = req.params;

      const updated = await Airport.update(req.body, {
        where: { id: airport_id },
      });

      if (updated[0] == 0) {
        return res.status(404).json({
          status: false,
          message: `can't find airport with id ${airport_id}`,
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
      const { airport_id } = req.params;

      const deleted = await Airport.destroy({ where: { id: airport_id } });

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: `can't find airport with id ${airport_id}`,
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
  getSearchStateCountry: async (req, res, next) => {
    try {
      const { citystate } = req.params;

      const airport = await Airport.findAll({
        where: {
          [Sequelize.Op.or]: [
            { city: { [Sequelize.Op.iLike]: `%${citystate}%` } },
            { state: { [Sequelize.Op.iLike]: `%${citystate}%` } },
          ],
        },
      });

      if (!airport) {
        return res.status(401).json({
          status: false,
          message: `Can't find airport for city/state: ${citystate}`,
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "Success",
        data: airport,
      });
    } catch (error) {
      next(error);
    }
  },
  mostVisited: async (req, res, next) => {
    try {
      const { continent } = req.query;
      const departureDate = moment().format("YYYY-MM-DD");

      let airport;

      if (!continent || continent == "Semua") {
        airport = await Airport.findAll({
          include: [
            {
              where: { departure_date: { [Op.eq]: departureDate } }, // Filter by departure date
              model: Flight_schedulle,
              as: "arrival_airport",
              attributes: [],
              order: [["price", "ASC"]],
              limit: 1,
              include: [
                {
                  model: Airport,
                  as: "departure_airport",
                },
                {
                  model: Airport,
                  as: "arrival_airport",
                },
              ],
            },
          ],
          order: [["total_visit", "DESC"]],
          limit: 5,
        });
      } else {
        airport = await Airport.findAll({
          include: [
            {
              where: { departure_date: { [Op.eq]: departureDate } }, // Filter by departure date
              model: Flight_schedulle,
              as: "flight_schedulle",
              order: [["price", "ASC"]],
              limit: 1,
              include: [
                {
                  model: Airport,
                  as: "departure_airport",
                },
                {
                  model: Airport,
                  as: "arrival_airport",
                },
              ],
            },
          ],
          where: { continent: continent },
          order: [["total_visit", "DESC"]],
          limit: 5,
        });
      }

      if (!airport || airport.length === 0) {
        return res.status(401).json({
          status: false,
          message: `can't find airport`,
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "Success",
        data: airport,
      });
    } catch (error) {
      next(error);
    }
  },
};
