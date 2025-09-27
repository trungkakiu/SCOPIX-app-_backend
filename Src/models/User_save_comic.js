export default (sequelize, DataTypes) => {
  const User_save_comic = sequelize.define(
    "User_save_comic",
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
      tableName: "User_save_comic",
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

  User_save_comic.associate = (models) => {
    User_save_comic.belongsTo(models.Account, {
      foreignKey: "UserID",
      as: "user",
    });

    User_save_comic.belongsTo(models.Comic, {
      foreignKey: "ComicID",
      as: "comic",
    });
  };

  return User_save_comic;
};
