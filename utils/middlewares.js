const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const { User } = require("../db/models");

module.exports = {
  auth: async (req, res, next) => {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        return res.status(401).json({
          status: false,
          message: "You're not authorized!",
          data: null,
        });
      }

      try {
        const data = await jwt.verify(authorization, JWT_SECRET_KEY);

        const user = await User.findOne({
          where: { id: data.id },
        });

        req.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          email_verify_at: user.email_verify_at,
          phone: user.phone,
          user_type: user.user_type,
          avatar: user.avatar,
        };

        next();
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            status: false,
            message: "Token expired. Please log in again.",
            data: null,
          });
        }
        throw err;
      }
    } catch (err) {
      next(err);
    }
  },
};
