export default (sequelize, DataTypes) => {
  const Answer = sequelize.define(
    "Answer",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Question",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Answer",
      timestamps: true,
      underscored: true,
    }
  );

  Answer.associate = (models) => {
    Answer.belongsTo(models.Question, {
      foreignKey: "questionId",
      as: "question",
    });
  };

  return Answer;
};
