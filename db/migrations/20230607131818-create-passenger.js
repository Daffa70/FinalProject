'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Passengers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER
      },
      booking_order: {
        type: Sequelize.STRING
      },
      full_name: {
        type: Sequelize.STRING
      },
      family_name: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      date_birth: {
        type: Sequelize.DATE
      },
      nationality: {
        type: Sequelize.STRING
      },
      identity_number: {
        type: Sequelize.INTEGER
      },
      issuing_country: {
        type: Sequelize.STRING
      },
      identity_expired: {
        type: Sequelize.DATE
      },
      schedule_id: {
        type: Sequelize.INTEGER
      },
      seat_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Passengers');
  }
};