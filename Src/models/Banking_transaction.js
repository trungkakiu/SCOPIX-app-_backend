export default (sequelize, DataTypes) => {
  const BankingTransaction = sequelize.define(
    "BankingTransaction",
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
      account_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      account_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bank: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      qr_data: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      bankingcode: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      exprie: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "success", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      tableName: "BankingTransaction",
      timestamps: true,
      underscored: false,
    }
  );

  BankingTransaction.associate = (models) => {
    BankingTransaction.belongsTo(models.Account, {
      foreignKey: "userid",
      targetKey: "id",
      as: "user",
    });
  };

  return BankingTransaction;
};
