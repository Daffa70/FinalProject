"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Airport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Airport.hasMany(models.Flight_schedulle, {
        foreignKey: "arrival_airport_id",
        as: "arrival_airport",
      });
    }
  }
  Airport.init(
    {
      name: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      airport_type: DataTypes.STRING,
      code: DataTypes.STRING,
      continent: DataTypes.STRING,
      total_visit: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Airport",
    }
  );
  return Airport;
};
