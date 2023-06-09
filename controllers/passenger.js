const { Passenger } = require("../db/models");

module.exports = {
  store: async(req, res) => {
    try {
      const {order_id, booking_order, full_name, family_name, phone, email, title, date_birth, nationality, identity_number, issuing_country, identity_expired, schedule_id, seat_id} = req.body;

      const passenger = await Passenger.create({
        order_id, booking_order, full_name, family_name, phone, email, title, date_birth, nationality, identity_number, issuing_country, identity_expired, schedule_id, seat_id
      });

      return res.status(201).json({
        status: true,
        message: 'success',
        data: passenger
      });
    } catch (error) {
      throw error;
    }
  },

  showAll: async(req, res) => {
    try {
      const passenger = await Passenger.findAll();

      return res.status(200).json({
        status: true,
        message: 'success',
        data: passenger
      });
    } catch (error) {
      throw error;
    }
  },

  showIndex: async(req, res) => {
    try {
      const {passenger_id} = req.params;

      const passenger = await Passenger.findOne({where: {id: passenger_id}});
      if(!passenger){
        return res.status(404).json({
          status: false,
          message: `can't find passenger with id ${passenger_id}!`,
          data: null
        });
      }

      return res.status(200).json({
        status: true,
        message: 'success',
        data: passenger
      });
    } catch (error) {
      throw error;
    }
  },

  update: async(req, res) => {
    try {
      const {passenger_id} = req.params;

      const updated = await Passenger.update(req.body, {where: {id: passenger_id}});
      if (!updated) {
        return res.status(404).json({
            status: false,
            message: `can't find passenger with id ${passenger_id}!`,
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
      const {passenger_id} = req.params;

      const deleted = await Passenger.destroy({where: {id: passenger_id}});
      if (!deleted) {
        return res.status(404).json({
            status: false,
            message: `can't find passenger with id ${passenger_id}!`,
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
