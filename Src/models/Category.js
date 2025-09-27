// Src/models/category.js
export default (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      category_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "Category",
      timestamps: true,
      underscored: true,
    }
  );

  Category.associate = (models) => {
    Category.belongsToMany(models.Comic, {
      through: "ComicCategory",
      foreignKey: "category_id",
      otherKey: "comic_id",
      as: "comics",
    });
  };

  return Category;
};
