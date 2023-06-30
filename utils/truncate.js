const { Flight_schedulle, Seat } = require("../db/models");

module.exports = {
  schedulle: async () => {
    await Flight_schedulle.destroy({ truncate: true, restartIdentity: true });
  },

  seat: async () => {
    await Seat.destroy({ truncate: true, restartIdentity: true });
  },
};
