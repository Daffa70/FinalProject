const { Order } = require("../db/models");

module.exports = {
  store: async(req, res) => {
    try {
      const {user_id, full_name, family_name, title, email, phone} = req.body;

      const order = await Order.create({
        user_id, full_name, family_name, title, email, phone
      });

      return res.status(201).json({
        status: true,
        message: 'success',
        data: order
      });
    } catch (error) {
      throw error;
    }
  },

  showAll: async(req, res) => {
    try {
      const order = await Order.findAll();

      return res.status(200).json({
        status: true,
        message: 'success',
        data: order
      });
    } catch (error) {
      throw error;
    }
  },

  showIndex: async(req, res) => {
    try {
      const {order_id} = req.params;

      const order = await Order.findOne({where: {id: order_id}});
      if(!order){
        return res.status(404).json({
          status: false,
          message: `can't find order with id ${order_id}!`,
          data: null
        });
      }

      return res.status(200).json({
        status: true,
        message: 'success',
        data: order
      });
    } catch (error) {
      throw error;
    }
  },

  update: async(req, res) => {
    try {
      const {order_id} = req.params;
      const data = req.body;

      const updated = await Order.update(req.body, {where: {id: order_id}});
      if (updated[0] == 0) {
        return res.status(404).json({
            status: false,
            message: `can't find order with id ${order_id}!`,
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
      const {order_id} = req.params;

      const deleted = await Order.destroy({where: {id: order_id}});
      if (!deleted) {
        return res.status(404).json({
            status: false,
            message: `can't find order with id ${order_id}!`,
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
