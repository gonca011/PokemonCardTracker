const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelize");

const CollectionCard = sequelize.define(
  "CollectionCard",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cardId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expansao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagem: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data_registo: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    preco_compra: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "collection_cards",
    timestamps: false,
  }
);

module.exports = CollectionCard;
