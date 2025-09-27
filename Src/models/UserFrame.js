export default (sequelize, DataTypes) => {
  const UserFrame = sequelize.define(
    "UserFrame",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      UserID: {
        type: DataTypes.INTEGER,
        field: "UserID",
        references: {
          model: "Account",
          key: "id",
        },
      },
      FrameID: {
        type: DataTypes.INTEGER,
        field: "FrameID",
        references: {
          model: "Avatarframe",
          key: "id",
        },
      },
      IsUsed: {
        type: DataTypes.BOOLEAN,
        field: "IsUsed",
      },
    },
    {
      tableName: "UserFrame",
      timestamps: true,
      underscored: false,
    }
  );

  UserFrame.associate = (models) => {
    UserFrame.belongsTo(models.Avatarframe, {
      foreignKey: "FrameID",
      as: "avatarFrame",
    });
    UserFrame.belongsTo(models.Account, {
      foreignKey: "UserID",
      targetKey: "id",
      as: "user",
    });
  };

  return UserFrame;
};
