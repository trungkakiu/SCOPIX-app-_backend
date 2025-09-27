export default (sequelize, DataTypes) => {
  const chapter_image = sequelize.define(
    "chapter_image",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      chapter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Chapter",
          key: "id",
        },
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "chapter_image",
      timestamps: true,
      underscored: true,
    }
  );

  chapter_image.associate = (models) => {
    chapter_image.belongsTo(models.Chapter, {
      foreignKey: "chapter_id",
      as: "chapter",
      onDelete: "CASCADE",
    });
  };

  return chapter_image;
};
