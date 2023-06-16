const {
  Order,
  Passenger,
  Seat,
  Payment,
  Flight_schedulle,
} = require("../db/models");
const helper = require("../utils/helper");
const moment = require("moment");
const notification = require("./notification");
const { Op, Sequelize } = require("sequelize");
const midtrans = require("../utils/midtrans");

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

      const { scheduleid } = req.query;

      const { id: user_id } = req.user;

      const schedulle = await Flight_schedulle.findOne({
        where: { id: scheduleid },
      });

      const total_price = await totalPrice(
        schedulle.price,
        passengerDetails.length
      );
      const booking_code = await helper.generateBookingCode(user_id);
      const url_midtrans = await midtrans.generateSnapUrl(
        booking_code,
        total_price,
        schedulle.flight_number,
        schedulle.price,
        passengerDetails.length,
        full_name + family_name,
        email
      );

      const currentDate = new Date();
      const fifteenMinutesFromNow = new Date(
        currentDate.getTime() + 15 * 60000
      ); // 15 minutes * 60 seconds * 1000 milliseconds

      const order = await Order.create({
        user_id,
        full_name,
        family_name,
        email,
        schedulle_id: scheduleid,
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
          seat_id: passenger.seat_id,
        });

        await Seat.update(
          { status: "unavaiable" },
          { where: { id: passenger.seat_id } }
        );

        await Flight_schedulle.decrement("seat_available", {
          where: { id: scheduleid },
        });
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
      const { startDateFilter, endDateFilter, flightNumber } = req.query;

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

      // Add the booking_code filter if flightNumber is not null
      if (flightNumber) {
        whereCondition.booking_code = flightNumber;
      }

      const order = await Order.findAll({
        where: whereCondition,
        include: [
          {
            model: Flight_schedulle,
            as: "schedulle",
          },
          {
            model: Passenger,
            as: "passengers",
          },
        ],
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
  notifyMidtrans: async (req, res) => {
    const transactionStatus = req.body;
    let status;

    console.log(transactionStatus);
    if (transactionStatus.transaction_status === "settlement") {
      status = "ISSUED";
    } else {
      status = transactionStatus.transaction_status.toUpperCase();
    }

    const order = Order.update(
      { payment_status: status },
      {
        where: { booking_code: transactionStatus.order_id },
      }
    );

    res.status(200).send("success");
  },
};

function totalPrice(price, totalPassanger) {
  const totalPrice = price * totalPassanger;

  return totalPrice;
}
