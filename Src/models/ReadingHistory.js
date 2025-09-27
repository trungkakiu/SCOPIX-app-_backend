export default (sequelize, DataTypes) => {
  const ReadingHistory = sequelize.define(
    "ReadingHistory",
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
      ChapterID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Chapter",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      ChapterNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      liked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      saved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      tableName: "ReadingHistory",
      timestamps: true,
      underscored: false,
    }
  );

  ReadingHistory.associate = (models) => {
    ReadingHistory.belongsTo(models.Account, {
      foreignKey: "UserID",
      as: "user",
    });

    ReadingHistory.belongsTo(models.Comic, {
      foreignKey: "ComicID",
      as: "comic",
    });
  };

  return ReadingHistory;
};
