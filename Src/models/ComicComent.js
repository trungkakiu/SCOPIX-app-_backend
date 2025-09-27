export default (sequelize, DataTypes) => {
  const ComicComment = sequelize.define(
    "ComicComment",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      tableName: "ComicComment",
      timestamps: true,
      underscored: true,
    }
  );

  ComicComment.associate = (models) => {
    ComicComment.belongsTo(models.Account, {
      foreignKey: "userId",
      as: "user",
    });

    ComicComment.belongsTo(models.Comic, {
      foreignKey: "comicId",
      as: "comic",
    });

    ComicComment.belongsTo(models.ComicComment, {
      foreignKey: "parentId",
      as: "parent",
    });

    ComicComment.hasMany(models.ComicComment, {
      foreignKey: "parentId",
      as: "replies",
    });
  };

  return ComicComment;
};
