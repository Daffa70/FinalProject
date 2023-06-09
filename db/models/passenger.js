'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Passenger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Passenger.init({
    order_id: DataTypes.INTEGER,
    booking_order: DataTypes.STRING,
    full_name: DataTypes.STRING,
    family_name: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    email: DataTypes.STRING,
    title: DataTypes.STRING,
    date_birth: DataTypes.DATE,
    nationality: DataTypes.STRING,
    identity_number: DataTypes.INTEGER,
    issuing_country: DataTypes.STRING,
    identity_expired: DataTypes.DATE,
    schedule_id: DataTypes.INTEGER,
    seat_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Passenger',
  });
  return Passenger;
};