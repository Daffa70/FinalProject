const express = require("express");
const router = express.Router();
const user = require("../controllers/user");

const middlewares = require("../utils/middlewares");

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

router.post("/auth/register", user.register);
router.post("/auth/login", user.login);
router.get("/auth/whoami", middlewares.auth, user.whoami);

module.exports = router;
