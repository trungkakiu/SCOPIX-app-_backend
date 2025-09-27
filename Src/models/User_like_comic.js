export default (sequelize, DataTypes) => {
  const User_like_comic = sequelize.define(
    "User_like_comic",
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
    },
    {
      tableName: "User_like_comic",
      timestamps: true,
      underscored: false,
      indexes: [
        {
          unique: true,
          fields: ["UserID", "ComicID"],
        },
      ],
    }
  );

  User_like_comic.associate = (models) => {
    User_like_comic.belongsTo(models.Account, {
      foreignKey: "UserID",
      as: "user",
    });

    User_like_comic.belongsTo(models.Comic, {
      foreignKey: "ComicID",
      as: "comic",
    });
  };

  return User_like_comic;
};
