export default (sequelize, DataTypes) => {
  const ComicChapterComment = sequelize.define(
    "ComicChapterComment",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Chapter: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      comicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("visible", "hidden", "deleted"),
        allowNull: false,
        defaultValue: "visible",
      },
    },
    {
      tableName: "ComicChapterComment",
      timestamps: true,
      underscored: true,
    }
  );

  ComicChapterComment.associate = (models) => {
    ComicChapterComment.belongsTo(models.Account, {
      foreignKey: "userId",
      as: "user",
    });

    ComicChapterComment.belongsTo(models.Comic, {
      foreignKey: "comicId",
      as: "comic",
    });

    ComicChapterComment.belongsTo(models.Chapter, {
      foreignKey: "Chapter",
      as: "chapter",
    });

    ComicChapterComment.belongsTo(models.ComicChapterComment, {
      foreignKey: "parentId",
      as: "parent",
    });

    ComicChapterComment.hasMany(models.ComicChapterComment, {
      foreignKey: "parentId",
      as: "replies",
    });
  };

  return ComicChapterComment;
};
