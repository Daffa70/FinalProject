const { Payment } = require("../db/models");

module.exports = {
  store: async(req, res) => {
    try {
      const {booking_id, method_id, status} = req.body;

      const payment = await Payment.create({
        booking_id, method_id, status
      });

      return res.status(201).json({
        status: true,
        message: 'success',
        data: payment
      });
    } catch (error) {
      throw error;
    }
  },

  showAll: async(req, res) => {
    try {
      const payment = await Payment.findAll();

      return res.status(200).json({
        status: true,
        message: 'success',
        data: payment
      });
    } catch (error) {
      throw error;
    }
  },

  showIndex: async(req, res) => {
    try {
      const {payment_id} = req.params;

      const payment = await Payment.findOne({where: {id: payment_id}});
      if(!payment){
        return res.status(404).json({
          status: false,
          message: `can't find payment with id ${payment_id}!`,
          data: null
        });
      }

      return res.status(200).json({
        status: true,
        message: 'success',
        data: payment
      });
    } catch (error) {
      throw error;
    }
  },

  update: async(req, res) => {
    try {
      const {payment_id} = req.params;

      const updated = await Payment.update(req.body, {where: {id: payment_id}});
      if (!updated) {
        return res.status(404).json({
            status: false,
            message: `can't find payment with id ${payment_id}!`,
            data: null
        });
      }

      return res.status(201).json({
        status: true,
        message: 'success',
        data: updated
      });
    } catch (error) {
      throw error;
    }
  },

  destroy: async(req, res) => {
    try {
      const {payment_id} = req.params;

      const deleted = await Payment.destroy({where: {id: payment_id}});
      if (!deleted) {
        return res.status(404).json({
            status: false,
            message: `can't find payment with id ${payment_id}!`,
            data: null
        });
      }

      return res.status(200).json({
        status: true,
        message: 'success',
        data: null
      });
    } catch (error) {
      throw error;
    }
  }
};
