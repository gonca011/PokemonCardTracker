async function up(queryInterface, Sequelize, transaction) {
  await queryInterface.createTable(
    "collection_cards",
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      cardId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      nome: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      expansao: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      imagem: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      data_registo: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      preco_compra: {
        type: Sequelize.DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      quantidade: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      estado: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      observacoes: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
    },
    { transaction }
  );

  await queryInterface.addIndex("collection_cards", ["userId", "cardId"], {
    unique: true,
    name: "collection_cards_user_card_unique",
    transaction,
  });
}

module.exports = {
  up,
};
