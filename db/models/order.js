"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Order.belongsTo(models.Flight_schedulle, {
        foreignKey: "schedulle_id",
        as: "schedulle",
      });

      models.Order.belongsTo(models.Flight_schedulle, {
        foreignKey: "schedulle_return_id",
        as: "schedulle_return",
      });

      models.Order.hasMany(models.Passenger, {
        foreignKey: "order_id",
        as: "passengers",
      });
    }
  }
  Order.init(
    {
      user_id: DataTypes.INTEGER,
      full_name: DataTypes.STRING,
      family_name: DataTypes.STRING,
      title: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.INTEGER,
      schedulle_id: DataTypes.INTEGER,
      schedulle_return_id: DataTypes.INTEGER,
      booking_code: DataTypes.STRING,
      total_price: DataTypes.INTEGER,
      url_midtrans: DataTypes.STRING,
      payment_status: DataTypes.STRING,
      last_payment_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
