// Src/models/user.js
export default (sequelize, DataTypes) => {
  const top_10 = sequelize.define(
    "top_10",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      top: {
        type: DataTypes.ENUM("1", "2", "3", "4", "5", "6", "7", "8", "9", "10"),
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      comic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },

    {
      tableName: "top_10",
      timestamps: true,
      underscored: true,
    }
  );
  top_10.associate = (models) => {
    top_10.belongsTo(models.Comic, {
      foreignKey: "comicID",
      as: "comic_detail",
    });
  };

  return top_10;
};
