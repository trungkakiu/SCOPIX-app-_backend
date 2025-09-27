"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ComicCategory", {
      comic_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Comic",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Category",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint("ComicCategory", {
      fields: ["comic_id", "category_id"],
      type: "primary key",
      name: "PK_comic_category",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("ComicCategory");
  },
};
