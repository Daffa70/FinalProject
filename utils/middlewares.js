const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;

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

        if (!data.email_verify_at) {
          return res.status(401).json({
            status: false,
            message: "You're not verified!",
            data: null,
          });
        }

        req.user = {
          id: data.id,
          name: data.name,
          email: data.email,
          email_verify_at: data.email_verify_at,
          phone: data.phone,
          user_type: data.user_type,
          avatar: data.avatar,
        };

        next();
      } catch (err) {
        return res.status(401).json({
          status: false,
          message: "Invalid token!",
          data: null,
        });
      }
    } catch (err) {
      next(err);
    }
  },
};
