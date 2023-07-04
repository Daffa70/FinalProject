"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Flight_schedulle extends Model {
    static associate(models) {
      models.Flight_schedulle.belongsTo(models.Airplane, {
        foreignKey: "airplane_id",
        as: "airplane",
      });

      models.Flight_schedulle.belongsTo(models.Airport, {
        foreignKey: "departure_airport_id",
        as: "departure_airport",
      });

      models.Flight_schedulle.belongsTo(models.Airport, {
        foreignKey: "arrival_airport_id",
        as: "arrival_airport",
      });

      models.Flight_schedulle.belongsTo(models.SeatClass, {
        foreignKey: "class_id",
        as: "class",
      });

      models.Flight_schedulle.hasMany(models.Seat, {
        foreignKey: "schedulle_id",
        as: "seats",
      });
    }
  }
  Flight_schedulle.init(
    {
      airplane_id: DataTypes.INTEGER,
      departure_date: DataTypes.DATEONLY,
      departure_time: DataTypes.TIME,
      arrival_date: DataTypes.DATEONLY,
      arrival_time: DataTypes.TIME,
      departure_airport_id: DataTypes.INTEGER,
      arrival_airport_id: DataTypes.INTEGER,
      flight_number: DataTypes.STRING,
      free_baggage: DataTypes.INTEGER,
      cabin_baggage: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      class_id: DataTypes.INTEGER,
      duration: DataTypes.INTEGER,
      departure_terminal_name: DataTypes.STRING,
      arrival_terminal_name: DataTypes.STRING,
      seat_available: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Flight_schedulle",
    }
  );

  // Flight_schedulle.beforeCreate((flightSchedulle) => {
  //   if (flightSchedulle.departure_time) {
  //     const departureDateTime = new Date(flightSchedulle.departure_time);
  //     flightSchedulle.departure_date = departureDateTime
  //       .toISOString()
  //       .split("T")[0];
  //     flightSchedulle.departure_time = departureDateTime
  //       .toISOString()
  //       .split("T")[1]
  //       .slice(0, 8);
  //   }

  //   if (flightSchedulle.arrival_time) {
  //     const arrivalDateTime = new Date(flightSchedulle.arrival_time);
  //     flightSchedulle.arrival_date = arrivalDateTime
  //       .toISOString()
  //       .split("T")[0];
  //     flightSchedulle.arrival_time = arrivalDateTime
  //       .toISOString()
  //       .split("T")[1]
  //       .slice(0, 8);
  //   }
  // });
  return Flight_schedulle;
};
