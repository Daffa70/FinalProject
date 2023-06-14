const { Notification } = require("../db/models");

module.exports = {
  sendNotification: async (userId, title, description) => {
    const notification = Notification.create({
      user_id: userId,
      title: title,
      description: description,
      is_read: false,
    });

    return true;
  },

  getNotify: async (req, res) => {
    try {
      const { id: user_id } = req.user;
      const notification = await Notification.findOne({
        user_id,
      });

      if (!notification) {
        return res.status(404).json({
          status: false,
          message: `There are no notifications for this user`,
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "success",
        data: notification,
      });
    } catch (error) {
      throw error;
    }
  },
};
