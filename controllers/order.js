const {
  Order,
  Passenger,
  Seat,
  Flight_schedulle,
  Airport,
} = require("../db/models");
const helper = require("../utils/helper");
const moment = require("moment-timezone");
const notification = require("./notification");
const { Op, Sequelize } = require("sequelize");
const midtrans = require("../utils/midtrans");

moment.tz.setDefault("Asia/Jakarta");
module.exports = {
  store: async (req, res) => {
    try {
      const { user_id, full_name, family_name, title, email, phone } = req.body;

      const order = await Order.create({
        user_id,
        full_name,
        family_name,
        title,
        email,
        phone,
      });

      return res.status(201).json({
        status: true,
        message: "success",
        data: order,
      });
    } catch (error) {
      throw error;
    }
  },

  showAll: async (req, res) => {
    try {
      const order = await Order.findAll();

      return res.status(200).json({
        status: true,
        message: "success",
        data: order,
      });
    } catch (error) {
      throw error;
    }
  },

  showIndex: async (req, res) => {
    try {
      const { order_id } = req.params;

      const order = await Order.findOne({ where: { id: order_id } });
      if (!order) {
        return res.status(404).json({
          status: false,
          message: `can't find order with id ${order_id}!`,
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "success",
        data: order,
      });
    } catch (error) {
      throw error;
    }
  },

  update: async (req, res) => {
    try {
      const { order_id } = req.params;

      const updated = await Order.update(req.body, { where: { id: order_id } });
      if (!updated) {
        return res.status(404).json({
          status: false,
          message: `can't find order with id ${order_id}!`,
          data: null,
        });
      }

      return res.status(201).json({
        status: true,
        message: "success",
        data: updated,
      });
    } catch (error) {
      throw error;
    }
  },

  destroy: async (req, res) => {
    try {
      const { order_id } = req.params;

      const deleted = await Order.destroy({ where: { id: order_id } });
      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: `can't find order with id ${order_id}!`,
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "success",
        data: null,
      });
    } catch (error) {
      throw error;
    }
  },
  checkout: async (req, res) => {
    try {
      const { full_name, family_name, email } = req.body;
      const passengerDetails = req.body.passengers;

      const { scheduleid, schedulereturnid } = req.query;

      const { id: user_id } = req.user;

      const schedulle = await Flight_schedulle.findOne({
        where: { id: scheduleid },
      });

      let total_price = await totalPrice(
        schedulle.price,
        passengerDetails.length,
        null
      );

      if (schedulereturnid) {
        const schedullereturn = await Flight_schedulle.findOne({
          where: { id: schedulereturnid },
        });

        total_price = await totalPrice(
          schedulle.price,
          passengerDetails.length,
          schedullereturn.price
        );
      }

      const booking_code = await helper.generateBookingCode(user_id);
      const url_midtrans = await midtrans.generateSnapUrl(
        booking_code,
        total_price,
        schedulle.flight_number,
        passengerDetails.length,
        full_name + family_name,
        email
      );

      console.log(url_midtrans);

      const currentDate = moment();
      const fifteenMinutesFromNow = moment(currentDate).add(15, "minutes");

      const order = await Order.create({
        user_id,
        full_name,
        family_name,
        email,
        schedulle_id: scheduleid,
        schedulle_return_id: schedulereturnid,
        booking_code,
        total_price,
        url_midtrans,
        payment_status: "UNPAID",
        last_payment_date: fifteenMinutesFromNow,
      });

      for (const passenger of passengerDetails) {
        await Passenger.create({
          order_id: order.id,
          full_name: passenger.full_name,
          family_name: passenger.family_name,
          title: passenger.title,
          date_birth: moment(passenger.date_birth),
          nationality: passenger.nationality,
          identity_number: passenger.identity_number,
          issuing_country: passenger.issuing_country,
          identity_expired: passenger.identity_expired,
          schedulle_id: scheduleid,
          schedulle_return_id: schedulereturnid,
          seat_id: passenger.seat_id,
          seat_return_id: passenger.seat_return_id,
        });

        await Seat.update(
          { status: "unavaiable" },
          { where: { id: passenger.seat_id } }
        );

        await Flight_schedulle.decrement("seat_available", {
          where: { id: scheduleid },
        });

        await Airport.increment("total_visit", {
          where: { id: schedulle.arrival_airport_id },
        });

        if (schedulereturnid) {
          const schedullereturn = await Flight_schedulle.findOne({
            where: { id: schedulereturnid },
          });

          await Seat.update(
            { status: "unavaiable" },
            { where: { id: passenger.seat_return_id } }
          );

          await Flight_schedulle.decrement("seat_available", {
            where: { id: schedulereturnid },
          });

          await Airport.increment("total_visit", {
            where: { id: schedullereturn.arrival_airport_id },
          });
        }
      }

      notification.sendNotification(
        user_id,
        "Pesanan Anda Sudah Masuk",
        "Pesanan Anda Sudah Berhasil Kami Terima"
      );

      return res.status(201).json({
        status: true,
        message: "success",
        data: order,
      });
    } catch (error) {
      throw error;
    }
  },

  showUser: async (req, res) => {
    try {
      const { startDateFilter, endDateFilter, flightNumber, sort, page } =
        req.query;

      let whereCondition = {
        user_id: req.user.id,
      };

      // Add the created_at filter if startDateFilter and endDateFilter are not null
      if (startDateFilter && endDateFilter) {
        const startDateString = new Date(startDateFilter);
        const endDateString = new Date(endDateFilter);
        const startDate = new Date(
          startDateString.getFullYear(),
          startDateString.getMonth(),
          startDateString.getDate()
        );
        const endDate = new Date(
          endDateString.getFullYear(),
          endDateString.getMonth(),
          endDateString.getDate()
        );

        whereCondition.createdAt = {
          [Op.between]: [startDate, endDate],
        };
      }

      let sortBy = "";
      let orderBy = "";
      if (sort == "created_asc" || !sort) {
        sortBy = "createdAt";
        orderBy = "ASC";
      } else if (sort == "crerated_desc") {
        sortBy = "createdAt";
        orderBy = "desc";
      }

      // Add the booking_code filter if flightNumber is not null
      if (flightNumber) {
        whereCondition.booking_code = flightNumber;
      }

      const pageSize = 20;
      const offset = (page - 1) * pageSize; // Calculate the offset based on the page number and page size
      const limit = parseInt(pageSize); // Convert the pageSize to an integer

      const order = await Order.findAll({
        where: whereCondition,
        include: [
          {
            model: Flight_schedulle,
            as: "schedulle",
          },
          {
            model: Flight_schedulle,
            as: "schedulle_return",
          },
          {
            model: Passenger,
            as: "passengers",
          },
        ],
        order: [[sortBy, orderBy]],
        offset,
        limit,
      });

      if (!order || order == "") {
        return res.status(404).json({
          status: false,
          message: `can't find order`,
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "success",
        data: order,
      });
    } catch (error) {
      throw error;
    }
  },
};

function totalPrice(price, totalPassanger, price_return) {
  let totalPrice = price * totalPassanger;

  if (price_return) {
    const totalPriceReturn = price_return * totalPassanger;
    totalPrice = totalPrice + totalPriceReturn;
  }

  return totalPrice;
}
