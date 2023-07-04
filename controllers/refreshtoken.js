const jwt = require("jsonwebtoken");
const {
  JWT_SECRET_KEY,
  JWT_EXPIRATION_TIME,
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_EXPIRATION_TIME,
} = process.env;

module.exports = {
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          status: false,
          message: "Refresh token not provided!",
          data: null,
        });
      }

      try {
        const data = await jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY);

        // Generate a new access token using the refreshed user data
        const payload = {
          id: data.id,
          name: data.name,
          email: data.email,
          email_verify_at: data.email_verify_at,
          phone: data.phone,
          user_type: data.user_type,
          avatar: data.avatar,
        };

        const token = await jwt.sign(payload, JWT_SECRET_KEY, {
          expiresIn: JWT_EXPIRATION_TIME,
        });

        return res.status(200).json({
          status: true,
          message: "Token refreshed successfully!",
          data: {
            token: token,
          },
        });
      } catch (err) {
        return res.status(401).json({
          status: false,
          message: "Invalid refresh token!",
          data: null,
        });
      }
    } catch (err) {
      throw err;
    }
  },
};
