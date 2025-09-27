export default (sequelize, DataTypes) => {
  const Chapter = sequelize.define(
    "Chapter",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      comic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Comic",
          key: "id",
        },
      },
      chapter_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
        uniqueKeys: {
          unique_comic_chapter: {
            fields: ["comic_id", "chapter_number"],
          },
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "Chapter",
      timestamps: true,
      underscored: true,
    }
  );

  Chapter.associate = (models) => {
    Chapter.hasMany(models.chapter_image, {
      foreignKey: "chapter_id",
      as: "images",
      onDelete: "CASCADE",
    });
    Chapter.belongsTo(models.Comic, {
      foreignKey: "comic_id",
      as: "comic",
      onDelete: "CASCADE",
    });

    Chapter.hasMany(models.ComicChapterComment, {
      foreignKey: "Chapter",
      as: "comments",
      onDelete: "CASCADE",
    });
  };

  return Chapter;
};
