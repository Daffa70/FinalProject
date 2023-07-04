"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Airplane extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Airplane.hasMany(models.Flight_schedulle, {
        foreignKey: "airplane_id",
        as: "schedulle",
      });
    }
  }
  Airplane.init(
    {
      model: DataTypes.STRING,
      code: DataTypes.STRING,
      seat_layout: DataTypes.STRING,
      total_seat: DataTypes.INTEGER,
      airline_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Airplane",
    }
  );
  return Airplane;
};
