async function up(queryInterface, Sequelize, transaction) {
  await queryInterface.createTable(
    "collection_history",
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      collectionCardId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "collection_cards",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      campo: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      valorAntigo: {
        type: Sequelize.DataTypes.TEXT,
      },

      valorNovo: {
        type: Sequelize.DataTypes.TEXT,
      },

      dataAlteracao: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    },
    { transaction }
  );
}

module.exports = { up };