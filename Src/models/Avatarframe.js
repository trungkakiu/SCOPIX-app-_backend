export default (sequelize, DataTypes) => {
  const Avatarframe = sequelize.define(
    "Avatarframe",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      framename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Avatarframe",
      timestamps: true,
      underscored: false,
    }
  );
  Avatarframe.associate = (models) => {
    Avatarframe.hasMany(models.UserFrame, {
      foreignKey: "FrameID",
      as: "owners",
    });
  };
  return Avatarframe;
};
