const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const passenger = require("../controllers/passenger");
const order = require("../controllers/order");
const payment = require("../controllers/payment");
const payment_method = require("../controllers/payment_method");

const middlewares = require("../utils/middlewares");

const airline = require("../controllers/airline");
const airport = require("../controllers/airport");
const flight_schedulle = require("../controllers/flight_schedulle");
const flight_price = require("../controllers/flight_price");
const seat_class = require("../controllers/seat_class");
const notification = require("../controllers/notification");

router.get("/", (req, res) => {
  return res.status(200).json({
    status: true,
    message: "Welcome to Final Project!",
    data: null,
  });
});

router.get("/error", (req, res) => {
  let data = {
    status: false,
    message: "error!",
    data: null,
  };
  return res.status(500).json(data);
});

//important!, using for front end
router.post("/auth/register", user.register);
router.post("/auth/login", user.login);
router.get("/auth/whoami", middlewares.auth, user.whoami);
router.post("/auth/resend-otp", user.resendOtp);
router.post("/auth/verify-otp", user.verifyOtp);
router.post("/auth/send-reset-password", user.sendResetPassword);
router.post("/auth/reset-password", user.resetPassword);

//home
router.get("/flight_schedulles_detail", flight_schedulle.getSearch);
router.get("/airports/search/:citystate", airport.getSearchStateCountry);

//checkout process
router.post("/checkout-user", middlewares.auth, order.checkout);

//user
router.get("/notification-user", middlewares.auth, notification.getNotify);
router.get("/orders-user", middlewares.auth, order.showUser);
////
router.get("/airlines", airline.index);
router.get("/airlines/:airline_id", airline.show);
router.post("/airlines", airline.store);
router.put("/airlines/:airline_id", airline.update);
router.delete("/airlines/:airline_id", airline.destroy);

router.get("/airports", airport.index);
router.get("/airports/:airport_id", airport.show);
router.post("/airports", airport.store);
router.put("/airports/:airport_id", airport.update);
router.delete("/airports/:airport_id", airport.destroy);

router.get("/flight_schedulles", flight_schedulle.index);
router.get("/flight_schedulles/:flight_schedulle_id", flight_schedulle.show);
router.post("/flight_schedulles", flight_schedulle.store);
router.put("/flight_schedulles/:flight_schedulle_id", flight_schedulle.update);
router.delete(
  "/flight_schedulles/:flight_schedulle_id",
  flight_schedulle.destroy
);

router.get("/flight_prices", flight_price.index);
router.get("/flight_prices/:flight_price_id", flight_price.show);
router.post("/flight_prices", flight_price.store);
router.put("/flight_prices/:flight_price_id", flight_price.update);
router.delete("/flight_prices/:flight_price_id", flight_price.destroy);

router.get("/seat_classs", seat_class.index);
router.get("/seat_classs/:seatclass_id", seat_class.show);
router.post("/seat_classs", seat_class.store);
router.put("/seat_classs/:seatclass_id", seat_class.update);
router.delete("/seat_classs/:seatclass_id", seat_class.destroy);

router.post("/auth/register", user.register);
router.post("/auth/login", user.login);
router.get("/auth/whoami", middlewares.auth, user.whoami);
router.get('/auth/oauth', user.googleOauth2);
router.post("/auth/resend-otp", user.resendOtp);
router.post("/auth/verify-otp", user.verifyOtp);
router.post("/auth/send-reset-password", user.sendResetPassword);
router.post("/auth/reset-password", user.resetPassword);
// Passenger
router.post("/passengers", passenger.store);
router.get("/passengers", passenger.showAll);
router.get("/passengers/:passenger_id", passenger.showIndex);
router.put("/passengers/:passenger_id", passenger.update);
router.delete("/passengers/:passenger_id", passenger.destroy);

// Order
router.post("/orders", order.store);
router.get("/orders", order.showAll);
router.get("/orders/:order_id", order.showIndex);
router.put("/orders/:order_id", order.update);
router.delete("/orders/:order_id", order.destroy);

// Payment
router.post("/payments", payment.store);
router.get("/payments", payment.showAll);
router.get("/payments/:payment_id", payment.showIndex);
router.put("/payments/:payment_id", payment.update);
router.delete("/payments/:payment_id", payment.destroy);

// Payment Method
router.post("/payment_methods", payment_method.store);
router.get("/payment_methods", payment_method.showAll);
router.get("/payment_methods/:payment_method_id", payment_method.showIndex);
router.put("/payment_methods/:payment_method_id", payment_method.update);
router.delete("/payment_methods/:payment_method_id", payment_method.destroy);

module.exports = router;
