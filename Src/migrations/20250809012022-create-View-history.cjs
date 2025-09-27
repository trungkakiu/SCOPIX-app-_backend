"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("View_history", {
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
      ChapterNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.addIndex(
      "View_history",
      ["UserID", "ComicID", "ChapterNumber"],
      {
        name: "user_comic_chapter_index",
        unique: false,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("View_history");
  },
};
