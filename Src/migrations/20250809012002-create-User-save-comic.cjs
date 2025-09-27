"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("User_save_comic", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      UserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Account",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      ComicID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Comic",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addIndex("User_save_comic", ["UserID", "ComicID"], {
      name: "user_save_comic_index",
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("User_save_comic");
  },
};
