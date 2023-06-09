const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const passenger = require("../controllers/passenger");
const order = require("../controllers/order");
const payment = require("../controllers/payment");
const payment_method = require("../controllers/payment_method");

const middlewares = require("../utils/middlewares");

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

router.post("/auth/register", user.register);
router.post("/auth/login", user.login);
router.get("/auth/whoami", middlewares.auth, user.whoami);

// Passenger
router.post("/passenger", passenger.store);
router.get("/passenger", passenger.showAll);
router.get("/passenger/:id", passenger.showIndex);
router.put("/passenger/:id", passenger.update);
router.delete("/passenger/:id", passenger.destroy);

// Order
router.post("/order", order.store);
router.get("/order", order.showAll);
router.get("/order/:id", order.showIndex);
router.put("/order/:id", order.update);
router.delete("/order/:id", order.destroy);

// Payment
router.post("/payment", payment.store);
router.get("/payment", payment.showAll);
router.get("/payment/:id", payment.showIndex);
router.put("/payment/:id", payment.update);
router.delete("/payment/:id", payment.destroy);

// Payment Method
router.post("/payment_method", payment_method.store);
router.get("/payment_method", payment_method.showAll);
router.get("/payment_method/:id", payment_method.showIndex);
router.put("/payment_method/:id", payment_method.update);
router.delete("/payment_method/:id", payment_method.destroy);

module.exports = router;
