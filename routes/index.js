const express = require("express");
const router = express.Router();
const user = require("../controllers/user");

const middlewares = require("../utils/middlewares");

const airline = require('../controllers/airline');
const airport = require('../controllers/airport');
const flight_schedulle = require('../controllers/flight_schedulle');
const flight_price = require('../controllers/flight_price');
const seat_class = require('../controllers/seat_class');

router.get("/", (req, res) => {
  return res.status(200).json({
    status: true,
    message: "welcome to auth api!",
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

router.get('/airlines', airline.index); 
router.get('/airlines/:airline_id', airline.show); 
router.post('/airlines', airline.store); 
router.put('/airlines/:airline_id', airline.update); 
router.delete('/airlines/:airline_id', airline.destroy);

router.get('/airports', airport.index); 
router.get('/airports/:airport_id', airport.show); 
router.post('/airports', airport.store); 
router.put('/airports/:airport_id', airport.update); 
router.delete('/airports/:airport_id', airport.destroy); 

router.get('/flight_schedulles', flight_schedulle.index); 
router.get('/flight_schedulles/:flight_schedulle_id', flight_schedulle.show); 
router.post('/flight_schedulles', flight_schedulle.store); 
router.put('/flight_schedulles/:flight_schedulle_id', flight_schedulle.update); 
router.delete('/flight_schedulles/:flight_schedulle_id', flight_schedulle.destroy); 

router.get('/flight_prices', flight_price.index); 
router.get('/flight_prices/:flight_price_id', flight_price.show); 
router.post('/flight_prices', flight_price.store); 
router.put('/flight_prices/:flight_price_id', flight_price.update); 
router.delete('/flight_prices/:flight_price_id', flight_price.destroy); 

router.get('/seat_classs', seat_class.index); 
router.get('/seat_classs/:seatclass_id', seat_class.show); 
router.post('/seat_classs', seat_class.store); 
router.put('/seat_classs/:seatclass_id', seat_class.update); 
router.delete('/seat_classs/:seatclass_id', seat_class.destroy); 

router.post("/auth/register", user.register);
router.post("/auth/login", user.login);
router.get("/auth/whoami", middlewares.auth, user.whoami);

module.exports = router;
