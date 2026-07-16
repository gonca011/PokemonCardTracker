const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelize");

const WishlistCard = sequelize.define(
  "WishlistCard",
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
    data_adicao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    preco_alvo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    prioridade: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "media",
    },
  },
  {
    tableName: "wishlist_cards",
    timestamps: false,
  }
);

module.exports = WishlistCard;
