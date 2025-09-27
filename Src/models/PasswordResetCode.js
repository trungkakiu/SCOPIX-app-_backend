export default (sequelize, DataTypes) => {
  const PasswordResetCode = sequelize.define(
    "PasswordResetCode",
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
      resetcode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "PasswordResetCode",
      timestamps: true,
      underscored: true,
    }
  );

  PasswordResetCode.associate = (models) => {
    PasswordResetCode.hasMany(models.UserFrame, {
      foreignKey: "UserID",
      sourceKey: "id",
    });
  };

  return PasswordResetCode;
};
