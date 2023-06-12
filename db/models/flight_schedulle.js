"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Flight_schedulle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Flight_schedulle.init(
    {
      airplane_id: DataTypes.INTEGER,
      departure_time: DataTypes.DATE,
      arrival_time: DataTypes.DATE,
      departure_airport_id: DataTypes.INTEGER,
      arrival_airport_id: DataTypes.INTEGER,
      flight_number: DataTypes.STRING,
      free_baggage: DataTypes.INTEGER,
      cabin_baggage: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Flight_schedulle",
    }
  );
  return Flight_schedulle;
};
