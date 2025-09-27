export default (sequelize, DataTypes) => {
  const Coupon = sequelize.define(
    "Coupon",
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
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Used", "notUsed"),
        allowNull: false,
        defaultValue: "notUsed",
      },
      coin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "Coupon",
      timestamps: true,
      underscored: true,
    }
  );

  return Coupon;
};
