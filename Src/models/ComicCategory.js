export default (sequelize, DataTypes) => {
  const ComicCategory = sequelize.define(
    "ComicCategory",
    {
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      comic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: "ComicCategory",
      timestamps: true,
      underscored: true,
      id: false,
    }
  );

  ComicCategory.associate = (models) => {
    ComicCategory.belongsTo(models.Comic, {
      foreignKey: "comic_id",
      as: "comic",
    });

    ComicCategory.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });
  };

  return ComicCategory;
};
