const { Order } = require("../db/models");
const midtrans = require("../utils/midtrans");
const notification = require("./notification");

module.exports = {
  notifyMidtrans: async (req, res) => {
    const transactionStatus = req.body;
    // let status;

    // console.log(transactionStatus);
    const order = await Order.findOne({
      where: {
        booking_code: transactionStatus.order_id,
      },
    });
    if (transactionStatus.transaction_status === "settlement") {
      status = "ISSUED";
      notification.sendNotification(
        order.user_id,
        "Pembayaran Anda Sudah Masuk",
        "Pesanan Anda Sudah Kami Terima"
      );
    } else {
      status = transactionStatus.transaction_status.toUpperCase();
      notification.sendNotification(
        order.user_id,
        `Pembayaran Anda ${status}`,
        `Pembayaran Anda ${status}`
      );
    }

    const update = await Order.update(
      { payment_status: status },
      {
        where: { booking_code: transactionStatus.order_id },
      }
    );

    res.status(200).send("success");
  },
};
