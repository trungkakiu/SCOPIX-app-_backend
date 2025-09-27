export default (sequelize, DataTypes) => {
  const Tuvi = sequelize.define(
    "Tuvi",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Step: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      exp: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      power_min: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      power_max: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      part: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Tuvi",
      timestamps: true,
      underscored: true,
    }
  );

  return Tuvi;
};
