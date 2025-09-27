export default (sequelize, DataTypes) => {
  const CoinTransaction = sequelize.define(
    "CoinTransaction",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("deposit", "spend", "gift", "refund"),
        allowNull: false,
        defaultValue: "deposit",
      },
      status: {
        type: DataTypes.ENUM("pending", "success", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      tableName: "CoinTransaction",
      timestamps: true,
      underscored: false,
    }
  );

  CoinTransaction.associate = (models) => {
    CoinTransaction.belongsTo(models.Account, {
      foreignKey: "UserID",
      as: "coinTransactions",
    });
  };

  return CoinTransaction;
};
