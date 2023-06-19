const cron = require("node-cron");
const { Order } = require("../db/models");
const { Op } = require("sequelize");
const moment = require("moment-timezone");

module.exports = {
  schedulleUpdateExpiredUser: async () => {
    try {
      const currentDateTime = new Date();
      const orders = await Order.findAll({
        where: {
          last_payment_date: {
            [Op.lte]: currentDateTime,
          },
          payment_status: "UNPAID",
        },
      });

      for (const order of orders) {
        const updated = await Order.update(
          { payment_status: "expired" },
          { where: { id: order.id } }
        );

        notification.sendNotification(
          order.user_id,
          "Pembayaran Anda Expired",
          "Pembayaran Anda Sudah Mencapai Batas Waktu"
        );
      }
    } catch (error) {
      throw error;
    }
  },
  checkTime: async () => {
    const currentTime = moment().tz("Asia/Jakarta"); // Replace 'America/New_York' with the desired timezone
    const formattedTime = currentTime.format("YYYY-MM-DD HH:mm:ss");
    console.log("Current time:", formattedTime);
  },
};
