// Src/models/user.js
export default (sequelize, DataTypes) => {
  const Author = sequelize.define(
    "Author",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Author_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "Author",
      timestamps: true,
      underscored: true,
    }
  );
  Author.associate = (models) => {
    Author.hasMany(models.Comic, {
      foreignKey: "author",
      as: "Comics",
    });
  };
  return Author;
};
