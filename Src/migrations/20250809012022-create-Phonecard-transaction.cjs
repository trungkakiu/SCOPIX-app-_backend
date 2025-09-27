"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PhonecardTransaction", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Account",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      cardnumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cardseri: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cardtpye: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      exprie: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "success", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PhonecardTransaction");
  },
};
