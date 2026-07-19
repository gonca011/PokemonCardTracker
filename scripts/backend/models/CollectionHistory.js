const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelize");

const CollectionHistory = sequelize.define(
  "CollectionHistory",
  {
    collectionCardId: DataTypes.INTEGER,

    campo: DataTypes.STRING,

    valorAntigo: DataTypes.TEXT,

    valorNovo: DataTypes.TEXT,

    dataAlteracao: DataTypes.DATE
  },
  {
    tableName: "collection_history",
    timestamps: false
  }
);

module.exports = CollectionHistory;