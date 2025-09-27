export default (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "Account",
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      coin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      sucmanh: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 10,
      },
      tuvi: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Phàm nhân",
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      background: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "Account",
      timestamps: true,
      underscored: true,
    }
  );

  Account.associate = (models) => {
    Account.hasMany(models.UserFrame, {
      foreignKey: "UserID",
      sourceKey: "id",
      as: "ownedFrames",
    });
    Account.hasMany(models.ReadingHistory, {
      foreignKey: "UserID",
      as: "readinghistory",
    });
    Account.hasMany(models.View_history, {
      foreignKey: "UserID",
      as: "viewhistory",
    });
    Account.hasMany(models.User_like_comic, {
      foreignKey: "UserID",
      as: "likedComics",
    });
    Account.hasMany(models.User_save_comic, {
      foreignKey: "UserID",
      as: "savedComics",
    });
    Account.hasMany(models.CoinTransaction, {
      foreignKey: "UserID",
      as: "coinTransactions",
    });
    Account.hasMany(models.ComicComment, {
      foreignKey: "userId",
      as: "comments",
    });
    Account.hasMany(models.Notification, {
      foreignKey: "UserID",
      sourceKey: "id",
      as: "notifications",
    });
    Account.hasMany(models.BankingTransaction, {
      foreignKey: "userid",
      sourceKey: "id",
      as: "bankingTransactions",
    });
    Account.hasMany(models.ComicChapterComment, {
      foreignKey: "userId",
      sourceKey: "id",
      as: "chapterComments",
    });
    Account.hasMany(models.PasswordResetCode, {
      foreignKey: "userid",
      sourceKey: "id",
      as: "passwordResetCodes",
    });
  };

  return Account;
};
