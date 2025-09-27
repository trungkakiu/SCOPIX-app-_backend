export default (sequelize, DataTypes) => {
  const View_history = sequelize.define(
    "View_history",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Account",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      ComicID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Comic",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      ChapterNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "View_history",
      timestamps: true,
      underscored: false,
      indexes: [
        {
          name: "user_comic_chapter_index",
          fields: ["UserID", "ComicID", "ChapterNumber"],
          unique: true,
        },
      ],
    }
  );

  View_history.associate = (models) => {
    View_history.belongsTo(models.Account, {
      foreignKey: "UserID",
      as: "user",
    });

    View_history.belongsTo(models.Comic, {
      foreignKey: "ComicID",
      as: "comic",
    });
  };

  return View_history;
};
