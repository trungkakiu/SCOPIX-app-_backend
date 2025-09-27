// Src/models/user.js
export default (sequelize, DataTypes) => {
  const Comic = sequelize.define(
    "Comic",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      view: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      like: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      rate: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cover_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      options: {
        type: DataTypes.ENUM("New", "Recoment", "NewUpdate", "Complate"),
        defaultValue: "New",
      },
      author: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Author",
          key: "id",
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "Comic",
      timestamps: true,
      underscored: true,
    }
  );
  Comic.associate = (models) => {
    Comic.belongsTo(models.Author, {
      foreignKey: "author",
      as: "AuthorInfo",
    });

    Comic.belongsToMany(models.Category, {
      through: "ComicCategory",
      foreignKey: "comic_id",
      otherKey: "category_id",
      as: "categories",
    });

    Comic.hasMany(models.Chapter, {
      foreignKey: "comic_id",
      as: "chapters",
      onDelete: "CASCADE",
    });

    Comic.hasMany(models.ReadingHistory, {
      foreignKey: "ComicID",
      as: "readinghistory",
    });
    Comic.hasMany(models.View_history, {
      foreignKey: "ComicID",
      as: "viewhistory",
    });
    Comic.hasMany(models.User_save_comic, {
      foreignKey: "ComicID",
      as: "savedComics",
      onDelete: "CASCADE",
    });
    Comic.hasMany(models.User_like_comic, {
      foreignKey: "ComicID",
      as: "likedComics",
      onDelete: "CASCADE",
    });
    Comic.hasMany(models.ComicComment, {
      foreignKey: "comicId",
      as: "comments",
      onDelete: "CASCADE",
    });
    Comic.hasMany(models.ComicChapterComment, {
      foreignKey: "comicId",
      as: "chapterComments",
      onDelete: "CASCADE",
    });
  };

  return Comic;
};
