const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelize");

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "utilizador",
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

module.exports = User;
