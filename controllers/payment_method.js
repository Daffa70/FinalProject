const { Payment_method } = require("../db/models");

module.exports = {
  store: async(req, res) => {
    try {
      const {name, description} = req.body;

      const payment_method = await Payment_method.create({
        name, description
      });

      return res.status(201).json({
        status: true,
        message: 'success',
        data: payment_method
      });
    } catch (error) {
      throw error;
    }
  },

  showAll: async(req, res) => {
    try {
      const payment_method = await Payment_method.findAll();

      return res.status(200).json({
        status: true,
        message: 'success',
        data: payment_method
      });
    } catch (error) {
      throw error;
    }
  },

  showIndex: async(req, res) => {
    try {
      const {payment_method_id} = req.params;

      const payment_method = await Payment_method.findOne({where: {id: payment_method_id}});
      if(!payment_method){
        return res.status(404).json({
          status: false,
          message: `can't find payment method with id ${payment_method_id}!`,
          data: null
        });
      }

      return res.status(200).json({
        status: true,
        message: 'success',
        data: payment_method
      });
    } catch (error) {
      throw error;
    }
  },

  update: async(req, res) => {
    try {
      const {payment_method_id} = req.params;
      const data = req.body;

      const updated = await Payment_method.update(req.body, {where: {id: payment_method_id}});
      if (updated[0] == 0) {
        return res.status(404).json({
            status: false,
            message: `can't find payment method with id ${payment_method_id}!`,
            data: null
        });
      }

      return res.status(201).json({
        status: true,
        message: 'success',
        data: data
      });
    } catch (error) {
      throw error;
    }
  },

  destroy: async(req, res) => {
    try {
      const {payment_method_id} = req.params;

      const deleted = await Payment_method.destroy({where: {id: payment_method_id}});
      if (!deleted) {
        return res.status(404).json({
            status: false,
            message: `can't find payment method with id ${payment_method_id}!`,
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
