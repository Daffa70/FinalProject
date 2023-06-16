const cron = require("node-cron");
const { Order } = require("../db/models");
const { Op } = require("sequelize");

module.exports = {
  schedulleUpdateExpiredUser: async () => {
    try {
      const currentDateTime = new Date();
      const orders = await Order.findAll({
        where: {
          last_payment_date: {
            [Op.lte]: currentDateTime,
          },
        },
      });

      for (const order of orders) {
        const updated = await Order.update(
          { status: "expired" },
          { where: { id: order.id } }
        );
      }
    } catch (error) {
      throw error;
    }
  },
};
