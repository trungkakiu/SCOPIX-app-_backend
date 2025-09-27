export default (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "Notification",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("system", "event", "payment", "giftcode"),
        allowNull: false,
        defaultValue: "system",
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isread: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: DataTypes.ENUM("active", "delete"),
        allowNull: false,
        defaultValue: "active",
      },
    },
    {
      tableName: "Notification",
      timestamps: true,
      underscored: true,
    }
  );

  Notification.associate = (models) => {
    Notification.belongsTo(models.Account, {
      foreignKey: "UserID",
      sourceKey: "id",
      as: "user",
    });
  };

  return Notification;
};
