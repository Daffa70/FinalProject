'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OtpVerify extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OtpVerify.init({
    user_id: DataTypes.INTEGER,
    otp_num: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OtpVerify',
  });
  return OtpVerify;
};