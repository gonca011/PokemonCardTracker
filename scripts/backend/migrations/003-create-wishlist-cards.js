async function up(queryInterface, Sequelize, transaction) {
  await queryInterface.createTable(
    "wishlist_cards",
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
      data_adicao: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      preco_alvo: {
        type: Sequelize.DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      prioridade: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: "media",
      },
    },
    { transaction }
  );

  await queryInterface.addIndex("wishlist_cards", ["userId", "cardId"], {
    unique: true,
    name: "wishlist_cards_user_card_unique",
    transaction,
  });
}

module.exports = {
  up,
};
