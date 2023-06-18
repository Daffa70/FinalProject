const { User, OtpVerify } = require("../db/models");
const bcryp = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const helper = require("../utils/helper");
const nodemailer = require("../utils/nodemailer");
const oauth2 = require("../utils/oauth2");
const imagekit = require("../utils/imagekit");
const multer = require("multer");
const upload = multer().single("media");

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;

      const exist = await User.findOne({ where: { email } });
      if (exist) {
        return res.status(400).json({
          status: false,
          message: "email already used!",
          data: null,
        });
      }

      const hashPassword = await bcryp.hash(password, 10);

      const user = await User.create({
        name,
        email,
        phone,
        password: hashPassword,
        user_type: "basic",
      });

      const otp_num = helper.generateOtpNumber();

      await OtpVerify.create({
        user_id: user.id,
        otp_num: otp_num,
        last_sent_at: Date.now(),
      });

      const html = await nodemailer.getHtml("otp-email.ejs", {
        name: user.name,
        otp_num: otp_num,
      });

      nodemailer.sendMail(user.email, "OTP for verification", html);

      return res.status(201).json({
        status: true,
        message: "user created!",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "email not found!",
          data: null,
        });
      }

      if (user.user_type == "google" && user.password == null) {
        return res.status(400).json({
          status: false,
          message:
            "your account is registered with google oauth, you need to login with google oauth!",
          data: null,
        });
      }

      const passwordCorrect = await bcryp.compare(password, user.password);
      if (!passwordCorrect) {
        return res.status(400).json({
          status: false,
          message: "password is not valid!",
          data: null,
        });
      }

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        email_verify_at: user.email_verify_at,
      };

      const token = await jwt.sign(payload, JWT_SECRET_KEY);
      return res.status(200).json({
        status: true,
        message: "login success!",
        data: {
          token: token,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  whoami: async (req, res) => {
    try {
      return res.status(200).json({
        status: true,
        message: "success!",
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({
        email: email,
      });

      if (!user) {
        return res.status(400).json({
          status: false,
          message: "email not found",
          data: null,
        });
      }

      const checkOtp = await OtpVerify.findOne({
        user_id: 5,
      });

      // console.log(checkOtp.user_id);

      if (checkOtp.otp_num != otp) {
        return res.status(400).json({
          status: false,
          message: "Incorrect OTP. Please try again",
          data: null,
        });
      }

      await User.update(
        {
          email_verify_at: Date.now(),
        },
        { where: { id: user.id } }
      );

      checkOtp.destroy();

      return res.status(200).json({
        status: true,
        message: "User is verified!",
        data: null,
      });
    } catch (error) {}
  },

  resendOtp: async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Email not found",
        data: null,
      });
    }

    const waitingPeriodMinutes = 5; // Set the waiting period in minutes
    const waitingPeriodMillis = waitingPeriodMinutes * 60 * 1000; // Convert to milliseconds

    const otpRecord = await OtpVerify.findOne({ where: { user_id: user.id } });

    if (otpRecord) {
      const lastSentAt = otpRecord.last_sent_at;
      const currentTime = new Date();
      const elapsedTime = currentTime - lastSentAt;

      if (elapsedTime < waitingPeriodMillis) {
        const remainingTime = waitingPeriodMillis - elapsedTime;
        const remainingTimeMinutes = Math.ceil(remainingTime / (60 * 1000));

        return res.status(429).json({
          status: false,
          message: `Please wait ${remainingTimeMinutes} minutes before resending the OTP.`,
          data: null,
        });
      }
    }

    const otp_num = helper.generateOtpNumber();

    await OtpVerify.update(
      {
        otp_num: otp_num,
        last_sent_at: new Date(), // Update the last sent timestamp
      },
      { where: { user_id: user.id } }
    );

    const html = await nodemailer.getHtml("otp-email.ejs", {
      name: user.name,
      otp_num: otp_num,
    });

    nodemailer.sendMail(user.email, "OTP for verification", html);

    return res.status(200).json({
      status: true,
      message: "OTP verification has been resent!",
      data: null,
    });
  },

  sendResetPassword: async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (user) {
      const payload = {
        id: user.id,
      };
      const token = await jwt.sign(payload, JWT_SECRET_KEY);
      const url = `${req.protocol}://${req.get(
        "host"
      )}/auth/reset-password?token=${token}`;

      const html = await nodemailer.getHtml("reset-password.ejs", {
        name: user.name,
        url,
      });

      nodemailer.sendMail(user.email, "Reset password request", html);
    }

    return res.status(200).json({
      status: true,
      message: "reset password mail is send to your email!",
      data: null,
    });
  },

  resetPassword: async (req, res) => {
    try {
      const { new_password, confirm_new_password } = req.body;

      const { token } = req.query;
      if (!token) {
        return res.status(401).json({
          message: "invalid token!",
          token,
        });
      }
      if (new_password != confirm_new_password) {
        return res.status(401).json({
          message: "confirm password does not match!",
          token,
        });
      }

      const data = await jwt.verify(token, JWT_SECRET_KEY);

      const hashPassword = await bcryp.hash(new_password, 10);
      const updated = await User.update(
        { password: hashPassword },
        { where: { id: data.id } }
      );
      if (updated[0] == 0) {
        return res.status(401).json({
          status: true,
          message: `reset password failed!`,
          data: null,
        });
      }

      return res.status(201).json({
        status: true,
        message: `reset password success!`,
        data: null,
      });
    } catch (err) {
      throw err;
    }
  },

  googleOauth2: async (req, res) => {
    const { code } = req.query;
    if (!code) {
      const googleLoginUrl = oauth2.generateAuthUrl();
      return res.redirect(googleLoginUrl);
    }

    await oauth2.setCredentials(code);
    const { data } = await oauth2.getUserData();

    let user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      user = await User.create({
        name: data.name,
        email: data.email,
        user_type: "google",
        email_verify_at: new Date(),
      });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      email_verify_at: user.email_verify_at,
    };

    const token = await jwt.sign(payload, JWT_SECRET_KEY);
    return res.status(200).json({
      status: true,
      message: "login success!",
      data: {
        token: token,
      },
    });

    // return res.json(data);
  },
  update: async (req, res) => {
    try {
      const { name, phone } = req.body;
      const user = req.user;

      const stringFile = req.file.buffer.toString("base64");
      const uploadFile = await imagekit.upload({
        fileName: req.file.originalname,
        file: stringFile,
      });

      User.update(
        { name: name, phone: phone, avatar: uploadFile.url },
        { where: { id: user.id } }
      );

      return res.status(200).json({
        status: true,
        message: "update profile success!",
        data: null,
      });
    } catch (err) {
      throw err;
    }
  },
};
