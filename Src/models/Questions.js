export default (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "Question",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isCorrect: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: "A",
      },
    },
    {
      tableName: "Question",
      timestamps: true,
      underscored: true,
    }
  );

  Question.associate = (models) => {
    Question.hasMany(models.Answer, {
      foreignKey: "questionId",
      as: "answers",
    });
  };

  return Question;
};
