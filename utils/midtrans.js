const { CLIENT_KEY_MIDTRANS, SERVER_KEY_MIDTRANS } = process.env;
const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: SERVER_KEY_MIDTRANS,
  clientKey: CLIENT_KEY_MIDTRANS,
});

module.exports = {
  generateSnapUrl: async (
    booking_code,
    total,
    flight_number,
    totalPerson,
    name,
    email
  ) => {
    // prepare Snap API parameter ( refer to: https://snap-docs.midtrans.com ) minimum parameter example:
    let parameter = {
      transaction_details: {
        order_id: booking_code,
        gross_amount: total,
      },
      item_details: [
        {
          price: total,
          quantity: totalPerson,
          name: flight_number,
        },
      ],
      customer_details: {
        first_name: name,
        email: email,
      },
      page_expiry: {
        duration: 15,
        unit: "minute",
      },
      credit_card: {
        secure: true,
      },
    };

    let transactionRedirectUrl;
    // create transaction
    await snap
      .createTransaction(parameter)
      .then((transaction) => {
        // transaction token
        let transactionToken = transaction.token;
        console.log("transactionToken:", transactionToken);

        // transaction redirect url
        transactionRedirectUrl = transaction.redirect_url;
        console.log("transactionRedirectUrl:", transactionRedirectUrl);
      })
      .catch((e) => {
        console.log("Error occured:", e.message);
      });

    return transactionRedirectUrl;
  },
  paymentNotification: async (notificationJson) => {
    await snap.transaction
      .notification(notificationJson)
      .then((statusResponse) => {
        return statusResponse;
      });
  },
};
