export default (sequelize, DataTypes) => {
  const PhonecardTransaction = sequelize.define(
    "PhonecardTransaction",
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
      cardnumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cardseri: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cardtype: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.STRING,
        allowNull: true,
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
      tableName: "PhonecardTransaction",
      timestamps: true,
      underscored: false,
    }
  );

  PhonecardTransaction.associate = (models) => {
    PhonecardTransaction.belongsTo(models.Account, {
      foreignKey: "userid",
      targetKey: "id",
      as: "user",
    });
  };

  return PhonecardTransaction;
};
