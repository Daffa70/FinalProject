"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Seat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Seat.belongsTo(models.Flight_schedulle, {
        foreignKey: "schedulle_id",
        as: "flight_schedulle",
      });
    }
  }
  Seat.init(
    {
      schedulle_id: DataTypes.INTEGER,
      seat_no: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Seat",
    }
  );
  return Seat;
};
